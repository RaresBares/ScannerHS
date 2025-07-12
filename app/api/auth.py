# app/api/auth.py

from datetime import datetime, timedelta
import re
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.extensions import limiter
from app.schemas.user import UserCreate, UserOut, UserLogin
from app.schemas.token import Token
from app.crud.user import get_user_by_email, create_user
from app.utils.privilege import Privilege

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

EMAIL_REGEX = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")


# Utility functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def check_email(email: str, db: Session) -> bool:
    if get_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if not EMAIL_REGEX.match(email):
        raise HTTPException(status_code=400, detail="Email not valid")
    return True


# Auth core
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user


def require_min_privilege(min_level: Privilege):
    def checker(user=Depends(get_current_user)):
        if user.privilege < min_level:
            raise HTTPException(status_code=403, detail="Not enough privilege")
        return user
    return checker

require_user = require_min_privilege(Privilege.U)
require_supervisor = require_min_privilege(Privilege.S)
require_master = require_min_privilege(Privilege.M)


# Routes
@router.post("/register", response_model=UserOut)
@limiter.limit("5/minute")
def register(request: Request, user: UserCreate, db: Session = Depends(get_db)):

    check_email(user.email, db)
    return create_user(db=db, email=user.email, password=user.password, username=user.username)


@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
async def login(request: Request, db: Session = Depends(get_db)):
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        body = await request.json()
        user = UserLogin(**body)
    elif "application/x-www-form-urlencoded" in content_type:
        form = await request.form()
        user = UserLogin(email=form.get("username"), password=form.get("password"))
    else:
        raise HTTPException(status_code=400, detail="Unsupported content type")

    db_user = get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def read_me(current_user: UserOut = Depends(get_current_user)):
    return current_user


@router.get("/")
def health_check():
    return {"status": "ok"}
