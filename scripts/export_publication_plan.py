#!/usr/bin/env python3
import csv
import os
from collections import defaultdict
from typing import List, Dict


def read_queue(path: str) -> List[Dict[str, str]]:
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def sort_by_priority(rows: List[Dict[str, str]]) -> List[Dict[str, str]]:
    def key_fn(r: Dict[str, str]):
        try:
            return int(r.get("priority_score", 0))
        except Exception:
            return 0
    return sorted(rows, key=key_fn, reverse=True)


def take_top(rows: List[Dict[str, str]], n: int) -> List[Dict[str, str]]:
    return rows[:n]


def export_csv(path: str, rows: List[Dict[str, str]], fieldnames: List[str]):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)


def main():
    import argparse

    ap = argparse.ArgumentParser(description="Export publication plan from content_queue.csv")
    ap.add_argument(
        "--queue_csv",
        default="_scraped_sites/trafilatura/_analysis/serp/content_queue.csv",
        help="Path to updated content queue",
    )
    ap.add_argument(
        "--out_dir",
        default="_scraped_sites/trafilatura/_analysis/serp/publication_plan",
        help="Output directory",
    )
    ap.add_argument("--top_overall", type=int, default=50, help="Top N overall to export")
    ap.add_argument("--top_per_hub", type=int, default=10, help="Top N per hub to export")
    args = ap.parse_args()

    rows = read_queue(args.queue_csv)
    rows_sorted = sort_by_priority(rows)

    # Top overall
    top_overall = take_top(rows_sorted, args.top_overall)
    export_csv(
        os.path.join(args.out_dir, "top_overall.csv"),
        top_overall,
        ["hub", "keyword", "priority_score"],
    )

    # Top per hub
    rows_by_hub: Dict[str, List[Dict[str, str]]] = defaultdict(list)
    for r in rows:
        rows_by_hub[r.get("hub", "")].append(r)

    for hub, hub_rows in rows_by_hub.items():
        hub_sorted = sort_by_priority(hub_rows)
        top_hub = take_top(hub_sorted, args.top_per_hub)
        safe_hub = hub if hub else "_unknown"
        export_csv(
            os.path.join(args.out_dir, f"top_{safe_hub}.csv"),
            top_hub,
            ["hub", "keyword", "priority_score"],
        )

    print(
        f"Exported top {args.top_overall} overall and top {args.top_per_hub} per hub to {args.out_dir}"
    )


if __name__ == "__main__":
    main()


