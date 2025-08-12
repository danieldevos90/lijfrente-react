import os, re
from collections import defaultdict, Counter

BASE = os.path.abspath('_scraped_sites/trafilatura')
DOMAINS = [d for d in os.listdir(BASE) if os.path.isdir(os.path.join(BASE, d)) and not d.startswith('_')]

TITLE_RE = re.compile(r'^title:\s*(.+)$', re.I)
URL_RE = re.compile(r'^url:\s*(.+)$', re.I)
H1_RE = re.compile(r'^#\s+(.+)$')

CATEGORIES = {
    'loans_general': [r'\bzakelijke lening\b', r'\bbedrijfslening\b', r'\blening\b'],
    'credit_line': [r'\bdoorlopend krediet\b', r'\brekening-?courant\b', r'\bkrediet\b'],
    'working_capital': [r'\bwerkkapitaal\b'],
    'factoring': [r'\bfactoring\b', r'\bfactuur verkopen\b', r'\bdebiteurenfinanciering\b'],
    'mortgage': [r'\bhypotheek\b', r'\bbedrijfspand\b', r'\bbedrijfshypotheek\b'],
    'bkr': [r'\bbkr\b'],
    'psd2': [r'\bpsd2\b'],
    'vat_tax': [r'\bbtw\b', r'\bomzetbelasting\b', r'\bbelasting\b'],
    'accounting': [r'\bboekhouding\b', r'\bjaarrekening\b', r'\bexploitatiebegroting\b'],
    'liquidity': [r'\bliquiditeit\b', r'\bcashflow\b', r'\bliquiditeits\w*\b'],
    'solvency': [r'\bsolvabiliteit\b'],
    'profitability': [r'\brentabiliteit\b'],
    'interest_rate': [r'\brente\b', r"\binterest\b"],
    'calculator': [r'\bbereken\b', r'\bcalculator\b'],
    'startup_zzp': [r'\bzzp\b', r'\bstarters?\b', r'\beenmanszaak\b'],
    'sector_pages': [r'\bsector', r'\bbranche', r'\bhoreca\b', r'\bretail\b', r'\btransport\b'],
    'sustainability': [r'\bduurzaamheid\b'],
    'privacy': [r'\bprivacy\b'],
    'faq_support': [r'\bveelgestelde vragen\b', r'\bsupport\b', r'\bfaq\b'],
    'blog_news': [r'\bblog\b', r'\bnieuws\b'],
    'partnership': [r'\bpartner\w*\b', r'\bpartners\b'],
    'scholarship': [r'\bstudiebeurs\b'],
    'credit_card': [r'\bcreditcard\b'],
    'eligibility': [r'\bvoorwaarden\b', r'\bkwalificatie\b'],
    'repayment': [r'\bterugbetalen\b'],
    'no_hidden_fees': [r'\bgeen verborgen kosten\b', r'\bgeen opstartkosten\b'],
    'same_day': [r'\b(dezelfde|zelfde) dag\b', r'\bbinnen\s+24\s*uur\b'],
    'contact': [r'\bcontact\b'],
    'testimonials': [r'\bklanten\b', r'\breviews?\b', r'\bcases?\b'],
    'aml': [r'\bwitwassen\b', r'\banti-?money\b'],
    'governance': [r'\bbedrijfsbestuur\b', r'\bbeloningsbeleid\b', r'\bbelangenverstrengeling\b'],
    'cookies': [r'\bcookieverklaring\b', r'\bcookies?\b'],
}

CAT_REGEX = {k: [re.compile(pat, re.I) for pat in v] for k, v in CATEGORIES.items()}


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
            title = ''
            url = ''
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
            text = ' '.join([title, url] + h1s).lower()
            yield dom, fpath, title, url, text


def categorize():
    per_domain_cats = defaultdict(lambda: defaultdict(list))
    for dom, path, title, url, text in iter_pages():
        matched = False
        for cat, regs in CAT_REGEX.items():
            if any(r.search(text) for r in regs):
                per_domain_cats[dom][cat].append({'title': title, 'url': url, 'path': path})
                matched = True
        # If nothing matched but it's a blog/news, classify as blog_news
        if not matched and ('/blog' in url or 'blog' in text):
            per_domain_cats[dom]['blog_news'].append({'title': title, 'url': url, 'path': path})
    return per_domain_cats


def main():
    cats = categorize()
    domains = sorted(cats.keys())

    # Coverage per category per domain
    cat_totals = Counter()
    cat_domains = defaultdict(set)
    for d in domains:
        for c, items in cats[d].items():
            cat_totals[c] += len(items)
            if items:
                cat_domains[c].add(d)

    # Overlaps: categories present in >= 3 domains
    overlaps = [(c, sorted(list(cat_domains[c])), cat_totals[c]) for c in cat_domains]
    overlaps.sort(key=lambda x: (-len(x[1]), -x[2], x[0]))

    # Gaps/opportunities: categories in 2+ domains but missing in some
    all_domains = set(domains)
    gaps = []
    for c, doms, total in overlaps:
        present = set(doms)
        missing = sorted(list(all_domains - present))
        if len(present) >= 2 and missing:
            gaps.append({'category': c, 'present_in': sorted(list(present)), 'missing_in': missing, 'total_pages': total})

    opportunities = defaultdict(list)
    for g in gaps:
        weight = len(g['present_in'])
        for dom in g['missing_in']:
            opportunities[dom].append((g['category'], weight))
    for dom in opportunities:
        opportunities[dom].sort(key=lambda x: (-x[1], x[0]))
        opportunities[dom] = opportunities[dom][:20]

    out_dir = os.path.join(BASE, '_analysis')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'report_categories.md')
    with open(out_path, 'w', encoding='utf-8') as out:
        out.write('## Category coverage per domain (counts)\n')
        for d in domains:
            out.write(f'### {d}\n')
            for c in sorted(cats[d].keys()):
                out.write(f'- {c}: {len(cats[d][c])}\n')
            out.write('\n')
        out.write('\n## Overlapping categories across domains (sorted)\n')
        for c, doms, total in overlaps:
            out.write(f'- {c}: domains={", ".join(doms)}; total_pages={total}\n')
        out.write('\n## Gaps (categories present in 2+ domains, missing in others)\n')
        for g in gaps:
            out.write(f'- {g["category"]}: present in [{", ".join(g["present_in"]) }], missing in [{ ", ".join(g["missing_in"]) }], pages={g["total_pages"]}\n')
        out.write('\n## Top opportunities per domain\n')
        for d in domains:
            out.write(f'### {d}\n')
            for c, w in opportunities.get(d, []):
                out.write(f'- {c} (covered by {w} competitors)\n')
            out.write('\n')
    print(out_path)

if __name__ == '__main__':
    main()
