from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse
from nudenet import NudeClassifier
import shutil
import os

app = FastAPI()
classifier = NudeClassifier()

@app.get("/", response_class=HTMLResponse)
def home():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.post("/detect")
async def detect_fake_nude(file: UploadFile = File(...)):
    with open("temp.jpg", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = classifier.classify("temp.jpg")
    os.remove("temp.jpg")

    unsafe_score = result.get("temp.jpg", {}).get("unsafe", 0)
    safe_score = result.get("temp.jpg", {}).get("safe", 0)

    return {
        "nudity_detected": unsafe_score > 0.8,
        "unsafe_score": round(unsafe_score, 3),
        "safe_score": round(safe_score, 3)
    }
