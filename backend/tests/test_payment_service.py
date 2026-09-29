from app.services.payment_service import MockPaymentService


def test_mock_payment_service():
    service = MockPaymentService()

    payment = service.create_payment(1299)

    assert payment["provider"] == "mock"
    assert payment["payment_order_id"].startswith("MOCK-ORDER-")
    assert payment["payment_transaction_id"].startswith("MOCK-TXN-")
    assert payment["status"] == "success"

def test_mock_payment_verification():
    service = MockPaymentService()

    payment = service.verify_payment(
        "MOCK-ORDER-123"
    )

    assert payment["status"] == "success"
    assert payment["payment_transaction_id"].startswith(
        "MOCK-TXN-"
    )