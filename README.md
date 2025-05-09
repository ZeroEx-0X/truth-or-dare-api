# Fake Nude Detector API

This FastAPI app detects fake nude/NSFW images using NudeNet.

## Endpoint

POST `/detect`  
Form-data: image file (key = `file`)

## Deployment

Deploy to Render or run locally using:

```bash
uvicorn main:app --reload
