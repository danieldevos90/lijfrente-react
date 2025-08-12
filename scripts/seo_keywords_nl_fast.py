import os, re, csv, json, time, string, urllib.parse, urllib.request
from collections import defaultdict

BASE = os.path.abspath('_scraped_sites/trafilatura')
ANALYSIS_DIR = os.path.join(BASE, '_analysis')
DOMAINS = [d for d in os.listdir(BASE) if os.path.isdir(os.path.join(BASE, d)) and not d.startswith('_')]

TITLE_RE = re.compile(r'^title:\s*(.+)$', re.I)
URL_RE = re.compile(r'^url:\s*(.+)$', re.I)

SEEDS = ['zakelijke lening', 'zakelijke lening rente', 'kredietlijn', 'werkkapitaal', 'factoring', 'psd2', 'solvabiliteit', 'btw']
QUESTION_PREFIXES = ['hoe', 'wat', 'welke']
SUGGEST_URL = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=nl&q='
HEADERS = {'User-Agent': 'Mozilla/5.0'}

def http_get(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as resp:
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
    titles = []
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
                titles.append(title)
                if url:
                    url_index[title].append(url)
    return titles, url_index

def build_keywords_fast():
    all_kw = set()
    for seed in SEEDS:
        all_kw.update(get_suggestions(seed))
        for p in QUESTION_PREFIXES:
            all_kw.update(get_suggestions(f"{seed} {p}"))
        for ch in 'abc':
            all_kw.update(get_suggestions(f"{seed} {ch}"))
        time.sleep(0.1)
    cleaned = []
    for k in all_kw:
        k2 = re.sub(r'\s+', ' ', k.strip())
        if len(k2) >= 3:
            cleaned.append(k2)
    cleaned = sorted(list(dict.fromkeys(cleaned)))[:150]
    return cleaned

def main():
    os.makedirs(ANALYSIS_DIR, exist_ok=True)
    titles, url_index = load_competitor_titles()
    titles_l = [t.lower() for t in titles]
    kws = build_keywords_fast()

    out_csv = os.path.join(ANALYSIS_DIR, 'seo_nl_keyword_opportunities_fast.csv')
    with open(out_csv, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['keyword','status','sample_competitor_urls'])
        for kw in kws:
            present = any(kw.lower() in t for t in titles_l)
            status = 'covered' if present else 'gap'
            urls = []
            if present:
                for title, ulist in url_index.items():
                    if kw.lower() in title.lower():
                        urls += ulist
                        if len(urls) >= 3: break
            w.writerow([kw, status, ';'.join(list(dict.fromkeys(urls))[:3])])

    out_md = os.path.join(ANALYSIS_DIR, 'seo_nl_summary_fast.md')
    with open(out_md, 'w', encoding='utf-8') as f:
        f.write('## NL keyword gaps (fast run)\n')
        for kw in kws:
            if not any(kw.lower() in t for t in titles_l):
                f.write(f"- {kw}\n")

    print(out_csv)
    print(out_md)

if __name__ == '__main__':
    main()
