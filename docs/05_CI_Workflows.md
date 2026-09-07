# CI Workflows

GitHub Actions workflows live under `.github/workflows/`.

## Validation workflow

The scraper workflow runs on scraper, validator, and workflow changes. It uses Node and the official validator:

```bash
npm ci || npm install
node validator/index.mjs -a scrapers
node validator/index.mjs -a -s scrapers
```

The Deno/localized validator is removed and must not be reintroduced as a fallback.

## Policy and documentation checks

The quality gate and documentation checker run separately:

```bash
bash tools/validate-all.sh
python tools/check_scraper_docs.py
```

## Interpretation

A green schema job means the YAML is structurally valid. It does not establish live selector correctness, availability, login success, or image accessibility. Those results are recorded in [`LIVE_TEST_STATUS.md`](LIVE_TEST_STATUS.md).
