from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime
import os

# Use PostgreSQL. For fallback/demo without postgres, you can swap back to SQLite
DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/iot_predictive_maintenance")

try:
    engine = create_engine(DB_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    # Fallback to SQLite if psycopg2/postgres isn't available
    engine = create_engine("sqlite:///./predictive_maintenance.db", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class SensorData(Base):
    __tablename__ = "sensor_data"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    rms = Column(Float)
    peak = Column(Float)
    dominant_freq = Column(Float)
    temperature = Column(Float)
    rpm = Column(Float)
    health_percentage = Column(Float)
    fault_class = Column(String)
    severity = Column(String)
