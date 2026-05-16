from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from simulator import simulator
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Predictive Maintenance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StateUpdate(BaseModel):
    state: str

@app.post("/api/simulation/state")
async def set_simulation_state(update: StateUpdate):
    valid_states = ["Normal", "Minor Imbalance", "Severe Anomaly"]
    if update.state in valid_states:
        simulator.set_state(update.state)
        return {"status": "success", "state": simulator.state}
    return {"status": "error", "message": "Invalid state"}

@app.websocket("/ws/sensor-data")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected to WS")
    try:
        await simulator.run(websocket)
    except WebSocketDisconnect:
        print("Client disconnected")
        simulator.running = False

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
