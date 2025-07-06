
from fastapi import APIRouter, Depends, HTTPException
from requests import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserOut
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserOut)
def get_profile(current_user = Depends(get_current_user)):
    return current_user


@router.get("/user/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: str, db: Session = Depends(SessionLocal)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/test", tags=["users"])
def read_me():
    return {"status": "ok"}