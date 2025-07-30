from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Replace values with your real MySQL credentials and DB name
DATABASE_URL = "mysql+pymysql://root@localhost:3306/db_lms"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
