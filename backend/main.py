
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import aiofiles
from analyzer.core import analyze_file

app = FastAPI(title="Malware Detector API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production (Vercel/Render)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
