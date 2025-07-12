from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    LOG_DATABASE_URL: str  # <--- Das hinzufügen
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    MEDIA_DIR: str

    class Config:
        env_file = ".env"

settings = Settings()

