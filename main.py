from fastapi import FastAPI, UploadFile, File
from nudenet import NudeClassifier
import shutil
import os

app = FastAPI()
classifier = NudeClassifier()

@app.post("/detect")
async def detect_fake_nude(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    with open("temp.jpg", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Classify the image using NudeNet
    result = classifier.classify("temp.jpg")
    os.remove("temp.jpg")  # Clean up

    unsafe_score = result.get("temp.jpg", {}).get("unsafe", 0)
    
    return {
        "nudity_detected": unsafe_score > 0.8,
        "unsafe_score": round(unsafe_score, 3),
        "safe_score": round(result.get("temp.jpg", {}).get("safe", 0), 3)
    }
