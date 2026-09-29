import base64
import hashlib
import hmac

from app.services.webhook_service import verify_cashfree_signature


def test_cashfree_webhook_signature_valid():
    raw_body = b'{"type":"PAYMENT_SUCCESS_WEBHOOK"}'
    timestamp = "1700000000000"
    secret_key = "test-secret"

    signed_payload = timestamp.encode() + raw_body

    signature = base64.b64encode(
        hmac.new(
            secret_key.encode(),
            signed_payload,
            hashlib.sha256,
        ).digest()
    ).decode()

    assert verify_cashfree_signature(
        raw_body=raw_body,
        timestamp=timestamp,
        signature=signature,
        secret_key=secret_key,
    ) is True


def test_cashfree_webhook_signature_invalid():
    raw_body = b'{"type":"PAYMENT_SUCCESS_WEBHOOK"}'

    assert verify_cashfree_signature(
        raw_body=raw_body,
        timestamp="1700000000000",
        signature="invalid-signature",
        secret_key="test-secret",
    ) is False