from dotenv import load_dotenv

from app.api.auth import router

load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer
from starlette.responses import RedirectResponse

from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from app.config import settings
from app.database import Base, engine, LogBase, log_engine
from app.extensions import limiter
from app.api import auth, users, products, inventory, media, logs

# Datenbanktabellen initialisieren
Base.metadata.create_all(bind=engine)
LogBase.metadata.create_all(bind=log_engine)

# OAuth2-Schema
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# FastAPI-Instanz
app = FastAPI(
    title="Smart Scanner Backend",
    version="0.1.0",
    description="API für Userverwaltung, Produkt-Scan und Medien-Upload"
)

# Rate Limiting konfigurieren
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# CORS-Middleware (nur für Entwicklung offen)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Statische Dateien (z. B. Bilder)
app.mount("/media", StaticFiles(directory="media"), name="media")

# API-Router einbinden
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
app.include_router(media.router, prefix="/media", tags=["media"])
app.include_router(logs.router, prefix="/logs", tags=["logs"])

# Health Check
@app.get("/")
def health_check():
    return {"status": "ok"}



@router.get("/token")
def redirect_token():
    return RedirectResponse(url="/auth/login")
