from pydantic import BaseModel
from typing import Optional


# === USER MODELS ===
class UserBase(BaseModel):
    name: str
    username: str
    password: str
    email: str
    role: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: int

    model_config = {
        "from_attributes": True
    }


# === PARCEL TYPE MODELS ===
class ParcelTypeBase(BaseModel):
    parcel_type: str


class ParcelTypeCreate(ParcelTypeBase):
    pass


class ParcelTypeOut(ParcelTypeBase):
    id: int

    model_config = {
        "from_attributes": True
    }


# === PARCEL MODELS ===
class ParcelBase(BaseModel):
    name: str
    location: Optional[str] = None
    coordinates: Optional[str] = None
    description: Optional[str] = None
    parceltype: Optional[str] = None
    o_name: Optional[str] = None
    o_phone: Optional[str] = None
    o_email: Optional[str] = None
    o_address: Optional[str] = None


class ParcelCreate(ParcelBase):
    pass


class ParcelOut(ParcelBase):
    id: int

    model_config = {
        "from_attributes": True
    }


# === PARCEL IMAGE MODELS ===
class ParcelImageBase(BaseModel):
    parcel_id: int
    image: str


class ParcelImageCreate(ParcelImageBase):
    pass


class ParcelImageOut(ParcelImageBase):
    id: int

    model_config = {
        "from_attributes": True
    }
