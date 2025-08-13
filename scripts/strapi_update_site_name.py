#!/usr/bin/env python3
import os
import sys
import requests


def main() -> int:
    base = os.environ.get("STRAPI_URL")
    token = os.environ.get("STRAPI_TOKEN")
    admin_token = os.environ.get("STRAPI_ADMIN_TOKEN")
    site_id = os.environ.get("SITE_ID", "demo")
    new_name = os.environ.get("NEW_SITE_NAME")
    if not base or not new_name:
        print("Set STRAPI_URL and NEW_SITE_NAME", file=sys.stderr)
        return 1
    # Prefer Admin API if admin token provided
    if admin_token:
        session = requests.Session()
        session.headers.update({"Authorization": f"Bearer {admin_token}"})
        # List sites via admin content-manager
        r = session.get(f"{base}/admin/content-manager/collection-types/api::site.site", params={"pageSize": 100})
        try:
            j = r.json()
        except Exception:
            print("Failed to query Admin API", file=sys.stderr)
            return 1
        items = (j.get("results") or j.get("data") or [])
        match = None
        for it in items:
            # Admin API may return objects with id and attributes
            sid = (it.get("siteId") or it.get("attributes", {}).get("siteId") or "").strip()
            if sid == site_id:
                match = it
                break
        if not match and items:
            # fallback to first
            match = items[0]
        if not match:
            print("Site not found via Admin API", file=sys.stderr)
            return 1
        pk = match.get("id") or match.get("documentId")
        if not pk:
            print("No primary key on site entry", file=sys.stderr)
            return 1
        r2 = session.put(
            f"{base}/admin/content-manager/collection-types/api::site.site/{pk}",
            json={"data": {"name": new_name}},
        )
        if not r2.ok:
            print(f"Failed to update via Admin API: {r2.status_code} {r2.text}", file=sys.stderr)
            return 1
        print(f"Updated site name (Admin API) to: {new_name}")
        return 0

    # Fallback: Content API token
    if not token:
        print("Set STRAPI_TOKEN or STRAPI_ADMIN_TOKEN", file=sys.stderr)
        return 1
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})
    r = session.get(
        f"{base}/api/sites",
        params={
            "filters[siteId][$eq]": site_id,
            "pagination[pageSize]": 1,
        },
    )
    site_pk = None
    try:
        data = r.json().get("data", [])
        if data:
            site_pk = data[0].get("id")
    except Exception:
        site_pk = None
    if not site_pk:
        print("No site found via Content API", file=sys.stderr)
        return 1
    r2 = session.put(
        f"{base}/api/sites/{site_pk}",
        json={"data": {"name": new_name}},
    )
    if not r2.ok:
        print(f"Failed to update site (Content API): {r2.status_code} {r2.text}", file=sys.stderr)
        return 1
    print(f"Updated site name to: {new_name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


