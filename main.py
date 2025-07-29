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
app = FastAPI(title="LMS")
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
ACCESS_TOKEN_EXPIRE_MINUTES = 30


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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return {
        "token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email
        }
    }


@router.post("/users/", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_user = models.User(**user.dict())
    db_user.password = hash_password(user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/users/", response_model=list[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.User).all()


@router.get("/users/{id}", response_model=schemas.UserOut)
def get_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = db.query(models.User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/{id}", response_model=schemas.UserOut)
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
    return user


@router.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
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
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


# ==== PARCEL TYPES ====
@router.post("/parcel-types/", response_model=schemas.ParcelTypeOut, status_code=status.HTTP_201_CREATED)
def create_parcel_type(
    pt: schemas.ParcelTypeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = models.ParcelType(**pt.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/parcel-types/", response_model=list[schemas.ParcelTypeOut])
def get_parcel_types(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.ParcelType).all()


@router.get("/parcel-types/{id}", response_model=schemas.ParcelTypeOut)
def get_parcel_type(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    pt = db.query(models.ParcelType).get(id)
    if not pt:
        raise HTTPException(status_code=404, detail="ParcelType not found")
    return pt


@router.put("/parcel-types/{id}", response_model=schemas.ParcelTypeOut)
def update_parcel_type(
    id: int,
    updated: schemas.ParcelTypeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    pt = db.query(models.ParcelType).get(id)
    if not pt:
        raise HTTPException(status_code=404, detail="ParcelType not found")
    for key, value in updated.dict().items():
        setattr(pt, key, value)
    db.commit()
    db.refresh(pt)
    return pt


@router.delete("/parcel-types/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_parcel_type(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    pt = db.query(models.ParcelType).get(id)
    if not pt:
        raise HTTPException(status_code=404, detail="ParcelType not found")
    db.delete(pt)
    db.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


# ==== PARCELS ====
@router.post("/parcels/", response_model=schemas.ParcelOut, status_code=status.HTTP_201_CREATED)
def create_parcel(
    parcel: schemas.ParcelCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = models.Parcel(**parcel.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/parcels/", response_model=list[schemas.ParcelOut])
def list_parcels(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Parcel).all()


@router.get("/parcels/{id}", response_model=schemas.ParcelOut)
def get_parcel(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.Parcel).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return obj


@router.put("/parcels/{id}", response_model=schemas.ParcelOut)
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
    return obj


@router.delete("/parcels/{id}", status_code=status.HTTP_204_NO_CONTENT)
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
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


# ==== PARCEL IMAGES ====
@router.post("/parcel-images/", response_model=schemas.ParcelImageOut, status_code=status.HTTP_201_CREATED)
def add_image(
    image: schemas.ParcelImageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = models.ParcelImage(**image.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/parcel-images/", response_model=list[schemas.ParcelImageOut])
def list_images(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.ParcelImage).all()


@router.get("/parcel-images/{id}", response_model=schemas.ParcelImageOut)
def get_image(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.ParcelImage).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="ParcelImage not found")
    return obj


@router.put("/parcel-images/{id}", response_model=schemas.ParcelImageOut)
def update_image(
    id: int,
    updated: schemas.ParcelImageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    obj = db.query(models.ParcelImage).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="ParcelImage not found")
    for key, value in updated.dict().items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/parcel-images/{id}", status_code=status.HTTP_204_NO_CONTENT)
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
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


app.include_router(router, prefix="/api/v1")
