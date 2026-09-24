import uuid

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_tag():
    product_response = client.post(
        "/products/",
        json={
            "name": "Test Tag Product",
            "sku": f"TEST-TAG-PRODUCT-{uuid.uuid4()}",
            "price": 999,
            "description": "Product for tag API test",
        },
    )

    assert product_response.status_code == 200

    product_id = product_response.json()["id"]
    tag_code = f"TEST-TAG-{uuid.uuid4()}"

    response = client.post(
        "/tags/",
        json={
            "tag_code": tag_code,
            "product_id": product_id,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["tag_code"] == tag_code
    assert data["product_id"] == product_id


def test_get_tag():
    product_response = client.post(
        "/products/",
        json={
            "name": "Get Tag Product",
            "sku": f"TEST-GET-TAG-PRODUCT-{uuid.uuid4()}",
            "price": 799,
            "description": "Product for get tag test",
        },
    )

    assert product_response.status_code == 200

    product_id = product_response.json()["id"]
    tag_code = f"TEST-GET-TAG-{uuid.uuid4()}"

    create_response = client.post(
        "/tags/",
        json={
            "tag_code": tag_code,
            "product_id": product_id,
        },
    )

    assert create_response.status_code == 200

    tag_id = create_response.json()["id"]

    response = client.get(f"/tags/{tag_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == tag_id
    assert data["tag_code"] == tag_code
    assert data["product_id"] == product_id


def test_get_tag_not_found():
    tag_id = uuid.uuid4()

    response = client.get(f"/tags/{tag_id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Tag not found"


def test_create_tag_duplicate_code():
    product_response = client.post(
        "/products/",
        json={
            "name": "Duplicate Tag Product",
            "sku": f"TEST-DUP-TAG-PRODUCT-{uuid.uuid4()}",
            "price": 899,
            "description": "Product for duplicate tag test",
        },
    )

    assert product_response.status_code == 200

    product_id = product_response.json()["id"]
    tag_code = f"TEST-DUP-TAG-{uuid.uuid4()}"

    first_response = client.post(
        "/tags/",
        json={
            "tag_code": tag_code,
            "product_id": product_id,
        },
    )

    assert first_response.status_code == 200

    second_response = client.post(
        "/tags/",
        json={
            "tag_code": tag_code,
            "product_id": product_id,
        },
    )

    assert second_response.status_code == 409
    assert second_response.json()["detail"] == "Tag code already exists"


def test_get_tag_by_code():
    product_response = client.post(
        "/products/",
        json={
            "name": "Get Tag By Code Product",
            "sku": f"TEST-GET-TAG-CODE-PRODUCT-{uuid.uuid4()}",
            "price": 899,
            "description": "Product for tag code lookup test",
        },
    )

    assert product_response.status_code == 200

    product_id = product_response.json()["id"]
    tag_code = f"TEST-GET-TAG-CODE-{uuid.uuid4()}"

    create_response = client.post(
        "/tags/",
        json={
            "tag_code": tag_code,
            "product_id": product_id,
        },
    )

    assert create_response.status_code == 200

    response = client.get(f"/tags/code/{tag_code}")

    assert response.status_code == 200

    data = response.json()

    assert data["tag_code"] == tag_code
    assert data["product_id"] == product_id