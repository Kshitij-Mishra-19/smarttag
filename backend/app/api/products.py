from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.product import ProductCreate, ProductResponse
from app.services.product_service import create_product, get_all_products


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
    return get_all_products(db)


@router.post("/", response_model=ProductResponse)
def create_product_api(
    product: ProductCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_product(db, product)
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="SKU already exists",
        )