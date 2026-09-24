from fastapi import FastAPI

from app.api.products import router as products_router
from app.api.tags import router as tags_router
from app.models.tag import Tag


app = FastAPI(title="SmartTag API")


@app.get("/")
def home():
    return {
        "message": "SmartTag Backend is running!"
    }


app.include_router(products_router)
app.include_router(tags_router)