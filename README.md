# Stash Scraper Builder

[![Link Check](https://github.com/daniel-yfc/stash/actions/workflows/link-check.yml/badge.svg)](https://github.com/daniel-yfc/stash/actions/workflows/link-check.yml)

A collection of StashApp scrapers with a focus on correctness, maintainability, and validation.

## Stash Scraper Builder Skill

This repository includes a skill for building StashApp scrapers: [`skills/stash-scraper-builder/SKILL.md`](skills/stash-scraper-builder/SKILL.md).

Agent rules for AI assistants are in [`AGENTS.md`](AGENTS.md).

## Repository Structure

- `scrapers/` — Public scraper YAML files
- `scrapers/private/` — Private scrapers (session cookies allowed here only)
- `skills/stash-scraper-builder/` — Skill definition and reference documentation
- `validator/` — JSON Schema validator
- `tools/` — Documentation and contradiction checks
- `tests/` — Test fixtures

## Usage

Validate a scraper:

```bash
node validator/index.mjs scrapers/<Name>.yml
```

Sort URL arrays:

```bash
node validator/index.mjs -s scrapers/<Name>.yml
```

Check documentation examples and stale contradictions:

```bash
python tools/check_scraper_docs.py
```

Run tests:

```bash
python -m pytest tests/
```

## Development

Install dependencies:

```bash
# Node.js (validator)
npm install

# Python (tests and documentation checker)
pip install -r requirements.txt
```

Run validation locally:

```bash
npm run validate
npm run validate-sort
python tools/check_scraper_docs.py
pytest
```

CI runs these checks on every push and PR.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the source hierarchy, evidence and validation policy, documentation rules, and required checks.

## License

MIT
