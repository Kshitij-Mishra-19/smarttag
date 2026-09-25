import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OrderCreate(BaseModel):
    product_id: uuid.UUID
    tag_id: uuid.UUID


class OrderStatusUpdate(BaseModel):
    status: str


class OrderResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    tag_id: uuid.UUID
    payment_provider: str | None
    payment_order_id: str | None
    payment_transaction_id: str | None
    amount: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)