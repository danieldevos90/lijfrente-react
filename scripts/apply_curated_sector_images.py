#!/usr/bin/env python3
"""
Apply curated Unsplash image URLs to Strapi sector-pages.

What it does:
- Downloads each provided image URL (images.unsplash.com / plus.unsplash.com)
- Uploads it to Strapi Media Library (reuses already-uploaded files by filename)
- Updates sector-pages:
  - heroImage
  - easyLendingImage
  - useCases[].image (optional; based on mapping)

This intentionally does NOT require Unsplash API access keys because the input is already a set
of direct image URLs. If you later switch to using Unsplash photo IDs, you can extend this script
to call the official download tracking endpoint.

Config:
- Reads `frontend/.env.local` for NEXT_PUBLIC_STRAPI_URL / STRAPI_URL (no secrets printed)
- Token: STRAPI_API_TOKEN or STRAPI_TOKEN (env var preferred; falls back to .env.local)

Usage:
  python3 scripts/apply_curated_sector_images.py

Optional env:
  ONLY_SECTORS="transport,tandarts"   Limit sectors (comma-separated)
  DRY_RUN="1"                        Don't upload/update, just log intended actions

Options:
  --mapping scripts/curated-sector-images.json
  --siteId geldgeregeld
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
import urllib.parse
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import requests  # type: ignore
except Exception as e:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: requests. Install with `python3 -m pip install -r scripts/requirements.txt` "
        "(or `python3 -m pip install requests`)."
    ) from e


REPO_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = REPO_ROOT / "frontend" / ".env.local"


def _load_env_file(path: Path) -> Dict[str, str]:
    if not path.exists():
        return {}
    out: Dict[str, str] = {}
    for raw in path.read_text("utf-8", errors="ignore").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip()
        v = v.strip().strip('"').strip("'")
        out[k] = v
    return out


def _slugify(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "item"


def _sha1_short(s: str) -> str:
    h = hashlib.sha1(s.encode("utf-8")).hexdigest()
    return h[:10]


def _only_sectors() -> Optional[set[str]]:
    v = (os.getenv("ONLY_SECTORS") or "").strip()
    if not v:
        return None
    return {s.strip() for s in v.split(",") if s.strip()}


def _bool_env(name: str, default: bool = False) -> bool:
    v = os.getenv(name)
    if v is None:
        return default
    return v.strip().lower() not in ("0", "false", "no", "off", "")


def _strapi_req(
    method: str,
    url: str,
    token: Optional[str],
    *,
    json_payload: Optional[Dict[str, Any]] = None,
    files: Optional[Dict[str, Any]] = None,
    data: Optional[Dict[str, Any]] = None,
    timeout: int = 60,
) -> Tuple[int, Any]:
    headers: Dict[str, str] = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        resp = requests.request(
            method,
            url,
            headers=headers,
            json=json_payload,
            files=files,
            data=data,
            timeout=timeout,
        )
        if resp.headers.get("content-type", "").startswith("application/json"):
            return resp.status_code, resp.json()
        return resp.status_code, resp.text
    except Exception as e:
        return 0, {"error": str(e)}


@dataclass(frozen=True)
class SectorKey:
    site_id: str
    sector_slug: str


def _strapi_get_sector_page(strapi_url: str, key: SectorKey, token: Optional[str]) -> Optional[Dict[str, Any]]:
    sp = urllib.parse.urlencode(
        {
            "filters[siteId][$eq]": key.site_id,
            "filters[sectorSlug][$eq]": key.sector_slug,
            "pagination[pageSize]": "1",
            "populate[heroImage][populate]": "*",
            "populate[easyLendingImage][populate]": "*",
            "populate[useCases][populate]": "*",
        }
    )
    url = f"{strapi_url}/api/sector-pages?{sp}"
    status, body = _strapi_req("GET", url, token=token)
    if status != 200 or not isinstance(body, dict):
        return None
    data = body.get("data") or []
    if not data:
        return None
    return data[0]


def _extract_update_id(entry: Dict[str, Any]) -> Optional[str]:
    # Strapi v4: id; Strapi v5: documentId (often).
    if entry.get("documentId"):
        return str(entry["documentId"])
    if entry.get("id") is not None:
        return str(entry["id"])
    attrs = entry.get("attributes") or {}
    if attrs.get("documentId"):
        return str(attrs["documentId"])
    if attrs.get("id") is not None:
        return str(attrs["id"])
    return None


def _find_existing_upload_id_by_name(strapi_url: str, token: str, filename: str) -> Optional[int]:
    params = urllib.parse.urlencode(
        {
            "filters[name][$eq]": filename,
            "pagination[pageSize]": "1",
            "sort[0]": "createdAt:desc",
        }
    )
    url = f"{strapi_url}/api/upload/files?{params}"
    status, body = _strapi_req("GET", url, token)
    if status != 200:
        return None

    # Strapi can return array (v4 plugin) or {data: []} (v5-ish).
    if isinstance(body, list) and body:
        try:
            return int(body[0].get("id"))
        except Exception:
            return None
    if isinstance(body, dict):
        data = body.get("data")
        if isinstance(data, list) and data:
            try:
                return int(data[0].get("id"))
            except Exception:
                return None
    return None


def _download_bytes(url: str) -> bytes:
    resp = requests.get(url, timeout=45)
    resp.raise_for_status()
    return resp.content


def _upload_to_strapi(
    strapi_url: str,
    token: str,
    *,
    filename: str,
    content: bytes,
    mime: str,
    alternative_text: str,
    caption: str,
) -> Optional[int]:
    files = {"files": (filename, content, mime)}
    data = {
        "name": filename,
        "alternativeText": alternative_text,
        "caption": caption,
    }
    status, payload = _strapi_req("POST", f"{strapi_url}/api/upload", token, files=files, data=data, timeout=90)
    if status not in (200, 201):
        return None
    if isinstance(payload, list) and payload:
        try:
            return int(payload[0].get("id"))
        except Exception:
            return None
    if isinstance(payload, dict) and payload.get("id") is not None:
        try:
            return int(payload["id"])
        except Exception:
            return None
    return None


def _extract_media_id(image_field: Any) -> Optional[int]:
    if image_field is None:
        return None
    if isinstance(image_field, int):
        return image_field
    if isinstance(image_field, str) and image_field.isdigit():
        return int(image_field)
    if isinstance(image_field, dict):
        if image_field.get("id") is not None:
            try:
                return int(image_field["id"])
            except Exception:
                return None
        data = image_field.get("data")
        if isinstance(data, dict) and data.get("id") is not None:
            try:
                return int(data["id"])
            except Exception:
                return None
    return None


def _clean_use_case_for_update(uc: Dict[str, Any], image_id: Optional[int]) -> Dict[str, Any]:
    # Strapi repeatable component update: do NOT send component instance `id`.
    out: Dict[str, Any] = {}
    for k in ("title", "description", "iconPath", "color", "textColor", "buttonLabel", "buttonHref"):
        v = uc.get(k)
        if v is None:
            continue
        if isinstance(v, str) and not v.strip():
            continue
        out[k] = v

    if not out.get("buttonHref"):
        out["buttonHref"] = "/lead"

    if image_id is not None:
        out["image"] = int(image_id)
    return out


def _ensure_uploaded_image(
    *,
    strapi_url: str,
    token: str,
    sector_slug: str,
    role: str,
    source_url: str,
    tags: List[str],
    dry_run: bool,
) -> Optional[int]:
    # Deterministic filename => allows re-runs without duplicates.
    # Include a short hash of the source URL so we can change images without clobbering old media.
    fname = f"sector_curated_{sector_slug}_{_slugify(role)}_{_sha1_short(source_url)}.jpg"

    if dry_run:
        return 0

    existing = _find_existing_upload_id_by_name(strapi_url, token, fname)
    if existing:
        return existing

    img_bytes = _download_bytes(source_url)
    alt = f"{sector_slug} - {role}".replace("-", " ").strip()
    tag_str = ", ".join([t for t in tags if t])
    caption = f"Curated image for sector '{sector_slug}' ({role}). Tags: {tag_str}. Source: {source_url}"

    return _upload_to_strapi(
        strapi_url,
        token,
        filename=fname,
        content=img_bytes,
        mime="image/jpeg",
        alternative_text=alt,
        caption=caption,
    )


def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(add_help=True)
    p.add_argument(
        "--mapping",
        default=str(REPO_ROOT / "scripts" / "curated-sector-images.json"),
        help="Path to curated mapping json",
    )
    p.add_argument("--siteId", default="", help="Strapi siteId filter (default env NEXT_PUBLIC_SITE_ID or geldgeregeld)")
    return p.parse_args()


def main() -> int:
    args = _parse_args()
    mapping_path = Path(args.mapping)
    if not mapping_path.exists():
        print(f"Missing mapping file: {mapping_path}", file=sys.stderr)
        return 2

    env = _load_env_file(ENV_PATH)
    strapi_url = (env.get("NEXT_PUBLIC_STRAPI_URL") or env.get("STRAPI_URL") or "").rstrip("/")
    token = (
        (os.getenv("STRAPI_API_TOKEN") or os.getenv("STRAPI_TOKEN") or env.get("STRAPI_API_TOKEN") or env.get("STRAPI_TOKEN") or "")
    ).strip()
    dry_run = _bool_env("DRY_RUN", False)

    if not strapi_url:
        print("Missing NEXT_PUBLIC_STRAPI_URL/STRAPI_URL (frontend/.env.local).", file=sys.stderr)
        return 3
    if not token and not dry_run:
        print("Missing STRAPI_API_TOKEN/STRAPI_TOKEN (env var or frontend/.env.local).", file=sys.stderr)
        return 4
    if not token and dry_run:
        print("⚠️  DRY_RUN=1 without STRAPI token; will only validate mapping + public reads.")

    site_id = (args.siteId or os.getenv("NEXT_PUBLIC_SITE_ID") or env.get("NEXT_PUBLIC_SITE_ID") or "geldgeregeld").strip()

    only = _only_sectors()

    mapping: Dict[str, Any] = json.loads(mapping_path.read_text("utf-8"))
    if not isinstance(mapping, dict) or not mapping:
        print("Mapping file is empty/invalid JSON object.", file=sys.stderr)
        return 2

    if not dry_run:
        status, _ = _strapi_req("GET", f"{strapi_url}/api/upload/files?pagination[limit]=1", token)
        if status in (401, 403) or status == 0:
            print("❌ Strapi token rejected (upload/files).", file=sys.stderr)
            print("Need permissions for: GET /api/upload/files, POST /api/upload, PUT /api/sector-pages/:id", file=sys.stderr)
            return 5

    sectors = [s for s in sorted(mapping.keys()) if (not only or s in only)]
    if not sectors:
        print("No sectors to process (check ONLY_SECTORS).")
        return 0

    print(f"Strapi: {strapi_url}")
    print(f"siteId: {site_id}")
    print(f"Sectors: {', '.join(sectors)}")
    if dry_run:
        print("DRY_RUN=1 (no uploads/updates)")

    updated = 0
    failed = 0

    for sector_slug in sectors:
        cfg = mapping.get(sector_slug) or {}
        if not isinstance(cfg, dict):
            continue

        tags = cfg.get("tags") or []
        if not isinstance(tags, list):
            tags = []
        tags = [str(t).strip() for t in tags if str(t).strip()]

        key = SectorKey(site_id=site_id, sector_slug=sector_slug)
        entry = _strapi_get_sector_page(strapi_url, key, token=None)  # reads are public on this setup
        if not entry:
            # Try with token (in case read endpoints are protected)
            entry = _strapi_get_sector_page(strapi_url, key, token=token) if token else None
        if not entry:
            print(f"❌ sector-page not found: {site_id}/{sector_slug}")
            failed += 1
            continue

        update_id = _extract_update_id(entry)
        if not update_id:
            print(f"❌ Could not extract update id: {site_id}/{sector_slug}")
            failed += 1
            continue

        hero_url = str(cfg.get("heroImageUrl") or "").strip()
        easy_url = str(cfg.get("easyLendingImageUrl") or "").strip()
        usecase_urls = cfg.get("useCaseImageUrls") or []
        if not isinstance(usecase_urls, list):
            usecase_urls = []
        usecase_urls = [str(u).strip() for u in usecase_urls if str(u).strip()]

        hero_id = None
        easy_id = None

        if hero_url:
            hero_id = _ensure_uploaded_image(
                strapi_url=strapi_url,
                token=token,
                sector_slug=sector_slug,
                role="hero",
                source_url=hero_url,
                tags=tags,
                dry_run=dry_run,
            )
            if hero_id is None:
                print(f"  ❌ Upload failed: {sector_slug} heroImage")
                failed += 1
                continue

        if easy_url:
            easy_id = _ensure_uploaded_image(
                strapi_url=strapi_url,
                token=token,
                sector_slug=sector_slug,
                role="easy-lending",
                source_url=easy_url,
                tags=tags,
                dry_run=dry_run,
            )
            if easy_id is None:
                print(f"  ❌ Upload failed: {sector_slug} easyLendingImage")
                failed += 1
                continue

        attrs = entry.get("attributes") or entry
        use_cases = attrs.get("useCases") or []
        if not isinstance(use_cases, list):
            use_cases = []

        updated_use_cases: Optional[List[Dict[str, Any]]] = None
        if usecase_urls and use_cases:
            updated_use_cases = []
            for idx, uc in enumerate(use_cases):
                if not isinstance(uc, dict):
                    continue
                existing_image_id = _extract_media_id(uc.get("image"))
                if idx < len(usecase_urls) and usecase_urls[idx]:
                    new_id = _ensure_uploaded_image(
                        strapi_url=strapi_url,
                        token=token,
                        sector_slug=sector_slug,
                        role=f"usecase-{idx}",
                        source_url=usecase_urls[idx],
                        tags=tags,
                        dry_run=dry_run,
                    )
                    if new_id is None:
                        # Keep existing; do not fail the entire sector on a single usecase.
                        updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                        continue
                    updated_use_cases.append(_clean_use_case_for_update(uc, None if dry_run else int(new_id)))
                else:
                    updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))

        if dry_run:
            print(f"  ✅ (dry-run) would update: {sector_slug}")
            updated += 1
            continue

        payload: Dict[str, Any] = {"data": {}}
        if hero_id is not None:
            payload["data"]["heroImage"] = int(hero_id)
        if easy_id is not None:
            payload["data"]["easyLendingImage"] = int(easy_id)
        if updated_use_cases is not None:
            payload["data"]["useCases"] = updated_use_cases

        if not payload["data"]:
            print(f"  ⚠️  No changes to apply for: {sector_slug}")
            continue

        url = f"{strapi_url}/api/sector-pages/{update_id}"
        status, body = _strapi_req("PUT", url, token, json_payload=payload, timeout=60)
        if status not in (200, 201):
            msg = ""
            if isinstance(body, dict):
                msg = body.get("error", {}).get("message") or ""
            print(f"  ❌ Update failed: {sector_slug} HTTP {status} {msg}".strip())
            failed += 1
            continue

        print(f"  ✅ Updated: {sector_slug} (hero/easy/usecases as provided)")
        updated += 1
        time.sleep(0.35)

    print(f"Done. UPDATED={updated} FAILED={failed}")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())

