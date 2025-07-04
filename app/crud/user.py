import uuid
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import get_password_hash

def create_user(db: Session, email: str, password: str):
    user = User(
        id=str(uuid.uuid4()),
        email=email,
        hashed_password=get_password_hash(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()
