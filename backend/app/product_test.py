from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.product import Product


with SessionLocal() as session:
    statement = select(Product)
    products = session.scalars(statement).all()

    print("Products found:", len(products))

    for product in products:
        print(
            f"ID: {product.id} | "
            f"Name: {product.name} | "
            f"SKU: {product.sku} | "
            f"Price: {product.price}"
        )