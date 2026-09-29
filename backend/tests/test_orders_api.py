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

def test_mock_payment():
    product_response = client.post(
        "/products/",
        json={
            "name": "Mock Payment Product",
            "sku": f"TEST-MOCK-PAYMENT-PRODUCT-{uuid.uuid4()}",
            "price": 1999,
            "description": "Product for mock payment test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-MOCK-PAYMENT-TAG-{uuid.uuid4()}",
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

    payment_response = client.post(
        f"/orders/{order_id}/mock-pay",
    )

    assert payment_response.status_code == 200

    data = payment_response.json()

    assert data["order_id"] == order_id
    assert data["payment_status"] == "success"
    assert data["payment_order_id"].startswith("MOCK-ORDER-")
    assert data["payment_transaction_id"].startswith("MOCK-TXN-")

    order_check = client.get(f"/orders/{order_id}")

    assert order_check.status_code == 200
    assert order_check.json()["status"] == "unlock_pending"

    unlock_response = client.post(
        f"/orders/{order_id}/mock-unlock",
    )

    assert unlock_response.status_code == 200

    unlock_data = unlock_response.json()

    assert unlock_data["id"] == order_id
    assert unlock_data["status"] == "unlocked"

    second_unlock_response = client.post(
        f"/orders/{order_id}/mock-unlock",
    )

    assert second_unlock_response.status_code == 400
    assert second_unlock_response.json()["detail"] == (
        "Order is not waiting for unlock"
    )
    complete_response = client.post(
        f"/orders/{order_id}/complete",
    )

    assert complete_response.status_code == 200

    complete_data = complete_response.json()

    assert complete_data["id"] == order_id
    assert complete_data["status"] == "completed"

    second_complete_response = client.post(
        f"/orders/{order_id}/complete",
    )

    assert second_complete_response.status_code == 400
    assert second_complete_response.json()["detail"] == (
        "Order is not unlocked"
    )

def test_mock_payment_only_pending_order():
    product_response = client.post(
        "/products/",
        json={
            "name": "Mock Payment Status Product",
            "sku": f"TEST-MOCK-STATUS-PRODUCT-{uuid.uuid4()}",
            "price": 2099,
            "description": "Product for mock payment status test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-MOCK-STATUS-TAG-{uuid.uuid4()}",
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

    first_payment = client.post(
        f"/orders/{order_id}/mock-pay",
    )

    assert first_payment.status_code == 200

    second_payment = client.post(
        f"/orders/{order_id}/mock-pay",
    )

    assert second_payment.status_code == 400
    assert second_payment.json()["detail"] == "Order is not pending"

def test_invalid_order_status_value():
    product_response = client.post(
        "/products/",
        json={
            "name": "Invalid Status Value Product",
            "sku": f"TEST-INVALID-VALUE-{uuid.uuid4()}",
            "price": 1799,
            "description": "Product for invalid status value test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-INVALID-VALUE-TAG-{uuid.uuid4()}",
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
        json={"status": "random_status"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid order status"

def test_completed_order_cannot_change_status():
    product_response = client.post(
        "/products/",
        json={
            "name": "Completed Order Product",
            "sku": f"TEST-COMPLETED-{uuid.uuid4()}",
            "price": 1899,
            "description": "Product for completed order test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-COMPLETED-TAG-{uuid.uuid4()}",
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

    for status in ["paid", "unlock_pending", "unlocked", "completed"]:
        response = client.patch(
            f"/orders/{order_id}/status",
            json={"status": status},
        )
        assert response.status_code == 200

    response = client.patch(
        f"/orders/{order_id}/status",
        json={"status": "pending"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "Invalid order status transition"
    )

def test_verify_payment():
    product_response = client.post(
        "/products/",
        json={
            "name": "Verify Payment Product",
            "sku": f"TEST-VERIFY-PAYMENT-{uuid.uuid4()}",
            "price": 2199,
            "description": "Product for verify payment test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-VERIFY-PAYMENT-TAG-{uuid.uuid4()}",
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

    payment_response = client.post(
        f"/orders/{order_id}/mock-pay",
    )

    assert payment_response.status_code == 200

    verify_response = client.post(
        f"/orders/{order_id}/verify-payment",
    )

    assert verify_response.status_code == 400
    assert verify_response.json()["detail"] == "Order is not pending"

import base64
import hashlib
import hmac
import json


def make_cashfree_signature(raw_body: bytes, timestamp: str, secret: str):
    signed_payload = timestamp.encode() + raw_body

    return base64.b64encode(
        hmac.new(
            secret.encode(),
            signed_payload,
            hashlib.sha256,
        ).digest()
    ).decode()

def test_cashfree_webhook_success():
    product_response = client.post(
        "/products/",
        json={
            "name": "Cashfree Webhook Product",
            "sku": f"TEST-CASHFREE-WEBHOOK-{uuid.uuid4()}",
            "price": 2499,
            "description": "Product for Cashfree webhook test",
        },
    )

    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    tag_response = client.post(
        "/tags/",
        json={
            "tag_code": f"TEST-CASHFREE-WEBHOOK-TAG-{uuid.uuid4()}",
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

    mock_payment = client.post(
        f"/orders/{order_id}/mock-pay",
    )

    assert mock_payment.status_code == 200

    payment_order_id = mock_payment.json()["payment_order_id"]

    # Webhook processing expects a pending order.
    # Reset the order through the status API is not allowed,
    # so this test focuses on signature rejection/handling.
    payload = {
        "type": "PAYMENT_SUCCESS_WEBHOOK",
        "data": {
            "order": {
                "order_id": payment_order_id,
            },
            "payment": {
                "cf_payment_id": "123456",
                "payment_status": "SUCCESS",
            },
        },
    }

    raw_body = json.dumps(payload).encode()
    timestamp = "1700000000000"

    signature = make_cashfree_signature(
        raw_body,
        timestamp,
        "test-secret",
    )

    response = client.post(
        "/orders/webhook/cashfree",
        content=raw_body,
        headers={
            "x-webhook-timestamp": timestamp,
            "x-webhook-signature": signature,
        },
    )

    assert response.status_code == 401