from fastapi import APIRouter, HTTPException
from sqlalchemy import text

from app.core.database import engine

router = APIRouter()


@router.get("/")
async def health_check():
    return {"status": "ok"}


@router.get("/ready")
async def readiness_check():
    """Readiness probe — verifies the database is reachable."""
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        raise HTTPException(status_code=503, detail="database unavailable")
    return {"status": "ready"}
