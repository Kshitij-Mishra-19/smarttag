from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.tag import TagCreate, TagResponse
from app.services.tag_service import create_tag


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