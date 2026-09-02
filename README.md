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
- `tests/` — Test fixtures

## Usage

Validate a scraper:

```bash
node validator/validate.js scrapers/<Name>.yml
```

Sort URL arrays:

```bash
node validator/validate.js -s scrapers/<Name>.yml
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

# Python (tests)
pip install -r requirements.txt
```

Run validation locally:

```bash
# Validate all scrapers
npm run validate

# Check URL array sorting
npm run validate-sort

# Or directly
node validator/index.mjs scrapers
node validator/index.mjs -s scrapers
```

Run tests:

```bash
pytest
```

CI will automatically run these checks on every push and PR.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full contributor guide.

## License

MIT
