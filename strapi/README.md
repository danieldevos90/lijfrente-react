### Strapi Cloud content‑types (voorstel)

We hanteren altijd een `siteId` veld (string) voor multi‑site filtering. Minimale types:

1. `site`
   - `siteId` (UID/string, unique)
   - `name` (string)
   - `domain` (string)

2. `page`
   - `siteId` (string, index)
   - `slug` (UID/string)
   - `title` (string)
   - `body` (Rich text)

3. `navigationItem`
   - `siteId` (string)
   - `label` (string)
   - `href` (string)
   - `order` (integer)

4. `tokenSet` (design tokens per site)
   - `siteId` (string)
   - `colors` (JSON)
   - `typography` (JSON)
   - `components` (JSON)

Public API voorbeeld voor frontend:
`GET /api/sites?filters[siteId][$eq]={siteId}`


