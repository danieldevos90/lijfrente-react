import argparse
import csv
import os
import time
import urllib.parse
from collections import defaultdict
from typing import Dict, Iterable, List, Tuple

from pytrends.request import TrendReq


def read_serp_results(path: str) -> Dict[str, List[str]]:
    """Read serp_results.csv and return mapping: keyword -> list of top result URLs (in order).

    Expects columns: keyword,rank,title,url
    Only uses rank 1..10 entries per keyword.
    """
    kw_to_urls: Dict[str, List[str]] = defaultdict(list)
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            kw = row.get("keyword", "").strip()
            rank = row.get("rank", "").strip()
            url = row.get("url", "").strip()
            if not kw or not url:
                continue
            # Only take numeric ranks (skip ERR rows)
            if not rank.isdigit():
                continue
            if int(rank) > 10:
                continue
            kw_to_urls[kw].append(url)
    return kw_to_urls


def extract_domain(url: str) -> str:
    try:
        netloc = urllib.parse.urlparse(url).netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc
    except Exception:
        return ""


# Heuristic domain sets for competition scoring (NL focus)
GOV_DOMAINS = {
    "rijksoverheid.nl",
    "overheid.nl",
    "belastingdienst.nl",
    "kvk.nl",
    "europa.eu",
}

BANK_DOMAINS = {
    "rabobank.nl",
    "ing.nl",
    "abnamro.nl",
    "knab.nl",
    "snsbank.nl",
    "triodos.nl",
    "bunq.com",
    "new10.com",
}

WIKI_DOMAINS = {
    "wikipedia.org",
}

# NL SME financing vertical (strong commercial intent)
VERTICAL_STRONG = {
    "floryn.com",
    "qeld.nl",
    "capitalbox.nl",
    "swishfund.nl",
    "qredits.nl",
    "credion.eu",
    "boekhouder.nl",
    "investeerders.nl",
}


def compute_serp_competition(urls: Iterable[str]) -> Tuple[float, float, float]:
    """Compute a simple SERP competition proxy from top result URLs.

    Returns tuple:
    - serp_competition_score_0_100: weighted difficulty (0..100)
    - strong_domain_share: fraction of GOV/BANK/WIKI among top results (0..1)
    - vertical_competitor_share: fraction of known vertical competitors (0..1)
    """
    domains = [extract_domain(u) for u in urls]
    total = max(len(domains), 1)

    strong = 0
    vertical = 0
    score = 0.0
    for d in domains:
        if not d:
            continue
        if d in GOV_DOMAINS or d in BANK_DOMAINS or d in WIKI_DOMAINS:
            strong += 1
            score += 1.0  # strong authority
        elif d in VERTICAL_STRONG:
            vertical += 1
            score += 0.8  # strong vertical player
        elif d.endswith(".gov") or d.endswith(".edu") or d.endswith(".eu"):
            strong += 1
            score += 0.9
        else:
            score += 0.3  # generic/other

    strong_share = strong / total
    vertical_share = vertical / total
    # Normalize to 0..100
    competition_score = round((score / (total * 1.0)) * 100)
    return competition_score, strong_share, vertical_share


def build_trends_client() -> TrendReq:
    # NL locale, timezone CET/CEST (UTC+1 winter, +2 summer => use +1 hour offset 360 min)
    return TrendReq(hl="nl-NL", tz=360, retries=2, backoff_factor=0.2, timeout=(5, 20))


def get_trends_volume_index(
    pytrends: TrendReq,
    keyword: str,
    geo: str = "NL",
    timeframe: str = "today 12-m",
) -> float:
    """Return 12m average interest (0..100) for the keyword in NL.

    This is a relative index (not absolute search volume) but tracks demand well.
    """
    try:
        pytrends.build_payload([keyword], cat=0, timeframe=timeframe, geo=geo, gprop="")
        df = pytrends.interest_over_time()
        if df is None or df.empty:
            return 0.0
        # Column is the keyword
        series = df[keyword]
        # Drop trailing partial week if present
        series = series[:-1] if len(series) > 1 else series
        val = float(series.mean()) if len(series) else 0.0
        return round(val, 2)
    except Exception:
        return 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--serp_csv",
        default="_scraped_sites/trafilatura/_analysis/serp/serp_results.csv",
        help="Path to serp_results.csv",
    )
    ap.add_argument(
        "--out_csv",
        default="_scraped_sites/trafilatura/_analysis/serp/keyword_metrics_trends_serp.csv",
        help="Output CSV with volume index and competition proxy",
    )
    ap.add_argument(
        "--timeframe",
        default="today 12-m",
        help="Google Trends timeframe, e.g. 'today 5-y', 'today 12-m'",
    )
    ap.add_argument("--sleep", type=float, default=0.3, help="Sleep seconds between Trends queries")
    args = ap.parse_args()

    if not os.path.exists(args.serp_csv):
        raise SystemExit(f"Input not found: {args.serp_csv}")

    kw_to_urls = read_serp_results(args.serp_csv)

    pytrends = build_trends_client()

    rows: List[List[object]] = []
    for idx, (kw, urls) in enumerate(kw_to_urls.items(), start=1):
        vol_idx = get_trends_volume_index(pytrends, kw, geo="NL", timeframe=args.timeframe)
        comp_score, strong_share, vertical_share = compute_serp_competition(urls)
        rows.append([
            kw,
            vol_idx,
            comp_score,
            round(strong_share, 3),
            round(vertical_share, 3),
        ])
        if args.sleep > 0:
            time.sleep(args.sleep)

    os.makedirs(os.path.dirname(args.out_csv), exist_ok=True)
    with open(args.out_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "keyword",
            "trends_volume_index_12m",
            "serp_competition_score_0_100",
            "strong_domain_share",
            "vertical_competitor_share",
        ])
        for r in rows:
            w.writerow(r)

    print(f"saved {len(rows)} rows -> {args.out_csv}")


if __name__ == "__main__":
    main()


