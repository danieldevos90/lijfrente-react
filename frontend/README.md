### Frontend (Next.js op Vercel)

Commands:
```bash
cd frontend
npm install
npm run dev
```

Env vars:
```
NEXT_PUBLIC_STRAPI_URL=https://cms.geldgeregeld.nl
STRAPI_TOKEN=<api-token-met-read>
```

Deploy naar Vercel (CLI):

- **From repo root** (`vercel` or `vercel --prod`): set **Root Directory** to `frontend` in [Vercel Dashboard](https://vercel.com) → Project → Settings → General. Otherwise you’ll see “No Next.js version detected”.
- **From frontend folder**: `cd frontend && vercel` (no Root Directory change needed).

```bash
cd frontend && vercel --prod
```


