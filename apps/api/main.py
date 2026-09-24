from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SmartTag API",
    version="0.2.0",
    description="Backend API for the SmartTag retail platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


products = [
    {
        "id": "ST-TS-001",
        "name": "Black T-Shirt",
        "category": "T-Shirts",
        "price": 999,
        "sizes": ["S", "M", "L", "XL"],
        "color": "Black",
        "tagCount": 6,
    },
    {
        "id": "ST-HD-021",
        "name": "Oversized Hoodie",
        "category": "Hoodies",
        "price": 1799,
        "sizes": ["S", "M", "L", "XL"],
        "color": "Charcoal",
        "tagCount": 4,
    },
    {
        "id": "ST-JK-014",
        "name": "Denim Jacket",
        "category": "Jackets",
        "price": 2499,
        "sizes": ["M", "L", "XL"],
        "color": "Blue",
        "tagCount": 5,
    },
    {
        "id": "ST-SN-008",
        "name": "White Sneakers",
        "category": "Footwear",
        "price": 3299,
        "sizes": ["7", "8", "9", "10"],
        "color": "White",
        "tagCount": 12,
    },
]


@app.get("/")
def root():
    return {
        "name": "SmartTag API",
        "status": "online",
        "version": "0.2.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "smarttag-api",
    }


@app.get("/api/products")
def get_products():
    return {
        "products": products,
        "count": len(products),
    }