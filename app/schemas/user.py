from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class UserOut(BaseModel):
    id: str
    email: EmailStr
    fullname: Optional[str]
    profile_image: Optional[str]

    class Config:
        orm_mode = True
