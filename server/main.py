import sys
from fastapi import UploadFile, File, Form
import uuid
import os
import shutil
from fastapi import UploadFile, File, Form, HTTPException
from sqlalchemy import func
from sqlalchemy import or_
from fastapi import HTTPException
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import models
import schemas
from database import SessionLocal, engine, Base
from pydantic import BaseModel
from fastapi import Body
from auth import (
    authenticate_user, create_access_token,
    get_current_user, hash_password
)

# --- Initialize ---
app = FastAPI(
    title="LMS Backend API",        # 🔹 Change this
    description="API for managing users, parcels, and authentication",  # 🔹 Optional
    version="1.0.0"                 # 🔹 Optional
)
Base.metadata.create_all(bind=engine)
router = APIRouter()  # Create router

# --- DB Dependency ---


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Authentication ---
ACCESS_TOKEN_EXPIRE_MINUTES = 60
UPLOAD_DIR = "uploads/parcel_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class LoginRequest(BaseModel):
    username: str
    password: str


@router.get("/")
def index():
    return {"message": "LMS Service is Running"}


@router.post("/login")
def login(request: LoginRequest = Body(...), db: Session = Depends(get_db)):
    user = authenticate_user(db, request.username, request.password)
    if not user:
        return {
            "success": False,
            "message": "Wrong Credentials",
            "token": ""
        }

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={
            "sub": user.username,   # standard claim
            "username": user.username,
            "name": user.name,
            "role": user.role
        },
        expires_delta=access_token_expires
    )

    return {
        "success": True,
        "message": "Login successful!",
        "token": token,
    }


@router.post("/users/", status_code=status.HTTP_201_CREATED)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if user with same username, name, or email already exists
    existing_user = db.query(models.User).filter(
        or_(
            models.User.username == user.username,
            models.User.name == user.name,
            models.User.email == user.email
        )
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username, name, or email already exists."
        )

    db_user = models.User(**user.dict())
    db_user.password = hash_password(user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "message": "User created successfully",
            "user": schemas.UserOut.from_orm(db_user).dict()
        }
    )


@router.get("/users/")
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    users = db.query(models.User).all()
    return {
        "message": f"{len(users)} users found",
        "data": [schemas.UserOut.from_orm(u).dict() for u in users]
    }


@router.get("/users/{id}")
def get_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = db.query(models.User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "message": "User retrieved successfully",
        "data": schemas.UserOut.from_orm(user).dict()
    }


@router.put("/users/{id}")
def update_user(
    id: int,
    updated: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = db.query(models.User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in updated.dict().items():
        setattr(user, key, hash_password(value)
                if key == "password" else value)

    db.commit()
    db.refresh(user)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "User updated successfully",
            "data": schemas.UserOut.from_orm(user).dict()
        }
    )


@router.delete("/users/{id}")
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = db.query(models.User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "User deleted successfully"}
    )

# ==== PARCELS ====


@router.post("/parcels/")
def create_parcel(
    parcel: schemas.ParcelCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check for existing parcel with the same name and location
    existing = db.query(models.Parcel).filter(
        models.Parcel.name == parcel.name,
        models.Parcel.location == parcel.location
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A parcel with the same name and location already exists."
        )

    obj = models.Parcel(**parcel.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)

    return {
        "message": "Parcel created successfully",
        "data": schemas.ParcelOut.from_orm(obj)
    }


@router.get("/parcels/")
def list_parcels(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    parcels = db.query(models.Parcel).all()
    return {
        "message": f"{len(parcels)} parcels found",
        "data": [schemas.ParcelOut.from_orm(p) for p in parcels]
    }


@router.get("/parcels/{id}")
def get_parcel(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.Parcel).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return {
        "message": "Parcel retrieved successfully",
        "data": schemas.ParcelOut.from_orm(obj)
    }


@router.put("/parcels/{id}")
def update_parcel(
    id: int,
    updated: schemas.ParcelCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.Parcel).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Parcel not found")
    for key, value in updated.dict().items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return {
        "message": "Parcel updated successfully",
        "data": schemas.ParcelOut.from_orm(obj)
    }


@router.delete("/parcels/{id}")
def delete_parcel(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.Parcel).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Parcel not found")
    db.delete(obj)
    db.commit()
    return {"message": "Parcel deleted successfully"}


# ==== PARCEL IMAGES ====
@router.post("/parcel-images/")
def add_image(
    ParcelID: int = Form(...),
    Image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Generate unique filename
    file_ext = os.path.splitext(Image.filename)[1]
    filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save file locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(Image.file, buffer)

    # Store the relative or full file path in the database
    obj = models.ParcelImage(ParcelID=ParcelID, Image=file_path)
    db.add(obj)
    db.commit()
    db.refresh(obj)

    return {
        "message": "Parcel image added successfully",
        "data": schemas.ParcelImageOut.from_orm(obj)
    }


@router.get("/parcel-images/")
def list_images(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    images = db.query(models.ParcelImage).all()
    return {
        "message": f"{len(images)} images found",
        "data": [schemas.ParcelImageOut.from_orm(i) for i in images]
    }


@router.get("/parcel-images/{id}")
def get_image(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.ParcelImage).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="ParcelImage not found")
    return {
        "message": "Parcel image retrieved successfully",
        "data": schemas.ParcelImageOut.from_orm(obj)
    }


@router.put("/parcel-images/{id}")
def update_image(
    id: int,
    ParcelID: int = Form(...),
    Image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.ParcelImage).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="ParcelImage not found")

    # Optionally delete the old image file
    if os.path.exists(obj.Image):
        os.remove(obj.Image)

    # Save new image file
    file_ext = os.path.splitext(Image.filename)[1]
    filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(Image.file, buffer)

    # Update database fields
    obj.ParcelID = ParcelID
    obj.Image = file_path

    db.commit()
    db.refresh(obj)

    return {
        "message": "Parcel image updated successfully",
        "image": schemas.ParcelImageOut.from_orm(obj)
    }


@router.delete("/parcel-images/{id}")
def delete_image(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.ParcelImage).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="ParcelImage not found")
    db.delete(obj)
    db.commit()
    return {"message": "Parcel image deleted successfully"}


app.include_router(router, prefix="/api/v1")
