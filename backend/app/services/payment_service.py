from abc import ABC, abstractmethod
from uuid import uuid4


class PaymentService(ABC):

    @abstractmethod
    def create_payment(self, amount: float) -> dict:
        pass

    @abstractmethod
    def verify_payment(self, payment_order_id: str) -> dict:
        pass


class MockPaymentService(PaymentService):

    def create_payment(self, amount: float) -> dict:
        return {
            "provider": "mock",
            "payment_order_id": f"MOCK-ORDER-{uuid4()}",
            "payment_transaction_id": f"MOCK-TXN-{uuid4()}",
            "status": "success",
        }

    def verify_payment(self, payment_order_id: str) -> dict:
        return {
            "status": "success",
            "payment_transaction_id": f"MOCK-TXN-{uuid4()}",
        }


class CashfreePaymentService(PaymentService):

    def create_payment(self, amount: float) -> dict:
        import requests

        from app.core.config import settings

        if not settings.CASHFREE_APP_ID:
            raise RuntimeError("Cashfree App ID is not configured")

        if not settings.CASHFREE_SECRET_KEY:
            raise RuntimeError("Cashfree Secret Key is not configured")

        base_url = (
            "https://sandbox.cashfree.com"
            if settings.CASHFREE_ENVIRONMENT == "sandbox"
            else "https://api.cashfree.com"
        )

        payload = {
            "order_amount": float(amount),
            "order_currency": "INR",
            "order_id": f"SMARTTAG-{uuid4()}",
            "customer_details": {
                "customer_id": "smarttag-user",
                "customer_phone": "9999999999",
            },
        }

        response = requests.post(
            f"{base_url}/pg/orders",
            headers={
                "x-client-id": settings.CASHFREE_APP_ID,
                "x-client-secret": settings.CASHFREE_SECRET_KEY,
                "x-api-version": "2025-01-01",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            json=payload,
            timeout=15,
        )

        response.raise_for_status()

        data = response.json()

        return {
            "provider": "cashfree",
            "payment_order_id": data["order_id"],
            "payment_session_id": data["payment_session_id"],
            "payment_transaction_id": None,
            "status": data["order_status"],
        }

    def verify_payment(self, payment_order_id: str) -> dict:
        import requests

        from app.core.config import settings

        if not settings.CASHFREE_APP_ID:
            raise RuntimeError("Cashfree App ID is not configured")

        if not settings.CASHFREE_SECRET_KEY:
            raise RuntimeError("Cashfree Secret Key is not configured")

        base_url = (
            "https://sandbox.cashfree.com"
            if settings.CASHFREE_ENVIRONMENT == "sandbox"
            else "https://api.cashfree.com"
        )

        response = requests.get(
            f"{base_url}/pg/orders/{payment_order_id}/payments",
            headers={
                "x-client-id": settings.CASHFREE_APP_ID,
                "x-client-secret": settings.CASHFREE_SECRET_KEY,
                "x-api-version": "2025-01-01",
                "Accept": "application/json",
            },
            timeout=15,
        )

        response.raise_for_status()

        payments = response.json()

        successful_payment = next(
            (
                payment
                for payment in payments
                if payment.get("payment_status") == "SUCCESS"
            ),
            None,
        )

        if successful_payment:
            return {
                "status": "success",
                "payment_transaction_id": successful_payment.get(
                    "cf_payment_id"
                ),
            }

        pending_payment = next(
            (
                payment
                for payment in payments
                if payment.get("payment_status") == "PENDING"
            ),
            None,
        )

        if pending_payment:
            return {
                "status": "pending",
                "payment_transaction_id": pending_payment.get(
                    "cf_payment_id"
                ),
            }

        return {
            "status": "failure",
            "payment_transaction_id": None,
        }