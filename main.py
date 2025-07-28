from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

import models
import schemas
from database import SessionLocal, engine, Base
from auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    hash_password,
)

app = FastAPI()

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Token login endpoint
@app.post("/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# ==== USERS ====
@app.post("/users/", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Hash password before saving
    hashed_pwd = hash_password(user.password)
    db_user = models.User(**user.dict())
    db_user.password = hashed_pwd
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/", response_model=list[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.User).all()


@app.get("/users/{id}", response_model=schemas.UserOut)
def get_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = db.query(models.User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.put("/users/{id}", response_model=schemas.UserOut)
def update_user(
    id: int,
    updated: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = db.query(models.User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in updated.dict().items():
        if key == "password":
            setattr(user, key, hash_password(value))
        else:
            setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


@app.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = db.query(models.User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


# ==== PARCEL TYPES ====
@app.post("/parcel-types/", response_model=schemas.ParcelTypeOut, status_code=status.HTTP_201_CREATED)
def create_parcel_type(
    pt: schemas.ParcelTypeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = models.ParcelType(**pt.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.get("/parcel-types/", response_model=list[schemas.ParcelTypeOut])
def get_parcel_types(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.ParcelType).all()


@app.get("/parcel-types/{id}", response_model=schemas.ParcelTypeOut)
def get_parcel_type(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pt = db.query(models.ParcelType).get(id)
    if not pt:
        raise HTTPException(status_code=404, detail="ParcelType not found")
    return pt


@app.put("/parcel-types/{id}", response_model=schemas.ParcelTypeOut)
def update_parcel_type(
    id: int,
    updated: schemas.ParcelTypeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pt = db.query(models.ParcelType).get(id)
    if not pt:
        raise HTTPException(status_code=404, detail="ParcelType not found")
    for key, value in updated.dict().items():
        setattr(pt, key, value)
    db.commit()
    db.refresh(pt)
    return pt


@app.delete("/parcel-types/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_parcel_type(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pt = db.query(models.ParcelType).get(id)
    if not pt:
        raise HTTPException(status_code=404, detail="ParcelType not found")
    db.delete(pt)
    db.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


# ==== PARCELS ====
@app.post("/parcels/", response_model=schemas.ParcelOut, status_code=status.HTTP_201_CREATED)
def create_parcel(
    parcel: schemas.ParcelCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = models.Parcel(**parcel.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.get("/parcels/", response_model=list[schemas.ParcelOut])
def list_parcels(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Parcel).all()


@app.get("/parcels/{id}", response_model=schemas.ParcelOut)
def get_parcel(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = db.query(models.Parcel).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return obj


@app.put("/parcels/{id}", response_model=schemas.ParcelOut)
def update_parcel(
    id: int,
    updated: schemas.ParcelCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = db.query(models.Parcel).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Parcel not found")
    for key, value in updated.dict().items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


@app.delete("/parcels/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_parcel(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = db.query(models.Parcel).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Parcel not found")
    db.delete(obj)
    db.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


# ==== PARCEL IMAGES ====
@app.post("/parcel-images/", response_model=schemas.ParcelImageOut, status_code=status.HTTP_201_CREATED)
def add_image(
    image: schemas.ParcelImageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = models.ParcelImage(**image.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.get("/parcel-images/", response_model=list[schemas.ParcelImageOut])
def list_images(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.ParcelImage).all()


@app.get("/parcel-images/{id}", response_model=schemas.ParcelImageOut)
def get_image(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = db.query(models.ParcelImage).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="ParcelImage not found")
    return obj


@app.put("/parcel-images/{id}", response_model=schemas.ParcelImageOut)
def update_image(
    id: int,
    updated: schemas.ParcelImageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = db.query(models.ParcelImage).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="ParcelImage not found")
    for key, value in updated.dict().items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


@app.delete("/parcel-images/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = db.query(models.ParcelImage).get(id)
    if not obj:
        raise HTTPException(status_code=404, detail="ParcelImage not found")
    db.delete(obj)
    db.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
