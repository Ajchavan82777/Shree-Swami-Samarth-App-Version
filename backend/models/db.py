"""
PostgreSQL connection pool for Supabase / any Postgres host.
Usage:
    from models.db import get_db

    with get_db() as cur:
        cur.execute("SELECT * FROM customers")
        rows = cur.fetchall()   # each row is a dict (RealDictCursor)
"""
import os
import json
from contextlib import contextmanager

import psycopg2
import psycopg2.extras
import psycopg2.pool

_pool: psycopg2.pool.ThreadedConnectionPool | None = None


def _build_pool() -> psycopg2.pool.ThreadedConnectionPool:
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    # Supabase (and most hosted Postgres) requires SSL
    if "sslmode" not in url:
        sep = "&" if "?" in url else "?"
        url += sep + "sslmode=require"

    return psycopg2.pool.ThreadedConnectionPool(
        minconn=1,
        maxconn=10,
        dsn=url,
        cursor_factory=psycopg2.extras.RealDictCursor,
    )


def _get_pool() -> psycopg2.pool.ThreadedConnectionPool:
    global _pool
    if _pool is None or _pool.closed:
        _pool = _build_pool()
    return _pool


@contextmanager
def get_db():
    """Context manager that yields a cursor, auto-commits or rolls back."""
    pool = _get_pool()
    conn = pool.getconn()
    cur = conn.cursor()
    try:
        yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        pool.putconn(conn)


def row_to_dict(row) -> dict | None:
    """Convert a RealDictRow (or None) to a plain dict."""
    if row is None:
        return None
    d = dict(row)
    # Stringify any remaining datetime/date so jsonify handles them cleanly
    for k, v in d.items():
        if hasattr(v, "isoformat"):
            d[k] = v.isoformat()
    return d


def rows_to_list(rows) -> list[dict]:
    return [row_to_dict(r) for r in rows]


def json_val(v):
    """Wrap a Python list/dict in psycopg2.extras.Json for JSONB columns."""
    return psycopg2.extras.Json(v, dumps=json.dumps)
