from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
import httpx
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta

# Import your existing Auth/DB modules
# Adjust imports based on your project structure
from backend.database import get_db
from backend.models import User
from backend.auth import create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
# from backend.schemas import Token # If needed

from pathlib import Path

# Load .env from backend directory explicitly
env_path = Path(".") / "backend" / ".env"
load_dotenv(dotenv_path=env_path)

# Verify IDs loaded
if not os.getenv("GOOGLE_CLIENT_ID"):
    print("❌ ERROR: GOOGLE_CLIENT_ID not found in environment!")

router = APIRouter(prefix="/auth", tags=["Social Auth"])

# --- CONFIG ---
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# Determine Redirect URI based on environment (Local vs Render)
# For simplicity, we might hardcode or use an ENV var for BASE_URL
# In PROD: https://securescane-backend.onrender.com
# In DEV: http://localhost:8082
# PROD: https://mysecurescan.onrender.com
# DEV: http://localhost:8082
BACKEND_URL = os.getenv("NEXT_PUBLIC_API_URL", "https://mysecurescan.onrender.com")

# Note: Google requires EXACT match. 
# Ideally, define "GOOGLE_REDIRECT_URI" in .env
GOOGLE_REDIRECT_URI = f"{BACKEND_URL}/auth/google/callback"

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = f"{BACKEND_URL}/auth/github/callback"

# PROD: https://mysecurescan.tech (Custom Domain)
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://mysecurescan.tech")

# --- GOOGLE ---

@router.get("/google/login")
async def login_google():
    print(f"DEBUG: Google Redirect URI: {GOOGLE_REDIRECT_URI}")
    return RedirectResponse(
        f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&access_type=offline"
    )

@router.get("/google/callback")
async def callback_google(code: str, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        # Exchange code for token
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }
        res = await client.post(token_url, data=data)
        if res.status_code != 200:
             # Redirect to Frontend with Error
            return RedirectResponse(f"{FRONTEND_URL}/auth/login?error=Google_Auth_Failed")
        
        token_data = res.json()
        access_token = token_data.get("access_token")

        # Get User Info
        user_info_res = await client.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {access_token}"})
        user_info = user_info_res.json()
        
        email = user_info.get("email")
        if not email:
            return RedirectResponse(f"{FRONTEND_URL}/auth/login?error=No_Email_Provided")

        # Logic: Find or Create User
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create new user (Generate random password)
            import secrets
            random_pass = secrets.token_urlsafe(16)
            hashed_pass = get_password_hash(random_pass)
            
            user = User(
                email=email,
                hashed_password=hashed_pass,
                verified=True,
                api_key=secrets.token_hex(16)
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Generate JWT
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        # Redirect to Frontend with Token (In URL fragment or Query param)
        # Security Note: Sending token in URL is okay for single-use or short-lived, 
        # but ideally we use a cookie or a bridging page. 
        # For this demo, we'll append it to the URL query param.
        return RedirectResponse(f"{FRONTEND_URL}/auth/social-callback?token={jwt_token}&email={email}")


# --- GITHUB ---

@router.get("/github/login")
async def login_github():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={GITHUB_REDIRECT_URI}&scope=user:email"
    )

@router.get("/github/callback")
async def callback_github(code: str, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        # Exchange code for token
        data = {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        }
        headers = {"Accept": "application/json"}
        res = await client.post("https://github.com/login/oauth/access_token", json=data, headers=headers)
        if res.status_code != 200:
            return RedirectResponse(f"{FRONTEND_URL}/auth/login?error=Github_Auth_Failed")
        
        token_data = res.json()
        access_token = token_data.get("access_token")

        # Get User Email (GitHub allows private emails)
        user_res = await client.get("https://api.github.com/user/emails", headers={"Authorization": f"Bearer {access_token}"})
        emails = user_res.json() # List of emails
        
        # Find primary/verified email
        primary_email = None
        if isinstance(emails, list):
            for e in emails:
                if e.get("primary") and e.get("verified"):
                    primary_email = e.get("email")
                    break
        
        if not primary_email:
             # Fallback to public profile email
             user_profile = await client.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}"})
             primary_email = user_profile.json().get("email")

        if not primary_email:
             return RedirectResponse(f"{FRONTEND_URL}/auth/login?error=No_Github_Email")

        # Logic: Find or Create User (Same as Google)
        user = db.query(User).filter(User.email == primary_email).first()
        if not user:
            import secrets
            random_pass = secrets.token_urlsafe(16)
            hashed_pass = get_password_hash(random_pass)
            
            user = User(
                email=primary_email,
                hashed_password=hashed_pass,
                verified=True,
                api_key=secrets.token_hex(16)
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Generate JWT
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        return RedirectResponse(f"{FRONTEND_URL}/auth/social-callback?token={jwt_token}&email={primary_email}")
