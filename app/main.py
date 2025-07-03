# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import auth, users, products, items, media
from database import Base, engine

# Datenbanktabellen erzeugen (falls nicht vorhanden)
Base.metadata.create_all(bind=engine)

# FastAPI-Anwendung
app = FastAPI(
    title="SmartScanner Backend",
    version="0.1.0",
    description="API für Benutzerkonten, Produktscans und Verwaltung"
)

# CORS erlauben für lokale Entwicklung (App/Webfrontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in Produktion ersetzen mit ["https://deine-app.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API-Router einbinden
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(items.router, prefix="/items", tags=["items"])
app.include_router(media.router, prefix="/media", tags=["media"])


# Health-Check-Route
@app.get("/")
def read_root():
    return {"status": "ok", "message": "backend is running"}
