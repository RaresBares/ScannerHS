from dotenv import load_dotenv
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    MEDIA_DIR: str

    class Config:
        env_file = ".env"
load_dotenv()
settings = Settings()
