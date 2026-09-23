import pytest

from app.core.database import SessionLocal
from app.models.product import Product


@pytest.fixture(autouse=True)
def cleanup_test_products():
    yield

    with SessionLocal() as db:
        db.query(Product).filter(
            Product.sku.like("TEST-%")
        ).delete(synchronize_session=False)

        db.commit()