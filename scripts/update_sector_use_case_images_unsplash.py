#!/usr/bin/env python3
"""
Attach Dutch-biased Unsplash images to Strapi sector-page use cases.

Why:
- The frontend falls back to Unsplash when Strapi useCases[].image is missing.
- Those ad-hoc Unsplash results can look "non-Dutch".
- By uploading and linking images in Strapi, we make visuals consistent and exportable.

Inputs:
- Reads `frontend/exports/sector-use-cases.csv` to know which sectors exist (and expected count).
  (The script does NOT overwrite copy; it only updates the media relation on existing use cases.)

Auth/config:
- Loads secrets from `frontend/.env.local` (no printing).
- Needs:
  - NEXT_PUBLIC_STRAPI_URL (or STRAPI_URL)
  - STRAPI_API_TOKEN (or STRAPI_TOKEN)
  - UNSPLASH_ACCESS_KEY

Usage:
  python3 scripts/update_sector_use_case_images_unsplash.py

Optional env:
  ONLY_SECTORS="transport,zzp"   Limit sectors (comma-separated)
  FORCE="1"                     Replace images even if already set
  DRY_RUN="1"                   Don't upload/update, just log actions
  USE_CURATED_URLS="1"          Prefer curated URLs (if present for sector)
"""

from __future__ import annotations

import csv
import json
import os
import re
import subprocess
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
EXPORTS_UC = REPO_ROOT / "frontend" / "exports" / "sector-use-cases.csv"
STATE_DIR = REPO_ROOT / "scripts" / ".cache"
DEFAULT_STATE_PATH = STATE_DIR / "sector_usecase_image_refresh_state.json"
CURATED_MAPPING_PATH = REPO_ROOT / "scripts" / "curated-sector-images.json"

def _resolve_unsplash_skill_dir() -> Path:
    # Prefer repo-local skills installation (from `npx skills add ...`),
    # then fall back to Codex global skills.
    candidates = [
        REPO_ROOT / ".agents" / "skills" / "unsplash",
        Path.home() / ".codex" / "skills" / "unsplash",
    ]
    for c in candidates:
        if (c / "scripts" / "search.sh").exists():
            return c
    return candidates[-1]


UNSPLASH_SKILL_DIR = _resolve_unsplash_skill_dir()
UNSPLASH_SEARCH = UNSPLASH_SKILL_DIR / "scripts" / "search.sh"
UNSPLASH_TRACK = UNSPLASH_SKILL_DIR / "scripts" / "track.sh"
UNSPLASH_API_BASE = "https://api.unsplash.com"

# Curated images (provided manually) to attach via Strapi API.
# Keys must match Strapi sectorSlug values (e.g. "starters", "schoonheid").
# These URLs are used only when USE_CURATED_URLS=1 (default: false).
CURATED_SECTOR_IMAGE_URLS: Dict[str, List[str]] = {
    "automotive": [
        "https://plus.unsplash.com/premium_photo-1661384315356-fcf68efc1a55?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVzaW5lc3MlMjBjYXIlMjBkZWFsZXJ8ZW58MHx8MHx8fDA%3D",
        "https://plus.unsplash.com/premium_photo-1661715820775-64e66ddf2b17?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGJ1c2luZXNzJTIwY2FyJTIwZGVhbGVyfGVufDB8fDB8fHww",
        "https://plus.unsplash.com/premium_photo-1661385829433-2d020b9cd8b4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGJ1c2luZXNzJTIwY2FyJTIwZGVhbGVyfGVufDB8fDB8fHww",
        "https://plus.unsplash.com/premium_photo-1661407734630-9e67df822e4a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGJ1c2luZXNzJTIwY2FyJTIwZGVhbGVyfGVufDB8fDB8fHww",
    ],
    "zzp": [
        "https://plus.unsplash.com/premium_photo-1758646999132-a54fcd6d4ac6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnVzaW5lc3MlMjBzZWxmJTIwZW1wbG95ZWR8ZW58MHx8MHx8fDA%3D",
        "https://plus.unsplash.com/premium_photo-1683141489610-36806af3ba2c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVzaW5lc3MlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D",
        "https://plus.unsplash.com/premium_photo-1682433277284-1c3b9e1a3374?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJ1c2luZXNzJTIwbGFwdG9wfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1583836952518-2ab91488cdbb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGJ1c2luZXNzJTIwbGFwdG9wfGVufDB8fDB8fHww",
    ],
    "tandarts": [
        "https://images.unsplash.com/photo-1560070201-d3d11effa179?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YnVzaW5lc3MlMjBkZW50aXN0fGVufDB8fDB8fHww",
        "https://plus.unsplash.com/premium_photo-1673958772152-7ba23f2fe7d4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJ1c2luZXNzJTIwZGVudGlzdHxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1643660527072-9c702932f606?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGJ1c2luZXNzJTIwZGVudGlzdHxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1674775372058-c4c8813c6611?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGJ1c2luZXNzJTIwZGVudGlzdHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    "bouw": [
        "https://images.unsplash.com/photo-1564182999932-bc192d89ab22?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fGJ1c2luZXNzJTIwY29uc3RydWN0aW9ufGVufDB8fDB8fHww",
    ],
    "horeca": [
        "https://plus.unsplash.com/premium_photo-1661389636975-0b84d5e8a276?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGJ1c2luZXNzJTIwY2FmZXxlbnwwfHwwfHx8MA%3D%3D",
    ],
    "starters": [
        "https://plus.unsplash.com/premium_photo-1686360865919-6c587abf2544?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVzaW5lc3MlMjBzdGFydGVyfGVufDB8fDB8fHww",
        "https://plus.unsplash.com/premium_photo-1663054455702-72ebba16d2cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJ1c2luZXNzJTIwc3RhcnRlcnxlbnwwfHwwfHx8MA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1767883339484-f92169852a26?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGJ1c2luZXNzJTIwc3RhcnRlcnxlbnwwfHwwfHx8MA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1723120606774-a004ec0f31f5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGJ1c2luZXNzJTIwc3RhcnRlcnxlbnwwfHwwfHx8MA%3D%3D",
    ],
    "ecommerce": [
        "https://plus.unsplash.com/premium_photo-1770559488131-e37d29ab4ae0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVzaW5lc3MlMjByZXRhaWx8ZW58MHx8MHx8fDA%3D",
    ],
    "schoonheid": [
        "https://plus.unsplash.com/premium_photo-1661964137852-2c9038cf98fa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVzaW5lc3MlMjBiZWF1dHklMjBzYWxvbnxlbnwwfHwwfHx8MA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1661582817114-424d0f808f61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzJTIwYmVhdXR5JTIwc2Fsb258ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJ1c2luZXNzJTIwYmVhdXR5JTIwc2Fsb258ZW58MHx8MHx8fDA%3D",
        "https://plus.unsplash.com/premium_photo-1664049362603-902929fa6cbf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGJ1c2luZXNzJTIwYmVhdXR5JTIwc2Fsb258ZW58MHx8MHx8fDA%3D",
    ],
}

_CURATED_MAPPING_CACHE: Optional[Dict[str, Any]] = None


def _load_curated_mapping() -> Dict[str, Any]:
    """
    Load curated mapping from `scripts/curated-sector-images.json`.
    This makes curated sector imagery a single source of truth across scripts.
    """
    global _CURATED_MAPPING_CACHE
    if _CURATED_MAPPING_CACHE is not None:
        return _CURATED_MAPPING_CACHE
    if not CURATED_MAPPING_PATH.exists():
        _CURATED_MAPPING_CACHE = {}
        return _CURATED_MAPPING_CACHE
    try:
        data = json.loads(CURATED_MAPPING_PATH.read_text("utf-8"))
        _CURATED_MAPPING_CACHE = data if isinstance(data, dict) else {}
        return _CURATED_MAPPING_CACHE
    except Exception:
        _CURATED_MAPPING_CACHE = {}
        return _CURATED_MAPPING_CACHE


def _curated_urls_from_mapping(sector_slug: str) -> List[str]:
    mapping = _load_curated_mapping()
    cfg = mapping.get((sector_slug or "").strip())
    if not isinstance(cfg, dict):
        return []
    urls = cfg.get("useCaseImageUrls") or []
    if not isinstance(urls, list):
        return []
    out: List[str] = []
    for u in urls:
        if isinstance(u, str) and u.strip():
            out.append(u.strip())
    return out



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


def _parse_csv(path: Path) -> List[Dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        return [{k: (v or "") for k, v in row.items()} for row in reader]

def _load_state(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text("utf-8"))
    except Exception:
        return {}


def _save_state(path: Path, data: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True), "utf-8")


def _state_key(site_id: str, sector_slug: str, usecase_index: int) -> str:
    return f"{site_id}:{sector_slug}:{usecase_index}"


@dataclass(frozen=True)
class SectorKey:
    site_id: str
    sector_slug: str


def _extract_media_url(image_field: Any) -> Optional[str]:
    # Strapi v5 media: { url, formats: { large: { url } } }
    if isinstance(image_field, dict):
        u = (
            image_field.get("formats", {}).get("large", {}).get("url")
            or image_field.get("formats", {}).get("medium", {}).get("url")
            or image_field.get("formats", {}).get("small", {}).get("url")
            or image_field.get("url")
        )
        if isinstance(u, str) and u.strip():
            return u.strip()

        # Strapi v4 media: { data: { attributes: { url } } }
        v4 = image_field.get("data", {}).get("attributes", {}).get("url")
        if isinstance(v4, str) and v4.strip():
            return v4.strip()

    if isinstance(image_field, str) and image_field.strip():
        return image_field.strip()

    return None


def _build_exports_index(rows: List[Dict[str, str]]) -> Dict[Tuple[str, str, int], Dict[str, str]]:
    out: Dict[Tuple[str, str, int], Dict[str, str]] = {}
    for r in rows:
        site_id = (r.get("siteId") or "").strip()
        sector_slug = (r.get("sectorSlug") or "").strip()
        idx_raw = (r.get("useCaseIndex") or "").strip()
        if not site_id or not sector_slug or idx_raw == "":
            continue
        try:
            idx = int(idx_raw)
        except Exception:
            continue
        out[(site_id, sector_slug, idx)] = r
    return out


def _only_sectors() -> Optional[set[str]]:
    v = (os.getenv("ONLY_SECTORS") or "").strip()
    if not v:
        return None
    return {s.strip() for s in v.split(",") if s.strip()}


def _only_usecase_indexes() -> Optional[set[int]]:
    v = (os.getenv("ONLY_USECASE_INDEXES") or "").strip()
    if not v:
        return None
    out: set[int] = set()
    for part in v.split(","):
        p = part.strip()
        if not p:
            continue
        try:
            out.add(int(p))
        except Exception:
            continue
    return out or None


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
    timeout: int = 30,
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
            timeout=timeout,
        )
        if resp.headers.get("content-type", "").startswith("application/json"):
            return resp.status_code, resp.json()
        return resp.status_code, resp.text
    except Exception as e:
        return 0, {"error": str(e)}


def _strapi_get_sector_page(
    strapi_url: str, key: SectorKey
) -> Optional[Dict[str, Any]]:
    sp = urllib.parse.urlencode(
        {
            "filters[siteId][$eq]": key.site_id,
            "filters[sectorSlug][$eq]": key.sector_slug,
            "pagination[pageSize]": "1",
            "populate[useCases][populate]": "*",
        }
    )
    url = f"{strapi_url}/api/sector-pages?{sp}"
    # Read endpoints are typically public; avoid failing on invalid tokens.
    status, body = _strapi_req("GET", url, token=None)
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


def _build_dutch_query(sector_slug: str, use_case_title: str) -> str:
    """
    Prefer English queries for better Unsplash results, then bias to NL.
    """
    base_queries: Dict[str, str] = {
        "transport": "truck logistics warehouse distribution center",
        "zzp": "freelancer self-employed small business workspace",
        "bouw": "construction building site tools",
        "horeca": "restaurant kitchen hospitality",
        "retail": "retail store shop interior",
        "ecommerce": "ecommerce online shopping warehouse",
        "consultants": "business meeting office",
        "productie": "factory manufacturing production line",
        "zorg": "healthcare medical clinic",
        "automotive": "car repair garage workshop",
        "schoonmaak": "professional cleaning service office",
        "franchise": "franchise store retail shop interior small business",
        "groothandel": "warehouse wholesale distribution",
        "kasstroom": "small business office finance invoice accounting desk",
        "medisch": "medical clinic equipment healthcare",
        "tandarts": "dental clinic dentist office",
        "starters": "startup small business team workspace",
        "schoonheid": "beauty salon interior",
    }

    keyword_map: List[Tuple[str, str]] = [
        ("voorraad", "inventory warehouse"),
        ("bulkinkoop", "warehouse inventory pallets"),
        ("inkoop", "inventory procurement"),
        ("marketing", "marketing growth"),
        ("ads", "marketing analytics"),
        ("omnichannel", "retail ecommerce online"),
        ("platform", "ecommerce platform laptop"),
        ("conversie", "ecommerce conversion analytics"),
        ("software", "software laptop code"),
        ("it", "it laptop"),
        ("tooling", "software tools"),
        ("delivery", "software delivery team"),
        ("werkkapitaal", "cashflow finance"),
        ("kasstroom", "cashflow finance"),
        ("betalings", "invoice payments"),
        ("debiteuren", "invoice payments"),
        ("personeel", "team people"),
        ("opleiding", "training workshop"),
        ("certific", "training workshop"),
        ("machines", "machines manufacturing"),
        ("machinepark", "factory machinery"),
        ("apparatuur", "equipment"),
        ("renovatie", "renovation interior"),
        ("verbouwing", "renovation interior"),
        ("uitbreiding", "expansion growth"),
        ("overname", "business acquisition"),
        ("vloot", "fleet vehicles"),
        ("voertuig", "vehicles fleet"),
        ("logistiek", "warehouse logistics"),
        ("magazijn", "warehouse logistics"),
        ("keuken", "restaurant kitchen"),
        ("terras", "restaurant terrace"),
        ("salon", "beauty salon"),
        ("tandarts", "dental clinic"),
        ("medisch", "medical clinic"),
        ("zorg", "healthcare clinic"),
    ]

    # Narrow overrides for high-visibility sectors.
    overrides: Dict[str, Dict[str, str]] = {
        "transport": {
            # Make queries very literal to avoid "random industrial building" photos.
            "Vloot moderniseren of uitbreiden": "small business delivery van fleet Netherlands road logistics",
            "Logistieke technologie": "track and trace logistics software dashboard dispatcher Netherlands",
            "Werkkapitaal voor brandstof en onderhoud": "delivery van refueling fuel station Netherlands vehicle maintenance",
            "Opslag en faciliteiten": "small warehouse parcels packages shelving Netherlands logistics",
        },
        "zzp": {
            "Tools en apparatuur": "laptop desk tools workspace Netherlands",
            "Buffer tussen opdrachten": "freelancer planning desk workspace Netherlands",
            "Opleiding en certificering": "professional training workshop Netherlands",
            "Werkruimte en professionele setup": "home office workspace Netherlands",
        },
        "consultants": {
            "Specialisten aannemen of opleiden": "business training workshop office Netherlands",
            "Sales en marketing opschalen": "marketing team meeting strategy Netherlands",
            "Tooling en delivery-software": "software team laptop office Netherlands",
            "Buffer tussen projecten": "business finance planning desk Netherlands",
        },
        "kasstroom": {
            # This use-case is very "inventory" oriented; finance keywords can kill relevance.
            "Voorraad en inkoopmomenten": "warehouse inventory pallets procurement Netherlands",
        },
        "tandarts": {
            "Behandelstoelen en apparatuur": "dental clinic chair equipment Netherlands",
            "Praktijkverbouwing": "dental clinic renovation interior Netherlands",
            "IT en digitalisering": "dental clinic computer software Netherlands",
            "Uitbreiding en groei": "dental clinic team expansion Netherlands",
        },
    }

    title = (use_case_title or "").strip()
    if sector_slug in overrides and title in overrides[sector_slug]:
        q = overrides[sector_slug][title]
    else:
        q = base_queries.get(sector_slug, sector_slug)
        # Add a few English hints derived from the Dutch title (kept generic).
        t = title.lower()
        hints: List[str] = []
        for needle, add in keyword_map:
            if needle in t:
                hints.append(add)
        if hints:
            # Limit to keep queries short.
            uniq: List[str] = []
            for h in hints:
                if h not in uniq:
                    uniq.append(h)
            q = f"{q} {' '.join(uniq[:3])}"

    # Always bias to NL to avoid obviously non-Dutch imagery.
    if "netherlands" not in q.lower():
        q = f"{q} Netherlands"
    return q.strip()


def _build_long_tail_query_from_exports(sector_slug: str, title: str, description: str) -> str:
    """
    Build a longer-tail (more specific) query from exports copy.
    Keep it English-ish for Unsplash search quality, but NL-biased.
    """
    base = _build_dutch_query(sector_slug, title)
    d = (description or "").lower()

    extra: List[str] = []
    if "wms" in d or "tms" in d or "route" in d or "track" in d:
        extra.append("logistics software")
    if "vracht" in d or "truck" in d or "bestelb" in d:
        extra.append("truck")
    if "magaz" in d or "warehouse" in d or "opslag" in d:
        extra.append("warehouse")
    if "brandstof" in d or "onderhoud" in d or "repar" in d:
        extra.append("maintenance")
    if "tandarts" in d or "dental" in d:
        extra.append("dental clinic")
    if "behandel" in d or "stoel" in d:
        extra.append("dental chair")
    if "voorraad" in d:
        extra.append("inventory")
    if "salon" in d:
        extra.append("beauty salon")
    if "kassa" in d or "checkout" in d:
        extra.append("checkout")

    uniq: List[str] = []
    for e in extra:
        if e not in uniq:
            uniq.append(e)

    if uniq:
        return f"{base} {' '.join(uniq[:3])}".strip()
    return base


def _unsplash_search_pick(
    access_key: str,
    query: str,
    *,
    used_photo_ids: set[str],
    prefer_terms: Optional[List[str]] = None,
    reject_terms: Optional[List[str]] = None,
    per_page: int = 12,
    order_by: str = "relevant",
    orientation: str = "landscape",
) -> Optional[Dict[str, Any]]:
    # Use Unsplash API directly so we can enforce content_filter=high (better quality).
    # The repo skill scripts default to content_filter=low, which is not ideal for paid usage.
    app_id = (os.getenv("UNSPLASH_APP_ID") or "").strip()
    headers = {
        "Authorization": f"Client-ID {access_key}",
        "Accept-Version": "v1",
        # Optional; helps Unsplash identify the app.
        "User-Agent": f"GeldGeregeld/{app_id}" if app_id else "GeldGeregeld",
    }
    params = {
        "query": query,
        "page": 1,
        "per_page": max(1, min(int(per_page), 30)),
        "order_by": order_by,
        "orientation": orientation,
        "content_filter": "high",
    }

    r = requests.get(f"{UNSPLASH_API_BASE}/search/photos", headers=headers, params=params, timeout=25)
    if r.status_code == 403 and "Rate Limit Exceeded" in (r.text or ""):
        raise RuntimeError("UNSPLASH_RATE_LIMIT")
    if r.status_code == 401:
        raise RuntimeError("UNSPLASH_INVALID_KEY")
    if not r.ok:
        raise RuntimeError(f"Unsplash search failed ({r.status_code}): {(r.text or '')[:120]}")

    data = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
    results = data.get("results") or []
    if not isinstance(results, list) or not results:
        return None

    prefer_terms = [t.strip().lower() for t in (prefer_terms or []) if t and t.strip()]
    reject_terms = [t.strip().lower() for t in (reject_terms or []) if t and t.strip()]

    # Prefer unused, high-res photos.
    def score(p: Dict[str, Any]) -> int:
        w = int(p.get("width") or 0)
        h = int(p.get("height") or 0)
        likes = int(p.get("likes") or 0)
        has_alt = 1 if p.get("alt_description") else 0
        text = " ".join(
            [
                str(p.get("slug") or ""),
                str(p.get("alt_description") or ""),
                str(p.get("description") or ""),
            ]
        ).lower()

        # Hard reject certain themes (ports/containers etc).
        for bad in reject_terms:
            if bad and bad in text:
                return -10_000

        prefer_hits = 0
        for good in prefer_terms:
            if good and good in text:
                prefer_hits += 1

        # Rough heuristic: prioritize size and a bit of social proof.
        return (
            (min(w, 6000) // 100)
            + (min(h, 6000) // 100)
            + min(likes, 500)
            + (has_alt * 25)
            + (prefer_hits * 120)
        )

    # Sort by heuristic score descending.
    ranked = sorted([p for p in results if isinstance(p, dict)], key=score, reverse=True)

    for p in ranked:
        pid = str(p.get("id") or "").strip()
        if not pid or pid in used_photo_ids:
            continue
        # Skip tiny images.
        if int(p.get("width") or 0) < 1600:
            continue
        used_photo_ids.add(pid)
        return p

    # Fallback to the first result.
    p0 = ranked[0]
    pid0 = str(p0.get("id") or "").strip()
    if pid0:
        used_photo_ids.add(pid0)
    return p0


def _unsplash_track_download(access_key: str, photo_id: str) -> None:
    if not photo_id:
        return
    app_id = (os.getenv("UNSPLASH_APP_ID") or "").strip()
    headers = {
        "Authorization": f"Client-ID {access_key}",
        "Accept-Version": "v1",
        "User-Agent": f"GeldGeregeld/{app_id}" if app_id else "GeldGeregeld",
    }
    try:
        # This is the official download tracking endpoint.
        requests.get(f"{UNSPLASH_API_BASE}/photos/{photo_id}/download", headers=headers, timeout=20)
    except Exception:
        # Non-critical
        return


def _curated_urls_for_sector(sector_slug: str) -> List[str]:
    # Prefer curated URLs from `scripts/curated-sector-images.json` (if present).
    from_file = _curated_urls_from_mapping(sector_slug)
    if from_file:
        return from_file
    urls = CURATED_SECTOR_IMAGE_URLS.get((sector_slug or "").strip(), [])
    return [u for u in urls if isinstance(u, str) and u.strip()]


def _curated_key_from_url(url: str) -> str:
    """
    Make a stable short key from a remote URL, so we can reuse uploads and
    avoid duplicates across reruns.
    """
    try:
        parsed = urllib.parse.urlparse(url)
        base = (parsed.path or "").rstrip("/").split("/")[-1] or "image"
    except Exception:
        base = "image"
    base = re.sub(r"[^a-zA-Z0-9_-]+", "_", base).strip("_")
    return (base or "image")[:80]


def _download_bytes_and_mime(url: str) -> Tuple[bytes, str]:
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    ct = (resp.headers.get("content-type") or "").split(";")[0].strip().lower()
    if not ct.startswith("image/"):
        ct = "image/jpeg"
    return resp.content, ct


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
    headers = {"Authorization": f"Bearer {token}"}
    files = {"files": (filename, content, mime)}
    data = {
        "name": filename,
        "alternativeText": alternative_text,
        "caption": caption,
    }
    resp = requests.post(f"{strapi_url}/api/upload", headers=headers, files=files, data=data, timeout=60)
    if resp.status_code not in (200, 201):
        return None
    try:
        payload = resp.json()
    except Exception:
        return None
    if isinstance(payload, list) and payload:
        return int(payload[0].get("id"))
    if isinstance(payload, dict) and payload.get("id") is not None:
        return int(payload["id"])
    return None


def _extract_media_id(image_field: Any) -> Optional[int]:
    """
    Strapi may return media as:
    - int (id)
    - { id: 123, ... }
    - { data: { id: 123, attributes: ... } }
    """
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
    """
    Strapi repeatable component update:
    - Do NOT send component instance `id` (Strapi v5 rejects it with "Invalid key id").
    - Send only schema fields + media relation id.
    """
    out: Dict[str, Any] = {}
    for k in ("title", "description", "iconPath", "color", "textColor", "buttonLabel", "buttonHref"):
        v = uc.get(k)
        if v is None:
            continue
        if isinstance(v, str) and not v.strip():
            continue
        out[k] = v

    # Keep default link stable if missing/null.
    if not out.get("buttonHref"):
        out["buttonHref"] = "/lead"

    if image_id is not None:
        out["image"] = int(image_id)
    return out


def _find_existing_upload_id_by_name(strapi_url: str, token: str, filename: str) -> Optional[int]:
    """
    Reuse already uploaded files to prevent duplicates.
    Strapi upload plugin endpoint often supports filters.
    """
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


def _parse_access_keys() -> List[str]:
    """
    Supports:
    - UNSPLASH_ACCESS_KEYS="k1,k2,k3"
    - UNSPLASH_ACCESS_KEY="k1" (fallback)
    """
    keys_raw = (os.getenv("UNSPLASH_ACCESS_KEYS") or "").strip()
    keys: List[str] = []
    if keys_raw:
        for part in keys_raw.split(","):
            k = part.strip()
            if k:
                keys.append(k)
    else:
        k = (os.getenv("UNSPLASH_ACCESS_KEY") or "").strip()
        if k:
            keys.append(k)
    # Deduplicate while preserving order
    seen: set[str] = set()
    out: List[str] = []
    for k in keys:
        if k in seen:
            continue
        seen.add(k)
        out.append(k)
    return out


def _unsplash_get_with_key(
    access_key: str,
    endpoint: str,
    *,
    params: Dict[str, Any],
    timeout: int = 25,
) -> requests.Response:
    app_id = (os.getenv("UNSPLASH_APP_ID") or "").strip()
    headers = {
        "Authorization": f"Client-ID {access_key}",
        "Accept-Version": "v1",
        "User-Agent": f"GeldGeregeld/{app_id}" if app_id else "GeldGeregeld",
    }
    return requests.get(f"{UNSPLASH_API_BASE}{endpoint}", headers=headers, params=params, timeout=timeout)


def _unsplash_search_pick_any_key(
    access_keys: List[str],
    query: str,
    *,
    used_photo_ids: set[str],
    prefer_terms: Optional[List[str]] = None,
    reject_terms: Optional[List[str]] = None,
    per_page: int = 12,
    order_by: str = "relevant",
    orientation: str = "landscape",
) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Try each key until one succeeds (skips invalid or exhausted keys).
    Returns: (photo, key_used)
    """
    last_invalid = False
    for k in access_keys:
        try:
            # Probe remaining quota cheaply by reading headers from a real search call.
            # If this key is exhausted, Unsplash returns 403.
            photo = _unsplash_search_pick(
                k,
                query,
                used_photo_ids=used_photo_ids,
                prefer_terms=prefer_terms,
                reject_terms=reject_terms,
                per_page=per_page,
                order_by=order_by,
                orientation=orientation,
            )
            if photo:
                return photo, k
            # No results is not an auth issue; stop here.
            return None, k
        except RuntimeError as e:
            if str(e) == "UNSPLASH_INVALID_KEY":
                last_invalid = True
                continue
            if str(e) == "UNSPLASH_RATE_LIMIT":
                continue
            # Other errors: bubble up
            raise
    # If all keys invalid/exhausted, surface rate-limit as the controlling factor.
    if last_invalid:
        raise RuntimeError("UNSPLASH_ALL_KEYS_INVALID")
    raise RuntimeError("UNSPLASH_RATE_LIMIT")


def main() -> int:
    if not EXPORTS_UC.exists():
        print(f"Missing export: {EXPORTS_UC}", file=sys.stderr)
        return 1

    env = _load_env_file(ENV_PATH)
    strapi_url = (env.get("NEXT_PUBLIC_STRAPI_URL") or env.get("STRAPI_URL") or "").rstrip("/")
    token = (os.getenv("STRAPI_API_TOKEN") or os.getenv("STRAPI_TOKEN") or env.get("STRAPI_API_TOKEN") or env.get("STRAPI_TOKEN") or "").strip()
    access_keys = _parse_access_keys()
    use_curated = _bool_env("USE_CURATED_URLS", False)
    if os.getenv("UNSPLASH_APP_ID"):
        # Allow passing paid app id without writing to disk.
        os.environ["UNSPLASH_APP_ID"] = str(os.getenv("UNSPLASH_APP_ID"))

    if not strapi_url or not token:
        print("Missing NEXT_PUBLIC_STRAPI_URL/STRAPI_URL or STRAPI_API_TOKEN/STRAPI_TOKEN.", file=sys.stderr)
        print("Tip: you can also pass STRAPI_API_TOKEN via environment for a one-off run.", file=sys.stderr)
        return 2
    # Unsplash keys are only required when we are doing Unsplash SEARCH.
    # When USE_CURATED_URLS=1 and you restrict processing to curated sectors, keys can be omitted.
    if not access_keys:
        only_probe = _only_sectors()
        if not use_curated:
            print("Missing UNSPLASH_ACCESS_KEY(S). Set UNSPLASH_ACCESS_KEYS or UNSPLASH_ACCESS_KEY.", file=sys.stderr)
            return 3
        if not only_probe:
            print("Missing UNSPLASH_ACCESS_KEY(S) and ONLY_SECTORS not set.", file=sys.stderr)
            print("Set ONLY_SECTORS to curated sectors or provide UNSPLASH_ACCESS_KEY(S).", file=sys.stderr)
            return 3
        missing = [s for s in sorted(only_probe) if not _curated_urls_for_sector(s)]
        if missing:
            print("Missing UNSPLASH_ACCESS_KEY(S) and some ONLY_SECTORS have no curated URLs:", file=sys.stderr)
            print(", ".join(missing), file=sys.stderr)
            return 3

    only = _only_sectors()
    only_uc_indexes = _only_usecase_indexes()
    force = _bool_env("FORCE", False)
    dry_run = _bool_env("DRY_RUN", False)
    skip_processed = _bool_env("SKIP_PROCESSED", True)
    state_path = Path(os.getenv("STATE_PATH") or str(DEFAULT_STATE_PATH))
    state = _load_state(state_path) if not dry_run else {}
    processed: Dict[str, Any] = state.get("processed", {}) if isinstance(state.get("processed"), dict) else {}
    state.setdefault("processed", processed)
    state.setdefault("updatedAt", "")

    if not dry_run:
        # Try to validate token early. Some tokens may allow POST /api/upload but not
        # GET /api/upload/files; that's OK (we'll just skip dedupe and upload new files).
        status, _ = _strapi_req("GET", f"{strapi_url}/api/upload/files?pagination[limit]=1", token)
        if status in (401, 403):
            print("⚠️  Token cannot read /api/upload/files; proceeding without upload dedupe.", file=sys.stderr)
        elif status == 0:
            print("⚠️  Could not reach Strapi upload/files endpoint; proceeding.", file=sys.stderr)

    use_cases_rows = _parse_csv(EXPORTS_UC)
    exports_index = _build_exports_index(use_cases_rows)
    keys: List[SectorKey] = []
    seen: set[SectorKey] = set()
    for r in use_cases_rows:
        key = SectorKey(site_id=(r.get("siteId") or "").strip(), sector_slug=(r.get("sectorSlug") or "").strip())
        if not key.site_id or not key.sector_slug:
            continue
        if only and key.sector_slug not in only:
            continue
        if key not in seen:
            seen.add(key)
            keys.append(key)

    if not keys:
        print("No sectors found to process (check ONLY_SECTORS).", file=sys.stderr)
        return 0

    print(f"Strapi: {strapi_url}")
    print(f"Sectors to process: {', '.join([k.sector_slug for k in keys])}")
    if dry_run:
        print("DRY_RUN=1 (no uploads/updates)")

    ok_uc = 0
    skip_uc = 0
    fail_uc = 0
    hit_rate_limit = False

    for key in keys:
        if hit_rate_limit:
            print("⚠️  Stopping early due to Unsplash demo rate limit.")
            break

        entry = _strapi_get_sector_page(strapi_url, key)
        if not entry:
            print(f"❌ sector-page not found: {key.site_id}/{key.sector_slug}")
            continue

        update_id = _extract_update_id(entry)
        if not update_id:
            print(f"❌ Could not extract update id for: {key.site_id}/{key.sector_slug}")
            continue

        attrs = entry.get("attributes") or entry
        use_cases = attrs.get("useCases") or []
        if not isinstance(use_cases, list) or not use_cases:
            print(f"⚠️  No use cases in Strapi for: {key.sector_slug}")
            continue

        used_photo_ids: set[str] = set()
        updated_use_cases: List[Dict[str, Any]] = []

        existing_urls: List[str] = []
        for uc in use_cases:
            if isinstance(uc, dict):
                u = _extract_media_url(uc.get("image"))
                if u:
                    existing_urls.append(u)
        duplicates: set[str] = set([u for u in existing_urls if existing_urls.count(u) > 1])
        first_seen: set[str] = set()

        for idx, uc in enumerate(use_cases):
            if not isinstance(uc, dict):
                updated_use_cases.append(uc)
                continue
            if only_uc_indexes is not None and idx not in only_uc_indexes:
                # Keep existing value for untouched items.
                existing_image_id = _extract_media_id(uc.get("image"))
                updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                skip_uc += 1
                continue

            title = (uc.get("title") or "").strip()
            export_row = exports_index.get((key.site_id, key.sector_slug, idx)) or {}
            export_desc = (export_row.get("useCaseDescription") or "").strip()
            existing_image_id = _extract_media_id(uc.get("image"))
            existing_url = _extract_media_url(uc.get("image"))

            skey = _state_key(key.site_id, key.sector_slug, idx)
            if skip_processed and skey in processed and not force:
                # Skip items that were already processed in a previous run,
                # unless FORCE=1 is explicitly set to overwrite.
                updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                skip_uc += 1
                continue
            should_replace_duplicate = False
            if existing_url and existing_url in duplicates:
                if existing_url in first_seen:
                    should_replace_duplicate = True
                else:
                    first_seen.add(existing_url)

            if existing_image_id and not force and not should_replace_duplicate:
                updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                skip_uc += 1
                continue

            curated_urls = _curated_urls_for_sector(key.sector_slug) if use_curated else []
            if curated_urls:
                # Deterministic pick: cycle through curated list by index.
                curated_url = curated_urls[idx % len(curated_urls)]
                curated_key = _curated_key_from_url(curated_url)

                if dry_run:
                    upload_id = 0
                else:
                    fname = f"sector-uc_curated_{key.site_id}_{key.sector_slug}_{curated_key}.jpg"
                    alt = f"{title} ({key.sector_slug})"
                    caption = "Curated image (Unsplash)"

                    existing_upload_id = _find_existing_upload_id_by_name(strapi_url, token, fname)
                    if existing_upload_id:
                        upload_id = existing_upload_id
                    else:
                        img_bytes, mime = _download_bytes_and_mime(curated_url)
                        upload_id = _upload_to_strapi(
                            strapi_url,
                            token,
                            filename=fname,
                            content=img_bytes,
                            mime=mime,
                            alternative_text=alt,
                            caption=caption,
                        )

                    if not upload_id:
                        print(f"  ❌ Upload failed for {key.sector_slug}[{idx}] '{title}' (curated)")
                        updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                        fail_uc += 1
                        continue

                updated_use_cases.append(_clean_use_case_for_update(uc, None if dry_run else int(upload_id)))
                ok_uc += 1
                print(f"  ✅ {key.sector_slug}[{idx}] '{title}' -> curated '{curated_key}'")

                if not dry_run:
                    processed[skey] = {
                        "photoId": f"curated:{curated_key}",
                        "query": curated_url,
                        "imageId": int(upload_id),
                        "title": title,
                        "updatedAt": int(time.time()),
                    }
                    state["updatedAt"] = int(time.time())
                    _save_state(state_path, state)

                time.sleep(0.15)
                continue

            query = _build_long_tail_query_from_exports(key.sector_slug, title, export_desc)
            # Add a small per-usecase hint so searches diversify.
            query = f"{query} concept-{idx + 1}".strip()
            try:
                photo = None
                # SME / last-mile bias filters (especially important for transport).
                prefer_terms: List[str] = []
                reject_terms: List[str] = []
                if key.sector_slug == "transport":
                    reject_terms = [
                        "container",
                        "containers",
                        "port",
                        "harbor",
                        "harbour",
                        "cargo ship",
                        "ship",
                        "crane",
                        "terminal",
                        "seaport",
                        "freight train",
                    ]
                    t = title.lower()
                    if "vloot" in t or "uitbreid" in t:
                        prefer_terms = ["van", "delivery", "courier", "fleet", "last mile"]
                    elif "technologie" in t:
                        prefer_terms = ["dashboard", "tablet", "scanner", "software", "tracking", "logistics"]
                    elif "brandstof" in t or "onderhoud" in t:
                        prefer_terms = ["fuel", "refuel", "gas station", "maintenance", "garage", "mechanic", "service"]
                    elif "opslag" in t or "faciliteiten" in t:
                        prefer_terms = ["warehouse", "packages", "parcels", "boxes", "forklift", "shelving"]

                for attempt_q in [
                    query,
                    # Try without our extra hint, but keep NL bias.
                    _build_long_tail_query_from_exports(key.sector_slug, title, export_desc),
                    # Fall back to sector defaults.
                    _build_dutch_query(key.sector_slug, title),
                ]:
                    photo, key_used = _unsplash_search_pick_any_key(
                        access_keys,
                        attempt_q,
                        used_photo_ids=used_photo_ids,
                        prefer_terms=prefer_terms,
                        reject_terms=reject_terms,
                        per_page=18,
                        order_by="relevant",
                        orientation="landscape",
                    )
                    if photo:
                        break
                if not photo:
                    print(f"  ⚠️  No Unsplash results for {key.sector_slug}[{idx}] '{title}' (query='{query}')")
                    updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                    fail_uc += 1
                    continue

                photo_id = str(photo.get("id") or "").strip()
                image_url = (
                    (photo.get("urls") or {}).get("regular")
                    or (photo.get("urls") or {}).get("full")
                    or ""
                )
                if not image_url:
                    updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                    fail_uc += 1
                    continue

                # Download and track
                if dry_run:
                    upload_id = 0
                else:
                    # Include photo_id so reruns can swap images even when idx/title is the same.
                    fname = f"sector-uc_{key.site_id}_{key.sector_slug}_{idx}_{_slugify(title)}_{photo_id}.jpg"
                    alt = f"{title} ({key.sector_slug})"
                    caption = str(photo.get("attribution_text") or "").strip() or "Photo on Unsplash"

                    # Reuse existing upload by filename when possible.
                    existing_upload_id = _find_existing_upload_id_by_name(strapi_url, token, fname)
                    if existing_upload_id:
                        upload_id = existing_upload_id
                    else:
                        img_bytes, mime = _download_bytes_and_mime(image_url)
                        _unsplash_track_download(key_used or access_keys[0], photo_id)
                        upload_id = _upload_to_strapi(
                            strapi_url,
                            token,
                            filename=fname,
                            content=img_bytes,
                            mime=mime,
                            alternative_text=alt,
                            caption=caption,
                        )

                    if not upload_id:
                        print(f"  ❌ Upload failed for {key.sector_slug}[{idx}] '{title}'")
                        updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                        fail_uc += 1
                        continue

                updated_use_cases.append(_clean_use_case_for_update(uc, None if dry_run else int(upload_id)))
                ok_uc += 1
                print(f"  ✅ {key.sector_slug}[{idx}] '{title}' -> Unsplash '{photo_id}'")

                if not dry_run:
                    processed[skey] = {
                        "photoId": photo_id,
                        "query": query,
                        "imageId": int(upload_id),
                        "title": title,
                        "updatedAt": int(time.time()),
                    }
                    state["updatedAt"] = int(time.time())
                    _save_state(state_path, state)

                time.sleep(0.25)
            except Exception as e:
                if str(e) == "UNSPLASH_RATE_LIMIT":
                    print("  ❌ Unsplash rate limit exceeded (demo mode).")
                    hit_rate_limit = True
                else:
                    print(f"  ❌ {key.sector_slug}[{idx}] '{title}': {str(e)[:200]}")
                updated_use_cases.append(_clean_use_case_for_update(uc, existing_image_id))
                fail_uc += 1
                time.sleep(0.25)

        if dry_run:
            continue

        # Update only the useCases field to minimize side effects.
        url = f"{strapi_url}/api/sector-pages/{update_id}"
        status, body = _strapi_req("PUT", url, token, json_payload={"data": {"useCases": updated_use_cases}})
        if status not in (200, 201):
            msg = ""
            if isinstance(body, dict):
                msg = body.get("error", {}).get("message") or ""
            print(f"❌ Failed updating sector-page {key.sector_slug}: HTTP {status} {msg}".strip())
        else:
            print(f"✅ Updated sector-page useCases: {key.sector_slug}")

        time.sleep(0.35)

    print(f"Done. OK={ok_uc} SKIP={skip_uc} FAIL={fail_uc}")
    if hit_rate_limit:
        return 3
    return 0 if fail_uc == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())

