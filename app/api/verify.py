
from fastapi import APIRouter, Depends, HTTPException
from requests import Session

from app.database import SessionLocal, get_db
from app.models.user import User
from app.schemas.user import UserOut
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserOut)
def profile(user=Depends(get_current_user)):
    return user
