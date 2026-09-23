from app.models.product import Product


def test_product_model():
    product = Product(
        name="Test T-Shirt",
        sku="TEST-001",
        price=999.00,
        description="Test product",
    )

    assert product.name == "Test T-Shirt"
    assert product.sku == "TEST-001"
    assert product.price == 999.00