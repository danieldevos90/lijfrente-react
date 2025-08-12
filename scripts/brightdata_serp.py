import argparse, csv, os, re, time, urllib.parse, requests
from bs4 import BeautifulSoup

BRIGHTDATA_ENDPOINT = "https://api.brightdata.com/request"

def slugify(text: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9_-]+", "-", text.strip().lower()).strip('-')
    return re.sub(r"-+", "-", s) or "kw"

def fetch_serp_html(api_key: str, zone: str, keyword: str, hl: str = "nl", gl: str = "nl") -> str:
    url = f"https://www.google.com/search?q={urllib.parse.quote(keyword)}&hl={hl}&gl={gl}"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"zone": zone, "url": url, "format": "raw"}
    r = requests.post(BRIGHTDATA_ENDPOINT, json=payload, headers=headers, timeout=60)
    r.raise_for_status()
    return r.text

# Extract organic results: rank, title, url
URL_RE = re.compile(r"/url\\?q=([^&]+)&")

def parse_organic(html: str):
    soup = BeautifulSoup(html, "html.parser")
    results = []
    rank = 0
    # Look for search results container
    container = soup.find(id="search") or soup
    for a in container.find_all("a", href=True):
        h3 = a.find("h3")
        if not h3: 
            continue
        href = a["href"]
        m = URL_RE.search(href)
        if m:
            dest = urllib.parse.unquote(m.group(1))
        else:
            dest = href
        title = h3.get_text(" ", strip=True)
        if title and dest and dest.startswith("http"):
            rank += 1
            results.append((rank, title, dest))
    return results

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--api_key", required=False, default=os.getenv("BRIGHTDATA_API_KEY"))
    ap.add_argument("--zone", default="serp_api1")
    ap.add_argument("--kw", nargs="*")
    ap.add_argument("--kw_file")
    ap.add_argument("--out_csv", default="_scraped_sites/trafilatura/_analysis/serp/serp_results.csv")
    ap.add_argument("--out_dir", default="_scraped_sites/serp/brightdata")
    args = ap.parse_args()

    if not args.api_key:
        raise SystemExit("Missing --api_key or BRIGHTDATA_API_KEY env var")

    keywords = []
    if args.kw_file and os.path.exists(args.kw_file):
        with open(args.kw_file, "r", encoding="utf-8") as f:
            keywords += [ln.strip() for ln in f if ln.strip()]
    if args.kw:
        keywords += args.kw
    if not keywords:
        raise SystemExit("Provide --kw or --kw_file with keywords")

    os.makedirs(args.out_dir, exist_ok=True)
    os.makedirs(os.path.dirname(args.out_csv), exist_ok=True)

    rows = []
    for kw in keywords:
        try:
            html = fetch_serp_html(args.api_key, args.zone, kw)
            fname = os.path.join(args.out_dir, f"{slugify(kw)}.html")
            with open(fname, "w", encoding="utf-8") as f:
                f.write(html)
            organic = parse_organic(html)
            for rank, title, url in organic[:10]:  # top 10
                rows.append([kw, rank, title, url])
            time.sleep(0.2)
        except Exception as e:
            rows.append([kw, "ERR", str(e), ""])

    header = ["keyword", "rank", "title", "url"]
    if os.path.exists(args.out_csv):
        # append
        with open(args.out_csv, "a", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            for r in rows:
                w.writerow(r)
    else:
        with open(args.out_csv, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(header)
            for r in rows:
                w.writerow(r)
    print(f"saved {len(rows)} rows -> {args.out_csv}")

if __name__ == "__main__":
    main()
