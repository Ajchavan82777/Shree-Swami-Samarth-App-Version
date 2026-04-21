"""
fix_user_roles.py
-----------------
Finds users with missing/empty roles and lets you reassign them interactively.
Uses the existing backend API — no extra dependencies beyond `requests`.

Usage:
  python scripts/fix_user_roles.py                        # targets localhost:5000
  python scripts/fix_user_roles.py --url https://your-render-app.onrender.com/api
"""

import sys
import requests

# ── Config ──────────────────────────────────────────────────────────────────
DEFAULT_URL = "http://localhost:5000/api"

def main():
    base = DEFAULT_URL
    for i, arg in enumerate(sys.argv[1:]):
        if arg == "--url" and i + 1 < len(sys.argv[1:]):
            base = sys.argv[i + 2]
        elif arg.startswith("http"):
            base = arg
    base = base.rstrip("/")

    print(f"\n=== SSS User Role Fix Script ===")
    print(f"Backend: {base}\n")

    # ── Step 1: Login ────────────────────────────────────────────────────────
    email    = input("Admin email    : ").strip()
    password = input("Admin password : ").strip()

    resp = requests.post(f"{base}/auth/login", json={"email": email, "password": password})
    if resp.status_code != 200:
        print(f"\n[ERROR] Login failed: {resp.json().get('message', resp.text)}")
        sys.exit(1)

    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Logged in.\n")

    # ── Step 2: Fetch users ───────────────────────────────────────────────────
    users_r = requests.get(f"{base}/auth/users", headers=headers)
    if users_r.status_code != 200:
        print(f"[ERROR] Could not fetch users: {users_r.text}")
        sys.exit(1)
    all_users = users_r.json()

    # Users with missing/empty role
    broken = [u for u in all_users if not u.get("role") or u["role"].strip() == ""]
    if not broken:
        print("[OK] All users already have a role assigned. Nothing to fix.")
        sys.exit(0)

    print(f"Found {len(broken)} user(s) with no role:\n")
    for u in broken:
        print(f"  [{u['id']}] {u['name']} <{u['email']}>")

    # ── Step 3: Fetch available roles ─────────────────────────────────────────
    roles_r = requests.get(f"{base}/roles/", headers=headers)
    if roles_r.status_code != 200:
        print(f"[ERROR] Could not fetch roles: {roles_r.text}")
        sys.exit(1)
    roles = [r["role_name"] for r in roles_r.json() if r.get("role_name")]
    roles_display = ["admin"] + [r for r in roles if r != "admin"]

    print(f"\nAvailable roles:")
    for i, r in enumerate(roles_display, 1):
        print(f"  {i}. {r}")

    # ── Step 4: Assign roles interactively ────────────────────────────────────
    print()
    updated = 0
    for u in broken:
        print(f"User: {u['name']} <{u['email']}>")
        raw = input(f"  Enter role name (or number 1-{len(roles_display)}, blank to skip): ").strip()

        if not raw:
            print("  Skipped.\n")
            continue

        # Allow picking by number
        if raw.isdigit() and 1 <= int(raw) <= len(roles_display):
            chosen = roles_display[int(raw) - 1]
        elif raw in roles_display:
            chosen = raw
        else:
            print(f"  [WARN] '{raw}' is not a known role. Saving anyway.\n")
            chosen = raw

        put_r = requests.put(
            f"{base}/auth/users/{u['id']}",
            headers=headers,
            json={"name": u["name"], "role": chosen},
        )
        if put_r.status_code == 200:
            print(f"  [OK] Updated → role = '{chosen}'\n")
            updated += 1
        else:
            print(f"  [ERROR] {put_r.json().get('message', put_r.text)}\n")

    print(f"Done. {updated}/{len(broken)} user(s) updated.")
    if updated < len(broken):
        print("Re-run the script to fix remaining users.")

if __name__ == "__main__":
    main()
