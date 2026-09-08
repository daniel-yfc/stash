# Tools

Repository tooling: quality gate, documentation checker, local build/test helpers, and the test suite. Run all commands from the repository root.

## Quality gate

| Script | Purpose |
| --- | --- |
| `scraper-quality-gate.sh` | Per-scraper policy checks, plus official CommunityScrapers schema validation when `CS_VALIDATOR_DIR` is set |
| `validate-all.sh` | Run the gate over every `scrapers/**/*.yml` (including `scrapers/private/`) |

```bash
bash tools/scraper-quality-gate.sh scrapers/ACCEED.yml
bash tools/validate-all.sh
```

Set `CS_VALIDATOR_DIR` only when using a prepared `stashapp/CommunityScrapers` checkout that contains `validator/index.mjs`, `validator/scraper.schema.json`, and installed Node dependencies. The repository default validation path is `npm run validate` and `npm run validate-sort`.

## Documentation checker

`check_scraper_docs.py` checks documentation examples and contradictions. It runs automatically in the `pr-check.yml` workflow.

```bash
python tools/check_scraper_docs.py
```

## Live scraper scrutiny

`scrutiny.js` evaluates scrapers against live upstream websites. It runs probe queries, discovers scene detail pages, and tests XPath selector coverage against real DOM responses.

| Script | Purpose |
| --- | --- |
| `scrutiny.js` | Live end-to-end evaluation of `sceneScraper` and `searchScraper` with probe terms and field coverage reporting |

```bash
# Evaluate a single scraper with automatic probes
node tools/scrutiny.js scrapers/CK-Download.yml

# Also test searchScraper selectors on search results
node tools/scrutiny.js scrapers/CK-Download.yml --search

# Walk pages 1-3 and test multiple candidates
node tools/scrutiny.js scrapers/CK-Download.yml --paginate --multi

# Custom probe search terms
node tools/scrutiny.js scrapers/CK-Download.yml --probe=DVD,2026

# Evaluate sceneScraper directly against a specific URL
node tools/scrutiny.js scrapers/CK-Download.yml --url="https://www.ck-download.com/product/detail/27573"

# Pass cookie header for session/auth-gated inspection
node tools/scrutiny.js scrapers/ACCEED.yml --cookie="PHPSESSID=..."
```

## Local helpers

| Script | Purpose |
| --- | --- |
| `install.sh` | Install Python (`requirements.txt`) and Node dependencies |
| `build-site.sh` | Build the static `site/` directory |
| `clean.sh` | Remove `site/` and `.cache/` |
| `test.sh` | Run the pytest suite in `tools/tests/` |

## Tests

```bash
python3 -m pytest tools/tests/ -v
```

## Standalone utilities

| File | Purpose |
| --- | --- |
| `SPB-2.0.html` | Scraper pattern builder (open in a browser) |
| `SRB-2.0-documentation.md` | Documentation for the SRB tool |

## Dependencies

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` (`.nvmrc` pins `24.15.0`; required by `jsdom` 30)
- Python 3 + pytest (`requirements.txt`)

Scripts are invoked via `bash tools/<script>.sh` so no executable bit is required.
