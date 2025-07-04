from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.crud.user import create_user, get_user_by_email
from app.schemas.user import UserCreate, UserOut
from app.schemas.token import Token
from app.utils.auth import verify_password, create_access_token, get_current_user

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(SessionLocal)):
    if get_user_by_email(db, user.email):
        raise HTTPException(400, "Email already registered")
    new = create_user(db, user.email, user.password)
    return new

@router.post("/login", response_model=Token)
def login(form_data: UserCreate, db: Session = Depends(SessionLocal)):
    user = get_user_by_email(db, form_data.email)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(400, "Incorrect credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def read_me(current_user = Depends(get_current_user)):
    return current_user
