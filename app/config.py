import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost:5432/scannerhs")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_ME")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    MEDIA_DIR: str = "media"

settings = Settings()
