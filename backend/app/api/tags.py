import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.tag import TagCreate, TagResponse
from app.services.tag_service import create_tag, get_tag_by_id


router = APIRouter(
    prefix="/tags",
    tags=["Tags"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TagResponse)
def create_tag_api(
    tag: TagCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_tag(db, tag)
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Tag code already exists",
        )


@router.get("/{tag_id}", response_model=TagResponse)
def get_tag(
    tag_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    tag = get_tag_by_id(db, tag_id)

    if tag is None:
        raise HTTPException(
            status_code=404,
            detail="Tag not found",
        )

    return tag