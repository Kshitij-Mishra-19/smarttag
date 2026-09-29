import uuid

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request

from app.core.config import settings
from app.services.webhook_service import verify_cashfree_signature

from app.core.database import SessionLocal
from app.schemas.order import (
    MockPaymentResponse,
    OrderCreate,
    OrderResponse,
    OrderStatusUpdate,
)
from app.services.order_service import (
    complete_order,
    create_order,
    get_order_by_id,
    process_cashfree_webhook_payment,
    process_mock_payment,
    process_mock_unlock,
    update_order_status,
    verify_payment,
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

@router.post(
    "/{order_id}/mock-pay",
    response_model=MockPaymentResponse,
)
def mock_payment(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    order, error = process_mock_payment(db, order_id)

    if error == "order_not_found":
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if error == "invalid_payment_status":
        raise HTTPException(
            status_code=400,
            detail="Order is not pending",
        )

    return MockPaymentResponse(
    order_id=order.id,
    payment_status="success",
    payment_order_id=order.payment_order_id,
    payment_transaction_id=order.payment_transaction_id,
)

@router.post(
    "/{order_id}/verify-payment",
    response_model=OrderResponse,
)
def verify_payment_api(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    order, error = verify_payment(db, order_id)

    if error == "order_not_found":
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if error == "invalid_payment_status":
        raise HTTPException(
            status_code=400,
            detail="Order is not pending",
        )

    if error == "payment_order_not_found":
        raise HTTPException(
            status_code=400,
            detail="Payment order not found",
        )

    if error == "payment_pending":
        raise HTTPException(
            status_code=400,
            detail="Payment is pending",
        )

    if error == "payment_failed":
        raise HTTPException(
            status_code=400,
            detail="Payment failed",
        )

    return order

@router.post(
    "/{order_id}/mock-unlock",
    response_model=OrderResponse,
)
def mock_unlock(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    order, error = process_mock_unlock(db, order_id)

    if error == "order_not_found":
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if error == "invalid_unlock_status":
        raise HTTPException(
            status_code=400,
            detail="Order is not waiting for unlock",
        )

    return order

@router.post(
    "/{order_id}/complete",
    response_model=OrderResponse,
)
def complete_order_api(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    order, error = complete_order(db, order_id)

    if error == "order_not_found":
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if error == "invalid_completion_status":
        raise HTTPException(
            status_code=400,
            detail="Order is not unlocked",
        )

    return order

@router.post("/webhook/cashfree")
async def cashfree_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    raw_body = await request.body()

    timestamp = request.headers.get("x-webhook-timestamp")
    signature = request.headers.get("x-webhook-signature")

    is_valid = verify_cashfree_signature(
        raw_body=raw_body,
        timestamp=timestamp or "",
        signature=signature or "",
        secret_key=settings.CASHFREE_SECRET_KEY,
    )

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid webhook signature",
        )

    payload = await request.json()

    data = payload.get("data", {})
    order_data = data.get("order", {})
    payment_data = data.get("payment", {})

    payment_order_id = order_data.get("order_id")
    payment_transaction_id = payment_data.get("cf_payment_id")
    payment_status = payment_data.get("payment_status")

    if not payment_order_id:
        raise HTTPException(
            status_code=400,
            detail="Payment order ID missing",
        )

    order, error = process_cashfree_webhook_payment(
        db=db,
        payment_order_id=payment_order_id,
        payment_transaction_id=payment_transaction_id,
        payment_status=payment_status,
    )

    if error == "order_not_found":
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if error == "payment_not_successful":
        return {
            "status": "ignored",
            "payment_status": payment_status,
        }

    if error == "invalid_payment_status":
        raise HTTPException(
            status_code=400,
            detail="Invalid order payment status",
        )

    return {
        "status": "processed",
        "order_id": str(order.id),
        "payment_status": payment_status,
    }