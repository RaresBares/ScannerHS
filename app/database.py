from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# App-DB
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Log-DB
log_engine = create_engine(settings.LOG_DATABASE_URL)
LogSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=log_engine)
LogBase = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
