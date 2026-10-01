from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.products import router as products_router
from app.api.tags import router as tags_router
from app.models.tag import Tag
from app.models.order import Order
from app.api.orders import router as orders_router


app = FastAPI(title="SmartTag API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "SmartTag Backend is running!"
    }


app.include_router(products_router)
app.include_router(tags_router)
app.include_router(orders_router)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SmartTag API",
    }
