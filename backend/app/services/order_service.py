import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.product import Product
from app.models.tag import Tag
from app.schemas.order import OrderCreate

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

def get_order_by_id(db: Session, order_id: uuid.UUID):
    statement = select(Order).where(Order.id == order_id)
    return db.scalar(statement)