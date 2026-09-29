import base64
import hashlib
import hmac


def verify_cashfree_signature(
    raw_body: bytes,
    timestamp: str,
    signature: str,
    secret_key: str,
) -> bool:
    if not timestamp or not signature or not secret_key:
        return False

    signed_payload = timestamp.encode() + raw_body

    expected_signature = base64.b64encode(
        hmac.new(
            secret_key.encode(),
            signed_payload,
            hashlib.sha256,
        ).digest()
    ).decode()

    return hmac.compare_digest(
        expected_signature,
        signature,
    )