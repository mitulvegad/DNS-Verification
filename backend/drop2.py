import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

engine = create_async_engine('postgresql+asyncpg://postgres:mitul@localhost:5432/cybergurd')

async def main():
    async with engine.begin() as conn:
        await conn.execute(text('DROP TABLE IF EXISTS websites CASCADE;'))
        print("Table dropped")

asyncio.run(main())
