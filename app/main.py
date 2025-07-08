from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

from app.database import Base, engine
from app.api import auth, users, products, inventory, media

# Tabellen anlegen
Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app = FastAPI(
    title="Smart Scanner Backend",
    version="0.1.0",
    description="API für User, Produkt-Scan, Bilder-Upload"
)

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
