from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate


def get_all_products(db: Session):
    statement = select(Product)
    return db.scalars(statement).all()


def create_product(db: Session, product: ProductCreate):
    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        description=product.description,
    )

    db.add(new_product)

    try:
        db.commit()
        db.refresh(new_product)
    except IntegrityError:
        db.rollback()
        raise

    return new_product