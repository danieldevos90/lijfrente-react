#!/usr/bin/env python3
import os
import sys
import requests


def main() -> int:
    base = os.environ.get("STRAPI_URL")
    token = os.environ.get("STRAPI_TOKEN") or os.environ.get("STRAPI_ADMIN_TOKEN")
    site_id = os.environ.get("SITE_ID", "demo")
    name = os.environ.get("SITE_NAME", "zakelijk-lening-project-cms")
    if not base or not token:
        print("Set STRAPI_URL and STRAPI_TOKEN/STRAPI_ADMIN_TOKEN", file=sys.stderr)
        return 1

    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})

    # Try content API first
    r = session.get(f"{base}/api/sites", params={
        "filters[siteId][$eq]": site_id,
        "pagination[pageSize]": 1,
    })
    data = []
    try:
        data = r.json().get("data", [])
    except Exception:
        data = []
    if data:
        pk = data[0].get("id")
        ru = session.put(f"{base}/api/sites/{pk}", json={"data": {"name": name}})
        if not ru.ok:
            print(f"Failed to update site via content API: {ru.status_code} {ru.text}", file=sys.stderr)
            return 1
        print(f"Ensured site name={name} (updated)")
        return 0

    # Create new site
    rc = session.post(f"{base}/api/sites", json={"data": {"siteId": site_id, "name": name}})
    if not rc.ok:
        print(f"Failed to create site via content API: {rc.status_code} {rc.text}", file=sys.stderr)
        return 1
    print(f"Ensured site name={name} (created)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


