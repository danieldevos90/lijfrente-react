import os, json, requests, random
BASE = '_scraped_sites/trafilatura'
OUTDIR = os.path.join(BASE,'_analysis/seo')
os.makedirs(OUTDIR, exist_ok=True)

DOMAINS = [d for d in os.listdir(BASE) if os.path.isdir(os.path.join(BASE,d)) and not d.startswith('_')]

# collect up to N URLs per domain from extracted files
N = 5
pages = {}
for d in DOMAINS:
    urls = []
    dpath = os.path.join(BASE,d)
    for f in os.listdir(dpath):
        if not f.endswith('.txt'): continue
        path=os.path.join(dpath,f)
        with open(path,'r',encoding='utf-8',errors='ignore') as fh:
            for i, line in enumerate(fh):
                if i>50: break
                if line.lower().startswith('url:'):
                    u=line.split(':',1)[1].strip()
                    if u.startswith('http'):
                        urls.append(u)
                        break
    random.shuffle(urls)
    pages[d]=urls[:N]

API='https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&strategy=mobile'

summary=[]
for d, urls in pages.items():
    for u in urls:
        try:
            r=requests.get(API.format(url=u), timeout=30)
            data=r.json()
            lcp = data.get('lighthouseResult',{}).get('audits',{}).get('largest-contentful-paint',{}).get('displayValue')
            perf = data.get('lighthouseResult',{}).get('categories',{}).get('performance',{}).get('score')
            fcp = data.get('lighthouseResult',{}).get('audits',{}).get('first-contentful-paint',{}).get('displayValue')
            summary.append({'domain': d, 'url': u, 'performance': perf, 'lcp': lcp, 'fcp': fcp})
        except Exception as e:
            summary.append({'domain': d, 'url': u, 'error': str(e)})

with open(os.path.join(OUTDIR,'pagespeed_sample.json'),'w',encoding='utf-8') as f:
    json.dump(summary,f,ensure_ascii=False, indent=2)
print(os.path.join(OUTDIR,'pagespeed_sample.json'))
