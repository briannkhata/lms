from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    name: str
    username: str
    password: str
    email: str
    IsOwner: Optional[bool] = False


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True


class ParcelTypeBase(BaseModel):
    ParcelType: str


class ParcelTypeCreate(ParcelTypeBase):
    pass


class ParcelTypeOut(ParcelTypeBase):
    id: int

    class Config:
        orm_mode = True


class ParcelBase(BaseModel):
    name: str
    location: Optional[str] = None
    coordinates: Optional[str] = None
    description: Optional[str] = None
    ParcelTypeId: Optional[int]


class ParcelCreate(ParcelBase):
    pass


class ParcelOut(ParcelBase):
    id: int

    class Config:
        orm_mode = True


class ParcelImageBase(BaseModel):
    ParcelID: int
    Image: str


class ParcelImageCreate(ParcelImageBase):
    pass


class ParcelImageOut(ParcelImageBase):
    id: int

    class Config:
        orm_mode = True
