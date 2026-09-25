import uuid

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_order():
    product_response = client.post(
        "/products/",
        json={
            "name": "Order Test Product",
            "sku": f"TEST-ORDER-PRODUCT-{uuid.uuid4()}",
            "price": 1299,
            "description": "Product for order API test",
        },
    )

    assert product_response.status_code == 200

    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-ORDER-TAG-{uuid.uuid4()}",
            "product_id": product_id,
        },
    )

    assert tag_response.status_code == 200

    tag_id = tag_response.json()["id"]

    response = client.post(
        "/orders/",
        json={
            "product_id": product_id,
            "tag_id": tag_id,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["product_id"] == product_id
    assert data["tag_id"] == tag_id
    assert data["amount"] == 1299
    assert data["status"] == "pending"

def test_get_order():
    product_response = client.post(
        "/products/",
        json={
            "name": "Get Order Test Product",
            "sku": f"TEST-GET-ORDER-PRODUCT-{uuid.uuid4()}",
            "price": 1499,
            "description": "Product for get order API test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-GET-ORDER-TAG-{uuid.uuid4()}",
            "product_id": product_id,
        },
    )

    assert tag_response.status_code == 200
    tag_id = tag_response.json()["id"]

    order_response = client.post(
        "/orders/",
        json={
            "product_id": product_id,
            "tag_id": tag_id,
        },
    )

    assert order_response.status_code == 200
    order_id = order_response.json()["id"]

    response = client.get(f"/orders/{order_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == order_id
    assert data["product_id"] == product_id
    assert data["tag_id"] == tag_id
    assert data["amount"] == 1499
    assert data["status"] == "pending"

def test_get_order_not_found():
    order_id = uuid.uuid4()

    response = client.get(f"/orders/{order_id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Order not found"

def test_update_order_status():
    product_response = client.post(
        "/products/",
        json={
            "name": "Status Test Product",
            "sku": f"TEST-STATUS-PRODUCT-{uuid.uuid4()}",
            "price": 1599,
            "description": "Product for order status test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-STATUS-TAG-{uuid.uuid4()}",
            "product_id": product_id,
        },
    )

    assert tag_response.status_code == 200
    tag_id = tag_response.json()["id"]

    order_response = client.post(
        "/orders/",
        json={
            "product_id": product_id,
            "tag_id": tag_id,
        },
    )

    assert order_response.status_code == 200
    order_id = order_response.json()["id"]

    response = client.patch(
        f"/orders/{order_id}/status",
        json={"status": "paid"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "paid"

def test_invalid_order_status_transition():
    product_response = client.post(
        "/products/",
        json={
            "name": "Invalid Status Test Product",
            "sku": f"TEST-INVALID-STATUS-PRODUCT-{uuid.uuid4()}",
            "price": 1699,
            "description": "Product for invalid status test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-INVALID-STATUS-TAG-{uuid.uuid4()}",
            "product_id": product_id,
        },
    )

    assert tag_response.status_code == 200
    tag_id = tag_response.json()["id"]

    order_response = client.post(
        "/orders/",
        json={
            "product_id": product_id,
            "tag_id": tag_id,
        },
    )

    assert order_response.status_code == 200
    order_id = order_response.json()["id"]

    response = client.patch(
        f"/orders/{order_id}/status",
        json={"status": "completed"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid order status transition"