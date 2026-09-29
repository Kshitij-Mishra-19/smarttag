import os


class Settings:
    CASHFREE_APP_ID: str = os.getenv("CASHFREE_APP_ID", "")
    CASHFREE_SECRET_KEY: str = os.getenv("CASHFREE_SECRET_KEY", "")
    CASHFREE_ENVIRONMENT: str = os.getenv(
        "CASHFREE_ENVIRONMENT",
        "sandbox",
    )


settings = Settings()