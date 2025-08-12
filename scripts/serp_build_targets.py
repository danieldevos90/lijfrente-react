import csv, os, re, sys
from collections import defaultdict, Counter

in_csv = '_scraped_sites/trafilatura/_analysis/serp/serp_results.csv'
out_dir = '_scraped_sites/trafilatura/_analysis/serp'
os.makedirs(out_dir, exist_ok=True)

hub_map = {
  'rente': 'rente', 'interest': 'rente', 'apr': 'rente',
  'calculator': 'calculators', 'bereken': 'calculators', 'berekenen': 'calculators',
  'psd2': 'psd2', 'open banking': 'psd2',
  'solvabiliteit': 'solvabiliteit', 'liquiditeit': 'liquiditeit', 'werkkapitaal': 'werkkapitaal',
  'factoring': 'factoring', 'factuur': 'factoring',
  'btw': 'btw', 'omzetbelasting': 'btw',
}

# load rows
rows = []
with open(in_csv, 'r', encoding='utf-8') as f:
    r = csv.DictReader(f)
    for row in r:
        if row['rank'] == 'ERR':
            continue
        try:
            rank = int(row['rank'])
        except:
            continue
        kw = row['keyword']
        title = row['title']
        url = row['url']
        rows.append((kw, rank, title, url))

# hub detection

def detect_hub(kw: str) -> str:
    l = kw.lower()
    for k,v in hub_map.items():
        if k in l:
            return v
    return 'other'

# aggregate domains per hub/keyword
comp = defaultdict(lambda: defaultdict(Counter))
for kw, rank, title, url in rows:
    hub = detect_hub(kw)
    try:
        domain = re.sub(r'^https?://(www\.)?', '', url).split('/')[0]
    except Exception:
        domain = ''
    if domain:
        comp[hub][kw][domain] += 1

# write targets.csv
with open(os.path.join(out_dir, 'targets.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['hub','keyword','top_domains'])
    for hub, kw_map in comp.items():
        for kw, ctr in kw_map.items():
            top = ', '.join([d for d,_ in ctr.most_common(5)])
            w.writerow([hub, kw, top])

# write per-hub
for hub, kw_map in comp.items():
    with open(os.path.join(out_dir, f'targets_{hub}.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['keyword','top_domains'])
        for kw, ctr in kw_map.items():
            top = ', '.join([d for d,_ in ctr.most_common(5)])
            w.writerow([kw, top])

# top domains overall and by hub
overall = Counter()
by_hub = defaultdict(Counter)
for hub, kw_map in comp.items():
    for kw, ctr in kw_map.items():
        overall.update(ctr)
        by_hub[hub].update(ctr)

with open(os.path.join(out_dir, 'top_domains_overall.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['domain','count'])
    for d, c in overall.most_common(100):
        w.writerow([d,c])

with open(os.path.join(out_dir, 'top_domains_by_hub.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['hub','domain','count'])
    for hub, ctr in by_hub.items():
        for d, c in ctr.most_common(50):
            w.writerow([hub,d,c])

# content queue heuristic
# score: +3 calculators intent; +2 rente; +1 question; +1 long-tail (>=3 words)
qwords = ('hoe','wat','welke','waarom','wanneer')

def score_kw(kw: str) -> int:
    l = kw.lower()
    s = 0
    if any(k in l for k in ('bereken','berekenen','calculator')):
        s += 3
    if 'rente' in l:
        s += 2
    if any(w in l.split() for w in qwords):
        s += 1
    if len(l.split()) >= 3:
        s += 1
    return s

# dedupe keywords and build scores
kw_set = set()
for kw, rank, title, url in rows:
    kw_set.add(kw)

queue_rows = []
for kw in kw_set:
    hub = detect_hub(kw)
    queue_rows.append([hub, kw, score_kw(kw)])

queue_rows.sort(key=lambda x: (-x[2], x[0], x[1]))
with open(os.path.join(out_dir, 'content_queue.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['hub','keyword','priority_score'])
    for hub, kw, sc in queue_rows:
        w.writerow([hub, kw, sc])

print('built targets, per-hub targets, top domains, and content_queue')
