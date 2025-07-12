from dotenv import load_dotenv
from slowapi.middleware import SlowAPIMiddleware

load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

from app.config import settings
from app.database import Base, engine
from app.api import auth, users, products, inventory, media

# Tabellen anlegen
Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
# z. B. einmalig in main.py oder separatem script

from app.database import log_engine, LogBase

LogBase.metadata.create_all(bind=log_engine)


from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, FastAPI

from app.extensions import limiter

app = FastAPI(
    title="Smart Scanner Backend",
    version="0.1.0",
    description="API für User, Produkt-Scan, Bilder-Upload"
)

from app.extensions import limiter
from slowapi.middleware import SlowAPIMiddleware

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


# CORS (Dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files (Bilder)
app.mount("/media", StaticFiles(directory="media"), name="media")

# Router
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
app.include_router(media.router, prefix="/media", tags=["media"])

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/token")
def redirect_token():
    return RedirectResponse(url="/auth/login")
