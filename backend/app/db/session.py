from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession
import os

# Using PostgreSQL as requested
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:mitul@localhost:5432/cybergurd")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
