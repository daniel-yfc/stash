# Validator

Scraper validation in this repository follows the official [stashapp/CommunityScrapers](https://github.com/stashapp/CommunityScrapers) validator and schema, which are authoritative.

## Files

| File | Role |
| --- | --- |
| `index.mjs` | Local copy of the upstream validator (Node + Ajv). Runs against the local `scraper.schema.json`. |
| `index-zh-TW.mjs` | Localized (zh-TW) Deno variant, retained for reference and localized output only. |
| `scraper.schema.json` | Minimal local schema stub. The upstream `validator/scraper.schema.json` is the authoritative schema. |

## How validation runs

- CI (`validate.yml`) downloads the upstream `index.mjs` and `scraper.schema.json` from `stashapp/CommunityScrapers@master` at run time and validates `scrapers/` against them (Node or Deno, auto-detected from the upstream imports).
- Local quick check (uses the local stub schema — the CI/upstream result is authoritative):

```bash
npm install
node validator/index.mjs -a --ci        # validate all scrapers
node validator/index.mjs -a -s --ci     # also check URL ordering
```

- Localized output (reference only):

```bash
cd validator && deno run --allow-read --allow-write index-zh-TW.mjs ../scrapers/ACCEED.yml
```
