from sqlalchemy import text

from app.core.database import engine


with engine.connect() as connection:
    result = connection.execute(text("SELECT 1"))

    print("Database connection successful!")
    print("Result:", result.scalar())