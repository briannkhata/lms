from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "tblusers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    IsOwner = Column(Boolean, default=False)


class ParcelType(Base):
    __tablename__ = "tblparceltypes"
    id = Column(Integer, primary_key=True, index=True)
    ParcelType = Column(String(100), nullable=False)


class Parcel(Base):
    __tablename__ = "tblparcels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(255))
    coordinates = Column(String(255))
    description = Column(Text)
    ParcelTypeId = Column(Integer, ForeignKey(
        "tblparceltypes.id", ondelete="SET NULL"))
    parcel_type = relationship("ParcelType")


class ParcelImage(Base):
    __tablename__ = "tblparcelimages"
    id = Column(Integer, primary_key=True, index=True)
    ParcelID = Column(Integer, ForeignKey("tblparcels.id", ondelete="CASCADE"))
    Image = Column(String(255))
    parcel = relationship("Parcel")
