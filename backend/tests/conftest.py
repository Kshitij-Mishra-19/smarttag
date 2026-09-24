import pytest

from app.core.database import SessionLocal
from app.models.product import Product
from app.models.tag import Tag


@pytest.fixture(autouse=True)
def cleanup_test_data():
    yield

    with SessionLocal() as db:
        db.query(Tag).filter(
            Tag.tag_code.like("TEST-%")
        ).delete(synchronize_session=False)

        db.query(Product).filter(
            Product.sku.like("TEST-%")
        ).delete(synchronize_session=False)

        db.commit()