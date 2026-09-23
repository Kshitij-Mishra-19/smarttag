import uuid

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_get_products():
    response = client.get("/products/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_product():
    sku = f"TEST-API-{uuid.uuid4()}"

    response = client.post(
        "/products/",
        json={
            "name": "Green T-Shirt",
            "sku": sku,
            "price": 799,
            "description": "Cotton green T-shirt",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Green T-Shirt"
    assert data["sku"] == sku
    assert data["price"] == 799


def test_create_product_duplicate_sku():
    sku = f"TEST-DUP-{uuid.uuid4()}"

    first_response = client.post(
        "/products/",
        json={
            "name": "Green T-Shirt",
            "sku": sku,
            "price": 799,
            "description": "Cotton green T-shirt",
        },
    )

    assert first_response.status_code == 200

    second_response = client.post(
        "/products/",
        json={
            "name": "Another Green T-Shirt",
            "sku": sku,
            "price": 899,
            "description": "Another green T-shirt",
        },
    )

    assert second_response.status_code == 409
    assert second_response.json()["detail"] == "SKU already exists"