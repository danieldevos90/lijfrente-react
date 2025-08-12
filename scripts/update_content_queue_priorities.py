#!/usr/bin/env python3
import csv
import sys
import os
from dataclasses import dataclass
from typing import Dict, Optional
from datetime import datetime


@dataclass
class KeywordMetrics:
    volume_index_5y: float
    serp_competition_score: float
    strong_domain_share: Optional[float] = None
    vertical_competitor_share: Optional[float] = None


def normalize_keyword(keyword: str) -> str:
    return (keyword or "").strip().lower()


def safe_float(value: Optional[str], default: float = 0.0) -> float:
    try:
        return float(value)
    except Exception:
        return default


def load_metrics_csv(metrics_csv_path: str) -> Dict[str, KeywordMetrics]:
    metrics_by_keyword: Dict[str, KeywordMetrics] = {}
    with open(metrics_csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            kw = normalize_keyword(row.get("keyword", ""))
            if not kw:
                continue
            metrics_by_keyword[kw] = KeywordMetrics(
                volume_index_5y=safe_float(row.get("trends_volume_index_12m")),
                serp_competition_score=safe_float(row.get("serp_competition_score_0_100")),
                strong_domain_share=safe_float(row.get("strong_domain_share"), None),
                vertical_competitor_share=safe_float(row.get("vertical_competitor_share"), None),
            )
    return metrics_by_keyword


def compute_priority(volume_index_5y: float, serp_competition_score: float) -> int:
    # Normalize to 0..1
    volume_norm = max(0.0, min(1.0, volume_index_5y / 100.0))
    # Lower competition is better -> invert
    competition_inverted = max(0.0, min(1.0, (100.0 - serp_competition_score) / 100.0))
    # Weighted blend: 70% volume, 30% (inverted) competition
    blended = 0.7 * volume_norm + 0.3 * competition_inverted
    # Map to 0..4 and round to nearest integer
    score = int(round(blended * 4.0))
    return max(0, min(4, score))


def backup_file(path: str) -> str:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    base, ext = os.path.splitext(path)
    backup_path = f"{base}.backup_{ts}{ext}"
    with open(path, "rb") as src, open(backup_path, "wb") as dst:
        dst.write(src.read())
    return backup_path


def update_content_queue(
    queue_csv_path: str,
    metrics_csv_path: str,
    enriched_output_path: Optional[str] = None,
) -> None:
    metrics_by_keyword = load_metrics_csv(metrics_csv_path)

    # Backup original queue
    backup_path = backup_file(queue_csv_path)

    updated_rows = []
    enriched_rows = []
    updated_count = 0
    total_count = 0

    with open(backup_path, newline="", encoding="utf-8") as fin:
        reader = csv.DictReader(fin)
        fieldnames = reader.fieldnames or ["hub", "keyword", "priority_score"]
        for row in reader:
            total_count += 1
            hub = row.get("hub", "").strip()
            keyword = row.get("keyword", "").strip()
            old_priority = row.get("priority_score", "")

            kw_norm = normalize_keyword(keyword)
            metrics = metrics_by_keyword.get(kw_norm)

            if metrics is not None:
                new_priority = compute_priority(metrics.volume_index_5y, metrics.serp_competition_score)
                updated_count += 1
            else:
                # Fallback to previous value if no metrics found
                try:
                    new_priority = int(round(float(old_priority))) if old_priority != "" else 0
                except Exception:
                    new_priority = 0

            updated_rows.append({
                "hub": hub,
                "keyword": keyword,
                "priority_score": new_priority,
            })

            # Enriched optional output
            if enriched_output_path is not None:
                enriched_rows.append({
                    "hub": hub,
                    "keyword": keyword,
                    "old_priority_score": old_priority,
                    "new_priority_score": new_priority,
                    "trends_volume_index_5y": metrics.volume_index_5y if metrics else "",
                    "serp_competition_score_0_100": metrics.serp_competition_score if metrics else "",
                    "strong_domain_share": metrics.strong_domain_share if metrics else "",
                    "vertical_competitor_share": metrics.vertical_competitor_share if metrics else "",
                })

    # Write updated queue back to original path
    with open(queue_csv_path, "w", newline="", encoding="utf-8") as fout:
        writer = csv.DictWriter(fout, fieldnames=["hub", "keyword", "priority_score"])
        writer.writeheader()
        writer.writerows(updated_rows)

    # Optionally write enriched output
    if enriched_output_path is not None:
        with open(enriched_output_path, "w", newline="", encoding="utf-8") as f_en:
            writer = csv.DictWriter(
                f_en,
                fieldnames=[
                    "hub",
                    "keyword",
                    "old_priority_score",
                    "new_priority_score",
                    "trends_volume_index_5y",
                    "serp_competition_score_0_100",
                    "strong_domain_share",
                    "vertical_competitor_share",
                ],
            )
            writer.writeheader()
            writer.writerows(enriched_rows)

    print(
        f"Updated {updated_count}/{total_count} rows using metrics; backup saved to {backup_path}"
    )


def main(argv: list[str]) -> int:
    import argparse

    ap = argparse.ArgumentParser(description="Update content_queue.csv based on 5y metrics")
    ap.add_argument(
        "--queue_csv",
        default="_scraped_sites/trafilatura/_analysis/serp/content_queue.csv",
        help="Path to content_queue.csv",
    )
    ap.add_argument(
        "--metrics_csv",
        default="_scraped_sites/trafilatura/_analysis/serp/keyword_metrics_trends_serp_5y.csv",
        help="Path to 5-year metrics CSV",
    )
    ap.add_argument(
        "--enriched_out",
        default="_scraped_sites/trafilatura/_analysis/serp/content_queue_enriched_5y.csv",
        help="Optional enriched output CSV with extra columns",
    )
    args = ap.parse_args(argv)

    os.makedirs(os.path.dirname(args.queue_csv), exist_ok=True)
    update_content_queue(
        queue_csv_path=args.queue_csv,
        metrics_csv_path=args.metrics_csv,
        enriched_output_path=args.enriched_out,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))


