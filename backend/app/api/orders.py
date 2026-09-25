import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderStatusUpdate,
)
from app.services.order_service import (
    create_order,
    get_order_by_id,
    update_order_status,
)


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=OrderResponse)
def create_order_api(
    order: OrderCreate,
    db: Session = Depends(get_db),
):
    new_order, error = create_order(db, order)

    if error == "product_not_found":
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    if error == "tag_not_found":
        raise HTTPException(
            status_code=404,
            detail="Tag not found",
        )

    if error == "tag_product_mismatch":
        raise HTTPException(
            status_code=400,
            detail="Tag does not belong to the selected product",
        )

    return new_order

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    order = get_order_by_id(db, order_id)

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    return order

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status_api(
    order_id: uuid.UUID,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    order, error = update_order_status(
        db,
        order_id,
        status_update.status,
    )

    if error == "invalid_status":
        raise HTTPException(
            status_code=400,
            detail="Invalid order status",
        )

    if error == "order_not_found":
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if error == "invalid_transition":
        raise HTTPException(
            status_code=400,
            detail="Invalid order status transition",
        )

    return order