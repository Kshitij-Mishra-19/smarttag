import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    description: str | None = None


class ProductResponse(BaseModel):
    id: uuid.UUID
    name: str
    sku: str
    price: float
    description: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)