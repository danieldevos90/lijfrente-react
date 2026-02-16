#!/usr/bin/env python3
"""
Sync Strapi `sector-page` entries from CSV exports.

Inputs (relative to repo root):
  - frontend/exports/sector-pages.csv
  - frontend/exports/sector-use-cases.csv
  - frontend/exports/sector-benefits.csv

Auth:
  - STRAPI_URL (default: https://bright-smile-1f47bc9d67.strapiapp.com)
  - STRAPI_TOKEN (required)  # API token with write access to sector-pages

Notes:
  - The Strapi schema for `sector-page` does NOT include metaTitle; we ignore it.
  - We upsert by (siteId, sectorSlug).
"""

from __future__ import annotations

import csv
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


DEFAULT_STRAPI_URL = "https://bright-smile-1f47bc9d67.strapiapp.com"


@dataclass(frozen=True)
class SectorKey:
    site_id: str
    sector_slug: str


def _read_csv(path: Path) -> List[Dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            # Normalize None -> "" to simplify downstream usage
            rows.append({k: (v if v is not None else "") for k, v in row.items()})
        return rows


def _req_json(method: str, url: str, token: str, payload: Optional[Dict[str, Any]] = None) -> Tuple[int, Dict[str, Any]]:
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(url=url, method=method, headers=headers, data=data)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = ""
        try:
            raw = e.read().decode("utf-8")
        except Exception:
            pass
        body = {}
        try:
            body = json.loads(raw) if raw else {}
        except Exception:
            body = {"_raw": raw}
        return e.code, body


def _build_use_cases(use_case_rows: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    # Sort by useCaseIndex as int (fallback: 0)
    def _idx(r: Dict[str, str]) -> int:
        try:
            return int((r.get("useCaseIndex") or "0").strip())
        except Exception:
            return 0

    out: List[Dict[str, Any]] = []
    for r in sorted(use_case_rows, key=_idx):
        out.append(
            {
                "title": (r.get("useCaseTitle") or "").strip(),
                "description": (r.get("useCaseDescription") or "").strip(),
                "iconPath": (r.get("useCaseIconPath") or "").strip() or None,
                # "image" is media; we cannot set it from CSV export.
                "color": (r.get("useCaseColor") or "").strip() or None,
                "textColor": (r.get("useCaseTextColor") or "").strip() or None,
                "buttonLabel": (r.get("buttonLabel") or "").strip() or None,
                "buttonHref": (r.get("buttonHref") or "").strip() or None,
            }
        )
    # Drop None keys to avoid validation noise
    cleaned: List[Dict[str, Any]] = []
    for item in out:
        cleaned.append({k: v for k, v in item.items() if v is not None and v != ""})
    return cleaned


def _build_benefits(benefit_rows: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    def _idx(r: Dict[str, str]) -> int:
        try:
            return int((r.get("benefitIndex") or "0").strip())
        except Exception:
            return 0

    out: List[Dict[str, Any]] = []
    for r in sorted(benefit_rows, key=_idx):
        out.append(
            {
                "title": (r.get("benefitTitle") or "").strip(),
                "description": (r.get("benefitDescription") or "").strip(),
                "iconPath": (r.get("benefitIconPath") or "").strip() or None,
                "color": (r.get("benefitColor") or "").strip() or None,
                "textColor": (r.get("benefitTextColor") or "").strip() or None,
            }
        )
    cleaned: List[Dict[str, Any]] = []
    for item in out:
        cleaned.append({k: v for k, v in item.items() if v is not None and v != ""})
    return cleaned


def _find_existing_sector_page(strapi_url: str, token: str, key: SectorKey) -> Optional[Dict[str, Any]]:
    params = {
        "filters[siteId][$eq]": key.site_id,
        "filters[sectorSlug][$eq]": key.sector_slug,
        "pagination[pageSize]": "1",
    }
    url = f"{strapi_url}/api/sector-pages?{urllib.parse.urlencode(params)}"
    status, body = _req_json("GET", url, token, None)
    if status != 200:
        return None
    data = body.get("data") or []
    if not data:
        return None
    return data[0]


def _extract_update_id(entry: Dict[str, Any]) -> Optional[str]:
    # Strapi v4: id; Strapi v5: documentId (often).
    if "documentId" in entry and entry["documentId"]:
        return str(entry["documentId"])
    if "id" in entry and entry["id"] is not None:
        return str(entry["id"])
    # Some responses nest in attributes; be defensive.
    attrs = entry.get("attributes") or {}
    if "documentId" in attrs and attrs["documentId"]:
        return str(attrs["documentId"])
    if "id" in attrs and attrs["id"] is not None:
        return str(attrs["id"])
    return None


def _try_publish(strapi_url: str, token: str, update_id: str) -> bool:
    # Strapi v5 publish action
    url = f"{strapi_url}/api/sector-pages/{update_id}/actions/publish"
    status, _ = _req_json("POST", url, token, {"data": {}})
    if status in (200, 201):
        return True
    return False


def upsert_sector_page(
    strapi_url: str,
    token: str,
    page_row: Dict[str, str],
    use_cases_rows: List[Dict[str, str]],
    benefit_rows: List[Dict[str, str]],
    publish: bool,
) -> bool:
    key = SectorKey(site_id=(page_row.get("siteId") or "").strip(), sector_slug=(page_row.get("sectorSlug") or "").strip())
    if not key.site_id or not key.sector_slug:
        return False

    # Map fields that exist on the Strapi schema (sector-page schema.json).
    data: Dict[str, Any] = {
        "siteId": key.site_id,
        "sectorSlug": key.sector_slug,
        "sectorName": (page_row.get("sectorName") or "").strip(),
        "metaDescription": (page_row.get("metaDescription") or "").strip() or None,
        "metaKeywords": (page_row.get("metaKeywords") or "").strip() or None,
        "heroTitle": (page_row.get("heroTitle") or "").strip() or None,
        "heroSubtitle": (page_row.get("heroSubtitle") or "").strip() or None,
        "useCasesTitle": (page_row.get("useCasesTitle") or "").strip() or None,
        "useCasesSubtitle": (page_row.get("useCasesSubtitle") or "").strip() or None,
        "quote": (page_row.get("quote") or "").strip() or None,
        "quoteAuthor": (page_row.get("quoteAuthor") or "").strip() or None,
        "useCases": _build_use_cases(use_cases_rows),
        "benefits": _build_benefits(benefit_rows),
    }
    # Remove Nones to keep payload clean.
    data = {k: v for k, v in data.items() if v is not None}

    existing = _find_existing_sector_page(strapi_url, token, key)
    payload = {"data": data}

    if existing:
        update_id = _extract_update_id(existing)
        if not update_id:
            return False
        url = f"{strapi_url}/api/sector-pages/{update_id}"
        status, body = _req_json("PUT", url, token, payload)
        ok = status in (200, 201)
        if not ok:
            err = body.get("error", {}).get("message") if isinstance(body, dict) else None
            print(f"❌ Update failed for {key.sector_slug}: HTTP {status}{': ' + err if err else ''}")
            return False
        if publish:
            _try_publish(strapi_url, token, update_id)
        return True

    # Create new
    url = f"{strapi_url}/api/sector-pages"
    status, body = _req_json("POST", url, token, payload)
    ok = status in (200, 201)
    if not ok:
        err = body.get("error", {}).get("message") if isinstance(body, dict) else None
        print(f"❌ Create failed for {key.sector_slug}: HTTP {status}{': ' + err if err else ''}")
        return False
    if publish:
        created = (body or {}).get("data") if isinstance(body, dict) else None
        update_id = _extract_update_id(created or {})
        if update_id:
            _try_publish(strapi_url, token, update_id)
    return True


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    exports_dir = repo_root / "frontend" / "exports"

    strapi_url = (os.getenv("STRAPI_URL") or DEFAULT_STRAPI_URL).rstrip("/")
    token = os.getenv("STRAPI_TOKEN") or os.getenv("STRAPI_API_TOKEN")
    if not token:
        print("Set STRAPI_TOKEN (or STRAPI_API_TOKEN) in environment.", file=sys.stderr)
        return 1

    publish = os.getenv("STRAPI_PUBLISH", "1").strip() not in ("0", "false", "False", "no", "NO")

    pages = _read_csv(exports_dir / "sector-pages.csv")
    use_cases = _read_csv(exports_dir / "sector-use-cases.csv")
    benefits = _read_csv(exports_dir / "sector-benefits.csv")

    use_cases_by_key: Dict[SectorKey, List[Dict[str, str]]] = {}
    for r in use_cases:
        key = SectorKey(site_id=(r.get("siteId") or "").strip(), sector_slug=(r.get("sectorSlug") or "").strip())
        use_cases_by_key.setdefault(key, []).append(r)

    benefits_by_key: Dict[SectorKey, List[Dict[str, str]]] = {}
    for r in benefits:
        key = SectorKey(site_id=(r.get("siteId") or "").strip(), sector_slug=(r.get("sectorSlug") or "").strip())
        benefits_by_key.setdefault(key, []).append(r)

    ok_count = 0
    fail_count = 0
    print(f"Strapi: {strapi_url}")
    print(f"Syncing {len(pages)} sector pages from {exports_dir} ...")

    for row in pages:
        key = SectorKey(site_id=(row.get("siteId") or "").strip(), sector_slug=(row.get("sectorSlug") or "").strip())
        uc_rows = use_cases_by_key.get(key, [])
        b_rows = benefits_by_key.get(key, [])
        if not uc_rows:
            print(f"⚠️  No use cases found for {key.sector_slug} ({key.site_id})")
        if not b_rows:
            print(f"⚠️  No benefits found for {key.sector_slug} ({key.site_id})")

        ok = upsert_sector_page(strapi_url, token, row, uc_rows, b_rows, publish=publish)
        if ok:
            ok_count += 1
            print(f"✅ Upserted sector-page: {key.sector_slug} ({len(uc_rows)} use cases, {len(b_rows)} benefits)")
        else:
            fail_count += 1

        # Avoid rate limiting / keep Strapi stable
        time.sleep(0.15)

    print(f"Done. OK={ok_count} FAIL={fail_count}")
    return 0 if fail_count == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())

