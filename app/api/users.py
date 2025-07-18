
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


@router.get("/{user_uuid}", response_model=UserOut)
def get_user_by_id(user_uuid: str,
                   current_user = Depends(get_current_user),
                   db: Session = Depends(get_db)):
    user = db.query(User).filter(User.uuid == user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    #TODO: Add privileges for user managment
    if current_user.privilege > user.privilege or True:
        return user
    raise HTTPException(status_code=401, detail="No Rights")
    return None

@router.get("/test")
def read_me():
    return {"status": "ok"}