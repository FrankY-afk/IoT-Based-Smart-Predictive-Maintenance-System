import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report
import random

class PredictiveModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        self.classes_map = {
            0: ("Normal", "Normal"),
            1: ("Minor Fault", "Warning"),
            2: ("Severe Fault", "Critical")
        }
        self.train_pipeline()

    def generate_synthetic_dataset(self, num_samples=1000):
        X = []
        y = []
        for _ in range(num_samples):
            state = random.choice([0, 1, 2])
            if state == 0: # Normal
                rms = random.uniform(0.5, 2.0)
                peak = random.uniform(1.0, 3.5)
                freq = random.uniform(49.0, 51.0)
                temp = random.uniform(35.0, 50.0)
            elif state == 1: # Minor Fault
                rms = random.uniform(2.5, 5.0)
                peak = random.uniform(4.0, 8.0)
                freq = random.uniform(98.0, 102.0)
                temp = random.uniform(55.0, 75.0)
            else: # Severe Fault
                rms = random.uniform(6.0, 12.0)
                peak = random.uniform(10.0, 20.0)
                freq = random.uniform(145.0, 155.0)
                temp = random.uniform(85.0, 110.0)
            X.append([rms, peak, freq, temp])
            y.append(state)
        return np.array(X), np.array(y)

    def train_pipeline(self):
        print("Starting ML Model Training Pipeline...")
        X, y = self.generate_synthetic_dataset(2000)
        
        # Train / Test Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train Model
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        cm = confusion_matrix(y_test, y_pred)
        print("Model Trained Successfully.")
        print("Confusion Matrix:\n", cm)
        print("Classification Report:\n", classification_report(y_test, y_pred, target_names=["Normal", "Minor Fault", "Severe Fault"]))

    def get_maintenance_recommendations(self, fault_class):
        if fault_class == "Normal":
            return ["Continue standard monitoring"]
        elif fault_class == "Minor Fault":
            return [
                "Check shaft alignment",
                "Inspect bearing lubrication",
                "Monitor vibration trend closely"
            ]
        else:
            return [
                "Reduce operating load immediately!",
                "Schedule emergency maintenance",
                "Inspect bearings and structural mounts for severe wear"
            ]

    def predict(self, rms, peak, dominant_freq, temperature):
        features = np.array([[rms, peak, dominant_freq, temperature]])
        pred = self.model.predict(features)[0]
        probs = self.model.predict_proba(features)[0]
        
        fault_class, severity = self.classes_map[pred]
        
        return {
            "fault_class": fault_class,
            "severity": severity,
            "confidence": float(np.max(probs)),
            "probabilities": {
                "Normal": float(probs[0] if len(probs) > 0 else 0.0),
                "Minor Fault": float(probs[1] if len(probs) > 1 else 0.0),
                "Severe Fault": float(probs[2] if len(probs) > 2 else 0.0)
            },
            "recommendations": self.get_maintenance_recommendations(fault_class)
        }

model = PredictiveModel()
