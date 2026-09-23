from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse

from sqlalchemy.exc import IntegrityError


router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    statement = select(Product)
    products = db.scalars(statement).all()

    return products


@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
):
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
        raise HTTPException(
            status_code=409,
            detail="SKU already exists",
        )

    return new_product