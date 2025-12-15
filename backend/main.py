from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, status, Request


from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
import uvicorn
import shutil
import os
import aiofiles
import asyncio
from typing import List, Optional
from datetime import datetime, timedelta # Fixed Import
import requests
import razorpay
from pydantic import BaseModel
from sqlalchemy.orm import Session
import secrets
import random # Added

# Internal Modules
from backend.analyzer.core import analyze_file as core_analyze_file
from backend.analyzer.doc_analyzer import analyze_document
from backend.analyzer.doc_analyzer import analyze_document
from backend.analyzer.url_analyzer import analyze_url
from backend.analyzer.metadata_utils import extract_metadata, remove_metadata, spoof_metadata, clean_files_and_zip
from backend.analyzer.site_auditor import analyze_site
from backend.analyzer.site_auditor import analyze_site

# Auth & DB Modules
from backend import models
from backend import database
from backend import auth
from backend.database import engine, get_db
from backend.email_utils import send_otp_email 

# Create Tables
models.Base.metadata.create_all(bind=engine)

# --- Rate Limiter ---
class GuestRateLimiter:
    def __init__(self, limit: int = 5, window_seconds: int = 86400):
        self.limit = limit
        self.window = window_seconds
        self.history = {} # {ip: [timestamps]}

    def check(self, ip: str) -> bool:
        now = datetime.now()
        if ip not in self.history:
            self.history[ip] = []
        
        # Filter out old requests
        self.history[ip] = [t for t in self.history[ip] if (now - t).total_seconds() < self.window]
        
        if len(self.history[ip]) >= self.limit:
            return False
            
        self.history[ip].append(now)
        return True

# Initialize Limiter (100 scans per 24h for guests)
limiter = GuestRateLimiter(limit=100)

def check_guest_limit(request: Request, user: Optional[models.User] = Depends(auth.get_current_user_optional_fast)):
    if user:
        return # Logged-in users override limit
        
    client_ip = request.client.host
    if not limiter.check(client_ip):
        raise HTTPException(
            status_code=429, 
            detail="Guest limit reached (5 scans/day). Please logging in or purchase a key."
        )

# Initialize Razorpay Client from Env
razorpay_client = razorpay.Client(auth=(
    os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder"), 
    os.getenv("RAZORPAY_KEY_SECRET", "secret_placeholder")
))

app = FastAPI(title="ScanSecure API", version="2.0")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    error_msg = "".join(traceback.format_exception(None, exc, exc.__traceback__))
    print(f"🔥 CRITICAL SERVER ERROR 🔥:\n{error_msg}")
    with open("server_error.log", "a") as f:
        f.write(f"ERROR: {error_msg}\n")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "trace": str(exc)},
    )

# --- Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class URLRequest(BaseModel):
    url: str

class UserCreate(BaseModel):
    email: str
    password: str

class ScanResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    verdict: str
    timestamp: datetime
    details: Optional[str] = None
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    email: str
    api_key: str
    scans: List[ScanResponse] = []
    class Config:
        from_attributes = True

# Initialize Razorpay Client


class OrderRequest(BaseModel):
    amount: int

class ResendRequest(BaseModel):
    email: str

class VerifyRequest(BaseModel):
    email: str
    otp: str

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://scansecure.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth Endpoints ---
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    hashed_password = auth.get_password_hash(user.password)
    
    try:
        # Fix: Generate a random API key (Previous JWT slice was not unique)
        api_key = f"sk_{secrets.token_urlsafe(24)}"
        new_user = models.User(
            email=user.email, 
            hashed_password=hashed_password, 
            api_key=api_key,
            verified=False, 
            otp_code=otp
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    
    # Send Email
    try:
        await send_otp_email(user.email, otp)
    except Exception as e:
        print(f"Failed to send email: {e}")
    
    return new_user

# ... (resend_otp function skipped)

@app.post("/auth/verify")
async def verify_email(request: VerifyRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == request.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
    
    if db_user.verified:
         return {"message": "Already verified"}

    if db_user.otp_code != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    db_user.verified = True
    db_user.otp_code = None
    db.commit()
    
    return {"message": "Email verified successfully"}

@app.post("/auth/resend-otp")
async def resend_otp(request: ResendRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == request.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if db_user.verified:
        return {"message": "User already verified"}
        
    new_otp = str(random.randint(100000, 999999))
    db_user.otp_code = new_otp
    db.commit()
    
    await send_otp_email(db_user.email, new_otp)
    return {"message": "OTP resent"}

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

@app.post("/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == request.email).first()
    if not db_user:
        # For security, we might want to return 200 even if user doesn't exist, 
        # but for this specific UX (user knows they are registered), 404 is helpful.
        raise HTTPException(status_code=404, detail="User not found")
        
    otp = str(random.randint(100000, 999999))
    db_user.otp_code = otp
    db.commit()
    
    await send_otp_email(db_user.email, otp)
    return {"message": "Reset code sent to your email"}

@app.post("/auth/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == request.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.otp_code != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    # Reset Password
    db_user.hashed_password = auth.get_password_hash(request.new_password)
    db_user.otp_code = None
    db_user.verified = True # Auto-verify if they can prove ownership via OTP
    db.commit()
    
    return {"message": "Password updated successfully. You can now login."}

@app.post("/auth/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check Verification
    if not user.verified:
        raise HTTPException(
            status_code=400, 
            detail="Email not verified. Please verify your account."
        ) 

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- Existing Endpoints ---

@app.post("/scan-url")
async def scan_url(request: URLRequest, _: None = Depends(check_guest_limit)):
    import asyncio
    print(f"Scanning URL: {request.url}")
    result = await asyncio.to_thread(analyze_url, request.url) 
    return result.to_dict()

@app.post("/create-order")
async def create_order(request: OrderRequest):
    try:
        data = { "amount": request.amount, "currency": "INR", "receipt": "order_rcptid_11" }
        order = razorpay_client.order.create(data=data)
        return order
    except Exception as e:
        print(f"Razorpay Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

os.makedirs("uploads", exist_ok=True)

# --- Metadata Cleaner Endpoints ---

@app.post("/tools/analyze-metadata")
async def analyze_metadata_endpoint(
    file: UploadFile = File(...),
    request: Request = None,
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional_fast)
):
    # Rate Limit Check
    check_guest_limit(request, current_user)
    
    contents = await file.read()
    metadata = extract_metadata(contents)
    return metadata

@app.post("/tools/clean-metadata")
async def clean_metadata_endpoint(
    file: UploadFile = File(...),
    request: Request = None,
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional_fast)
):
    # Rate Limit Check
    check_guest_limit(request, current_user)
    
    contents = await file.read()
    clean_bytes = remove_metadata(contents)
    
    # Return as downloadable blob
    from fastapi.responses import Response
    return Response(content=clean_bytes, media_type="image/jpeg")

@app.post("/tools/spoof-metadata")
async def spoof_metadata_endpoint(
    lat: float = Form(...),
    lon: float = Form(...),
    file: UploadFile = File(...),
    request: Request = None,
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional_fast)
):
    check_guest_limit(request, current_user)
    contents = await file.read()
    spoofed_bytes = spoof_metadata(contents, lat, lon)
    from fastapi.responses import Response
    return Response(content=spoofed_bytes, media_type="image/jpeg")

@app.post("/tools/bulk-clean")
async def bulk_clean_endpoint(
    files: List[UploadFile] = File(...),
    request: Request = None,
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional_fast)
):
    check_guest_limit(request, current_user)
    
    files_data = []
    for f in files:
        content = await f.read()
        files_data.append((f.filename, content))
        
    zip_bytes = clean_files_and_zip(files_data)
    from fastapi.responses import Response
    return Response(content=zip_bytes, media_type="application/zip")



@app.post("/tools/audit-site")
async def audit_site_endpoint(
    request: URLRequest,
    req: Request, # Rename to avoid conflict with 'request' body
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional_fast)
):
    check_guest_limit(req, current_user)
    
    import asyncio
    
    # 1. Analyze User Site
    user_report = await asyncio.to_thread(analyze_site, request.url)
    
    return user_report

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Malware Detector API is running"}

@app.get("/debug-ping")
def debug_ping():
    return {"pong": True}

@app.get("/debug-db")
def debug_db(db: Session = Depends(get_db)):
    return {"pong": True, "db": "connected"}

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...), 
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional_fast),
    db: Session = Depends(get_db),
    _: None = Depends(check_guest_limit) # Enforce Limit
):
    print(f"Received upload request: {file.filename} (User: {current_user.email if current_user else 'Guest'})")
    try:
        file_location = f"uploads/{file.filename}"
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
            
        import asyncio
        report = await asyncio.to_thread(core_analyze_file, file_location, file.filename)
        
        if current_user:
            try:
                risk = report.get("risk_score", 0)
                verdict = "Safe"
                if risk >= 7: verdict = "Malicious"
                elif risk >= 4: verdict = "Suspicious"
                
                new_scan = models.Scan(
                    user_id=current_user.id,
                    filename=file.filename,
                    file_type=report.get("file_type", "unknown"),
                    verdict=verdict,
                    details=str(report.get("summary", "Analysis completed"))[:500] 
                )
                db.add(new_scan)
                db.commit()
                print("Scan saved to user history.")
            except Exception as db_e:
                print(f"Failed to save scan history: {db_e}")

        try:
           if os.path.exists(file_location):
               os.remove(file_location)
        except: pass
        
        return report
    except Exception as e:
        print(f"Error processing upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))
from datetime import timedelta # Missing import fix
