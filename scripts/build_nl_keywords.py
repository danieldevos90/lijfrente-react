import os, json, time, string, urllib.parse, urllib.request

SEEDS = [
  'zakelijke lening','zakelijke lening rente','zakelijk krediet','kredietlijn','doorlopend krediet zakelijk',
  'werkkapitaal','factoring','factuur verkopen','psd2','open banking','solvabiliteit','liquiditeit',
  'btw','omzetbelasting','hypotheek zakelijk','bkr zakelijk','lening calculator','lening berekenen',
  'kosten zakelijke lening','veelgestelde vragen zakelijke lening','support zakelijke lening','zzp lening',
  'zakelijke lening zonder jaarcijfers','zakelijk krediet berekenen','rekening courant krediet',
]
PREFIXES = ['hoe','wat','welke','waarom','wanneer']
SUG_URL = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=nl&q='
UA = {'User-Agent': 'Mozilla/5.0'}


def suggest(q):
    try:
        req = urllib.request.Request(SUG_URL + urllib.parse.quote(q), headers=UA)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        return [s for s in (data[1] if isinstance(data,list) and len(data)>=2 else []) if isinstance(s,str)]
    except Exception:
        return []


def main():
    out_path = '_scraped_sites/trafilatura/_analysis/serp/keywords_expanded.txt'
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    kws = set()
    for seed in SEEDS:
        for p in ['', *PREFIXES]:
            q = f"{seed} {p}".strip()
            for s in suggest(q):
                kws.add(s.strip())
            time.sleep(0.08)
        for ch in string.ascii_lowercase:
            for s in suggest(f"{seed} {ch}"):
                kws.add(s.strip())
            time.sleep(0.06)
    # cleanup and cap ~300
    cleaned = []
    for k in kws:
        k2 = ' '.join(k.split())
        if len(k2) >= 3:
            cleaned.append(k2)
    cleaned = sorted(list(dict.fromkeys(cleaned)))[:300]
    with open(out_path,'w',encoding='utf-8') as f:
        for k in cleaned:
            f.write(k + '\n')
    print(out_path, len(cleaned))

if __name__ == '__main__':
    main()
