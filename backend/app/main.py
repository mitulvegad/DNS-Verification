from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, websites
from app.db.base import Base
from app.db.session import engine

app = FastAPI(title="CyberGuard DNS Verification")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(websites.router, prefix="/websites", tags=["websites"])

# Added /api prefix to support your custom frontend layout
app.include_router(auth.router, prefix="/api/auth", tags=["api_auth"])
app.include_router(websites.router, prefix="/api/websites", tags=["api_websites"])

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {"message": "CyberGuard API"}
