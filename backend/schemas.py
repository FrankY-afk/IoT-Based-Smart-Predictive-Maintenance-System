from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SensorReading(BaseModel):
    rms: float
    peak: float
    dominant_freq: float
    temperature: float

class PredictionResult(BaseModel):
    fault_class: str
    severity: str
    confidence: float
    probabilities: dict
