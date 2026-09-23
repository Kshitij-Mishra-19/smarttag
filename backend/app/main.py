from fastapi import FastAPI

from app.api.products import router as products_router


app = FastAPI(title="SmartTag API")


@app.get("/")
def home():
    return {
        "message": "SmartTag Backend is running!"
    }


app.include_router(products_router)