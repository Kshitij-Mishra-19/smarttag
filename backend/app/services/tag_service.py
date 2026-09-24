import uuid

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.tag import Tag
from app.schemas.tag import TagCreate


def create_tag(db: Session, tag: TagCreate):
    new_tag = Tag(
        tag_code=tag.tag_code,
        product_id=tag.product_id,
    )

    db.add(new_tag)

    try:
        db.commit()
        db.refresh(new_tag)
    except IntegrityError:
        db.rollback()
        raise

    return new_tag


def get_tag_by_id(db: Session, tag_id: uuid.UUID):
    statement = select(Tag).where(Tag.id == tag_id)

    return db.scalar(statement)