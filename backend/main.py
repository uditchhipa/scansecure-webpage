

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import aiofiles
from analyzer.core import analyze_file
import razorpay
from pydantic import BaseModel

app = FastAPI()

# Initialize Razorpay Client (Keys provided by user)
# In production, use os.getenv("RAZORPAY_KEY_ID")
razorpay_client = razorpay.Client(auth=("rzp_test_RrD6BJSObt6orj", "ll4TnA6cyYd65QeKNE4OdZGz"))

class OrderRequest(BaseModel):
    amount: int  # Amount in paise (e.g., 4900 = ₹49)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-vercel-app.vercel.app", 
    "*" # Allow all for simplicity during MVP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Malware Detector API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"Received upload request: {file.filename}")
    try:
        file_location = f"uploads/{file.filename}"
        print(f"Saving to {file_location}")
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        print("File saved successfully")
            
        # Run analysis
        print("Starting analysis...")
        report = analyze_file(file_location, file.filename)
        print("Analysis complete")
        
        # Cleanup (optional, keeping for inspection for now)
        # os.remove(file_location)
        
        return report
    except Exception as e:
        print(f"Error processing upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))
