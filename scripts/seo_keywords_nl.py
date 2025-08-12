import os, re, csv, json, time, string, urllib.parse, urllib.request
from collections import defaultdict, Counter

BASE = os.path.abspath('_scraped_sites/trafilatura')
ANALYSIS_DIR = os.path.join(BASE, '_analysis')
DOMAINS = [d for d in os.listdir(BASE) if os.path.isdir(os.path.join(BASE, d)) and not d.startswith('_')]

TITLE_RE = re.compile(r'^title:\s*(.+)$', re.I)
URL_RE = re.compile(r'^url:\s*(.+)$', re.I)

# Seed topics (NL) – can be extended
SEEDS = [
    'zakelijke lening', 'zakelijke lening rente', 'rente zakelijke lening',
    'kredietlijn', 'doorlopend krediet zakelijk', 'werkkapitaal',
    'factoring', 'factuur verkopen',
    'psd2', 'open banking',
    'solvabiliteit', 'liquiditeit', 'btw', 'omzetbelasting',
    'hypotheek zakelijk', 'bkr zakelijk',
    'lening calculator', 'lening berekenen', 'kosten zakelijke lening',
    'veelgestelde vragen zakelijke lening', 'support zakelijke lening'
]

QUESTION_PREFIXES = ['hoe', 'wat', 'waarom', 'wanneer', 'welke', 'kan', 'mag']

SUGGEST_URL = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=nl&q='

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
}

def http_get(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read()


def get_suggestions(query: str):
    try:
        raw = http_get(SUGGEST_URL + urllib.parse.quote(query))
        data = json.loads(raw.decode('utf-8'))
        if isinstance(data, list) and len(data) >= 2:
            return list(dict.fromkeys([s for s in data[1] if isinstance(s, str)]))
    except Exception:
        return []
    return []


def load_competitor_titles():
    titles_by_domain = defaultdict(list)
    url_index = defaultdict(list)
    for dom in DOMAINS:
        dpath = os.path.join(BASE, dom)
        for fname in os.listdir(dpath):
            if not fname.endswith('.txt'): continue
            fpath = os.path.join(dpath, fname)
            title = ''
            url = ''
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                    for i, line in enumerate(f):
                        if i > 80: break
                        m = TITLE_RE.match(line)
                        if m: title = m.group(1).strip()
                        m = URL_RE.match(line)
                        if m: url = m.group(1).strip()
            except Exception:
                continue
            if title:
                titles_by_domain[dom].append(title)
                if url:
                    url_index[title].append(url)
    all_titles = []
    for dom, tlist in titles_by_domain.items():
        all_titles.extend(tlist)
    return titles_by_domain, url_index, all_titles


def build_keyword_set():
    # Expand seeds with questions and a-z suffixes
    all_kw = set()
    for seed in SEEDS:
        all_kw.update(get_suggestions(seed))
        for p in QUESTION_PREFIXES:
            all_kw.update(get_suggestions(f"{seed} {p}"))
        for ch in string.ascii_lowercase[:12]:  # a-l to keep it light
            all_kw.update(get_suggestions(f"{seed} {ch}"))
        time.sleep(0.2)
    # Basic cleaning
    cleaned = set()
    for k in all_kw:
        k2 = re.sub(r'\s+', ' ', k.strip())
        if len(k2) >= 3:
            cleaned.add(k2)
    return sorted(cleaned)


def score_with_trends(keywords):
    # Use pytrends for NL relative interest
    from pytrends.request import TrendReq
    py = TrendReq(hl='nl-NL', tz=60)
    scores = {}
    BATCH = 5
    for i in range(0, len(keywords), BATCH):
        chunk = keywords[i:i+BATCH]
        try:
            py.build_payload(chunk, timeframe='today 12-m', geo='NL')
            df = py.interest_over_time()
            if df is None or df.empty: continue
            for col in chunk:
                if col in df.columns:
                    s = df[col].astype(float)
                    scores[col] = float(s.mean())
        except Exception:
            # backoff
            time.sleep(1.0)
            continue
        time.sleep(0.3)
    return scores


def compute_gaps(keywords, all_titles):
    # naive presence check: keyword phrase appears in any competitor title
    present = set()
    lowered_titles = [t.lower() for t in all_titles]
    for kw in keywords:
        kwl = kw.lower()
        if any(kwl in t for t in lowered_titles):
            present.add(kw)
    gaps = [k for k in keywords if k not in present]
    return present, gaps


def main():
    os.makedirs(ANALYSIS_DIR, exist_ok=True)
    titles_by_domain, url_index, all_titles = load_competitor_titles()
    keywords = build_keyword_set()
    scores = score_with_trends(keywords)
    present, gaps = compute_gaps(keywords, all_titles)

    # Build CSV rows, prefer gaps and sort by trend score desc
    def pick_urls(kw):
        out = []
        for title, urls in url_index.items():
            if kw.lower() in title.lower():
                out.extend(urls)
            if len(out) >= 3: break
        return list(dict.fromkeys(out))[:3]

    ranked = sorted(keywords, key=lambda k: (-scores.get(k, 0.0), k))
    rows = []
    for kw in ranked:
        rows.append([
            kw,
            f"{scores.get(kw, 0.0):.2f}",
            'gap' if kw in gaps else 'covered',
            ';'.join(pick_urls(kw))
        ])

    out_csv = os.path.join(ANALYSIS_DIR, 'seo_nl_keyword_opportunities.csv')
    with open(out_csv, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['keyword','nl_trend_avg_12m','status','sample_competitor_urls'])
        w.writerows(rows)

    # Markdown summary: top 50 gaps by score
    top_gaps = [k for k in ranked if k in gaps][:50]
    out_md = os.path.join(ANALYSIS_DIR, 'seo_nl_summary.md')
    with open(out_md, 'w', encoding='utf-8') as f:
        f.write('## Top 50 NL keyword gaps (by Google Trends score)\n')
        for k in top_gaps:
            f.write(f"- {k} — score: {scores.get(k, 0.0):.2f}\n")
    print(out_csv)
    print(out_md)

if __name__ == '__main__':
    main()
