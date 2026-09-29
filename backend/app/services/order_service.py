import uuid
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.product import Product
from app.models.tag import Tag
from app.schemas.order import OrderCreate
from app.services.payment_service import (
    MockPaymentService,
    PaymentService,
)

ORDER_STATUSES = {
    "pending",
    "paid",
    "unlock_pending",
    "unlocked",
    "completed",
    "cancelled",
}

ORDER_STATUS_TRANSITIONS = {
    "pending": {"paid", "cancelled"},
    "paid": {"unlock_pending"},
    "unlock_pending": {"unlocked"},
    "unlocked": {"completed"},
    "completed": set(),
    "cancelled": set(),
}


def create_order(db: Session, order: OrderCreate):
    product = db.get(Product, order.product_id)

    if product is None:
        return None, "product_not_found"

    tag = db.get(Tag, order.tag_id)

    if tag is None:
        return None, "tag_not_found"

    if tag.product_id != product.id:
        return None, "tag_product_mismatch"

    new_order = Order(
        product_id=product.id,
        tag_id=tag.id,
        amount=product.price,
        status="pending",
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order, None

def update_order_status(
    db: Session,
    order_id: uuid.UUID,
    new_status: str,
):
    if new_status not in ORDER_STATUSES:
        return None, "invalid_status"

    order = db.get(Order, order_id)

    if order is None:
        return None, "order_not_found"

    if new_status not in ORDER_STATUS_TRANSITIONS[order.status]:
        return None, "invalid_transition"

    order.status = new_status

    db.commit()
    db.refresh(order)

    return order, None

def process_mock_payment(
    db: Session,
    order_id: uuid.UUID,
    payment_service: PaymentService | None = None,
):
    order = db.get(Order, order_id)

    if order is None:
        return None, "order_not_found"

    if order.status != "pending":
        return None, "invalid_payment_status"

    if payment_service is None:
        payment_service = MockPaymentService()

    payment = payment_service.create_payment(
        float(order.amount),
    )

    order.status = "unlock_pending"
    order.payment_provider = payment["provider"]
    order.payment_order_id = payment["payment_order_id"]
    order.payment_session_id = payment.get("payment_session_id")
    order.payment_transaction_id = payment["payment_transaction_id"]

    db.commit()
    db.refresh(order)

    return order, None

def process_mock_unlock(
    db: Session,
    order_id: uuid.UUID,
):
    order = db.get(Order, order_id)

    if order is None:
        return None, "order_not_found"

    if order.status != "unlock_pending":
        return None, "invalid_unlock_status"

    order.status = "unlocked"

    db.commit()
    db.refresh(order)

    return order, None

def verify_payment(
    db: Session,
    order_id: uuid.UUID,
    payment_service: PaymentService | None = None,
):
    order = db.get(Order, order_id)

    if order is None:
        return None, "order_not_found"

    if order.status != "pending":
        return None, "invalid_payment_status"

    if not order.payment_order_id:
        return None, "payment_order_not_found"

    if payment_service is None:
        payment_service = MockPaymentService()

    payment = payment_service.verify_payment(
        order.payment_order_id,
    )

    if payment["status"] == "pending":
        return None, "payment_pending"

    if payment["status"] != "success":
        return None, "payment_failed"

    order.status = "unlock_pending"
    order.payment_transaction_id = payment[
        "payment_transaction_id"
    ]

    db.commit()
    db.refresh(order)

    return order, None

def complete_order(
    db: Session,
    order_id: uuid.UUID,
):
    order = db.get(Order, order_id)

    if order is None:
        return None, "order_not_found"

    if order.status != "unlocked":
        return None, "invalid_completion_status"

    order.status = "completed"

    db.commit()
    db.refresh(order)

    return order, None

def get_order_by_id(db: Session, order_id: uuid.UUID):
    statement = select(Order).where(Order.id == order_id)
    return db.scalar(statement)

def process_cashfree_webhook_payment(
    db: Session,
    payment_order_id: str,
    payment_transaction_id: str | None,
    payment_status: str,
):
    statement = select(Order).where(
        Order.payment_order_id == payment_order_id
    )

    order = db.scalar(statement)

    if order is None:
        return None, "order_not_found"

    if payment_status != "SUCCESS":
        return order, "payment_not_successful"

    # Idempotency:
    # Agar payment already process ho chuka hai,
    # dobara state change nahi karna.
    if order.status == "unlock_pending":
        return order, None

    if order.status != "pending":
        return None, "invalid_payment_status"

    order.status = "unlock_pending"
    order.payment_provider = "cashfree"
    order.payment_transaction_id = payment_transaction_id

    db.commit()
    db.refresh(order)

    return order, None