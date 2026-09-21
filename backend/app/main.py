from fastapi import FastAPI

app = FastAPI(title="SmartTag API")

@app.get("/")
def home():
    return {
        "message": "SmartTag Backend is running!"
    }

@app.get("/health")
def health():
    return {"status": "ok"}