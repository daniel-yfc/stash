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

## Documentation checker

`check_scraper_docs.py` checks documentation examples and contradictions. It runs automatically in the `pr-check.yml` workflow.

```bash
python tools/check_scraper_docs.py
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

- Node.js 20+ (`validator/index.mjs`)
- Python 3 + pytest (`requirements.txt`)

Scripts are invoked via `bash tools/<script>.sh` so no executable bit is required.
