from pydantic import BaseModel, EmailStr, Field
from typing import Optional

from uuid import UUID

from app.utils.privilege import Privilege


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str = Field(min_length=6)

class UserOut(BaseModel):
    uuid: UUID
    email: EmailStr
    username: str
    privilege: Privilege
    fullname: Optional[str]
    profile_image: Optional[str]

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
