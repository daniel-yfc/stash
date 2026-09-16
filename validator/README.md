# Validator

The repository uses the official CommunityScrapers Node validator and schema:

- `validator/index.mjs`
- `validator/scraper.schema.json`

## Validate

From the repository root:

```bash
node validator/index.mjs -a scrapers
node validator/index.mjs -a -s scrapers
```

`-a` reports all failures. `-s` additionally checks URL-array ordering.

The localized Deno validator has been removed. Do not add a second validator or a local schema fork; the upstream CommunityScrapers validator and schema are authoritative.

## Quality gate

For one scraper:

```bash
bash tools/scraper-quality-gate.sh scrapers/ACCEED.yml
```

For the full repository:

```bash
bash tools/validate-all.sh
```

Schema validation proves configuration validity only. It does not prove that selectors still match the live website.
