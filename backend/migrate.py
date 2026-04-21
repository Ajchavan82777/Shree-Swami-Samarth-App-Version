"""
Run SQL migration files against the configured DATABASE_URL.

Usage:
    python migrate.py              # runs all migrations in order
    python migrate.py --seed       # also runs 002_seed.sql
    python migrate.py --reset      # drops & recreates schema then seeds
"""
import os
import sys
import psycopg2

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), "..", "migrations")


def get_conn():
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL env var is not set")
    if "sslmode" not in url:
        sep = "&" if "?" in url else "?"
        url += f"{sep}sslmode=require"
    return psycopg2.connect(url)


def run_file(conn, path):
    print(f"  → {os.path.basename(path)}")
    with open(path, "r", encoding="utf-8") as f:
        sql = f.read()
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.commit()


def main():
    args = sys.argv[1:]
    seed  = "--seed"  in args or "--reset" in args
    reset = "--reset" in args

    files = ["001_schema.sql"]
    if seed:
        files.append("002_seed.sql")

    conn = get_conn()
    try:
        print("Running migrations...")
        for fname in files:
            path = os.path.join(MIGRATIONS_DIR, fname)
            if not os.path.exists(path):
                print(f"  ! {fname} not found, skipping")
                continue
            run_file(conn, path)
        print("Done.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
