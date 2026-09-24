import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TagCreate(BaseModel):
    tag_code: str
    product_id: uuid.UUID


class TagResponse(BaseModel):
    id: uuid.UUID
    tag_code: str
    product_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)