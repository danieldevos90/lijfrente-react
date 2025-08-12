import os, re, json, hashlib
from collections import defaultdict, Counter

BASE = os.path.abspath('_scraped_sites/trafilatura')
DOMAINS = [d for d in os.listdir(BASE) if os.path.isdir(os.path.join(BASE, d)) and not d.startswith('_')]

TITLE_RE = re.compile(r'^title:\s*(.+)$', re.I)
URL_RE = re.compile(r'^url:\s*(.+)$', re.I)
H1_RE = re.compile(r'^#\s+(.+)$')

stopwords = set("""
van voor met een het de en of is in aan bij jouw je jij wij zij hun onze ons u uw tot door zonder tegen onder boven over naar als dan ook maar nog wel al meer minder niet geen dit dat deze die daar hier hoe wat welke waarom wanneer voor/op onze/ons
""".split())

TOPIC_SPLIT = re.compile(r'[^a-z0-9]+')


def normalize_topic(text: str) -> str:
    text = text.lower()
    tokens = [t for t in TOPIC_SPLIT.split(text) if t and t not in stopwords and len(t) > 2]
    return ' '.join(tokens)[:140]


def iter_pages():
    for dom in DOMAINS:
        dpath = os.path.join(BASE, dom)
        for fname in os.listdir(dpath):
            if not fname.endswith('.txt'):
                continue
            fpath = os.path.join(dpath, fname)
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.read().splitlines()
            except Exception:
                continue
            title = None
            url = None
            h1s = []
            for line in lines[:80]:
                m = TITLE_RE.match(line)
                if m:
                    title = m.group(1).strip()
                m = URL_RE.match(line)
                if m:
                    url = m.group(1).strip()
            for line in lines:
                m = H1_RE.match(line)
                if m:
                    h1s.append(m.group(1).strip())
            yield dom, fpath, title or '', url or '', h1s


def build_index():
    per_domain = defaultdict(list)
    topic_counts = Counter()
    topic_domains = defaultdict(set)
    for dom, path, title, url, h1s in iter_pages():
        topic = normalize_topic(title) or (normalize_topic(h1s[0]) if h1s else '')
        if not topic:
            continue
        per_domain[dom].append({
            'path': path,
            'title': title,
            'url': url,
            'topic': topic,
            'h1s': h1s[:5],
        })
        topic_counts[topic] += 1
        topic_domains[topic].add(dom)
    return per_domain, topic_counts, topic_domains


def main():
    per_domain, topic_counts, topic_domains = build_index()

    overlaps = [(t, sorted(list(topic_domains[t])), topic_counts[t]) for t in topic_counts]
    overlaps.sort(key=lambda x: (-len(x[1]), -x[2], x[0]))

    all_domains = set(per_domain.keys())

    gaps = []
    for t, doms, cnt in overlaps:
        present = set(doms)
        missing = sorted(list(all_domains - present))
        if len(present) >= 2 and missing:
            gaps.append({'topic': t, 'present_in': sorted(list(present)), 'missing_in': missing})

    opportunities = defaultdict(list)
    for g in gaps:
        weight = len(g['present_in'])
        for dom in g['missing_in']:
            opportunities[dom].append((g['topic'], weight))
    for dom in opportunities:
        opportunities[dom].sort(key=lambda x: (-x[1], x[0]))
        opportunities[dom] = opportunities[dom][:25]

    out_dir = os.path.join(BASE, '_analysis')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'report.md')
    with open(out_path, 'w', encoding='utf-8') as out:
        out.write('## Coverage summary\n')
        for d in sorted(per_domain.keys()):
            out.write(f'- {d}: {len(per_domain[d])} pages indexed\n')
        out.write('\n## Overlapping topics (sample)\n')
        for t, doms, cnt in overlaps[:50]:
            out.write(f'- {t} — domains: {", ".join(doms)} (pages: {cnt})\n')
        out.write('\n## Gaps (topics present in 2+ domains, missing in others) — sample\n')
        for g in gaps[:50]:
            out.write(f'- {g["topic"]} — present: {", ".join(g["present_in"])}; missing: {", ".join(g["missing_in"])}\n')
        out.write('\n## Top opportunities per domain\n')
        for d in sorted(per_domain.keys()):
            out.write(f'### {d}\n')
            for topic, w in opportunities.get(d, [])[:20]:
                out.write(f'- {topic} (covered by {w} competitors)\n')
            out.write('\n')
    print(out_path)

if __name__ == '__main__':
    main()
