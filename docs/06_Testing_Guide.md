# Testing Guide

## Overview

This guide covers local testing, schema validation, CI/CD checks, and Python regression tests for the Stash Scraper Quality Gate system.

## Test Types

### 1. Local Quality Gate Testing

Run the quality gate script against individual scraper files to test repository policy rules:

```bash
# Test a single scraper
bash tools/scraper-quality-gate.sh scrapers/ACCEED.yml

# Test all public scrapers
for file in scrapers/*.yml; do
  bash tools/scraper-quality-gate.sh "$file"
done
```

### 2. Schema and URL Validation

Validate scraper files against `validator/scraper.schema.json` using the canonical validator runner:

```bash
# Validate all scrapers
node validator/index.mjs -a --ci

# Check URL alphabetical sorting
node validator/index.mjs -a -s --ci
```

### 3. Python Test Suite

Run the Python test suite to check script executability, directory structures, and skill reference integrity:

```bash
python -m pytest tools/tests/
```

### 4. Live Scraper Scrutiny

Run live-site evaluation to verify selectors against real DOM responses:

```bash
# Evaluate sceneScraper and searchScraper with probes
node tools/scrutiny.js scrapers/CK-Download.yml --search

# Walk pages and test multiple scene candidates
node tools/scrutiny.js scrapers/CK-Download.yml --paginate --multi

# Evaluate a specific scene URL directly
node tools/scrutiny.js scrapers/CK-Download.yml --url="<URL>"
```

### 5. Documentation Verification

Validate Markdown documentation structure and references:

```bash
python tools/check_scraper_docs.py
```

## CI/CD Testing Pipeline

GitHub Actions automatically run tests on pushes and pull requests:

- **`validate.yml`**: Blocking gate for schema validation and quality gate policy rules across all scraper files.
- **`pr-check.yml`**: Validates modified scraper files in pull requests and posts inline status feedback.
- **`link-check.yml`**: Periodically checks Markdown documentation link validity.
- **`eval.yml`**: Evaluates scraper quality against standard evaluation pack scenarios.

## Standard Verification Checklist

Before submitting a scraper change, confirm:

- [ ] `node validator/index.mjs -a --ci` passes without schema errors.
- [ ] `node validator/index.mjs -a -s --ci` confirms URL ordering.
- [ ] `bash tools/scraper-quality-gate.sh <scraper.yml>` passes all policy checks.
- [ ] `python -m pytest tools/tests/` passes all unit tests.
- [ ] `node tools/scrutiny.js <scraper.yml> --search` verifies live selectors when site is accessible.
- [ ] `python tools/check_scraper_docs.py` reports no documentation errors.

## Troubleshooting

### Common Issues

#### Quality Gate Failure (`scraper-quality-gate.sh`)
- **Missing root name**: Ensure `name:` is declared at column 0 in XPath scrapers.
- **`driver.cookies` in public directory**: Move session-dependent scrapers to `scrapers/private/`.
- **Invalid parseDate layout**: Use Go reference time formats (e.g., `2006-01-02`), not Moment/strftime tokens (`YYYY`, `%Y`).

#### Python Test Failures
- **Executable bit missing**: Run `chmod +x tools/*.sh`.
- **Missing dependencies**: Install requirements with `pip install -r requirements.txt`.

## Related Documents

- [01_System_Architecture.md](01_System_Architecture.md) — System design and component map
- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) — Detailed 5 quality rules
- [04_Production_Gate.md](04_Production_Gate.md) — Business readiness checklist
- [05_CI_Workflows.md](05_CI_Workflows.md) — CI/CD workflow details
- [test-report-template.md](test-report-template.md) — Standard markdown full-suite test report format
