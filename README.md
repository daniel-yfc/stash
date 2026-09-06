# Stash Scraper Builder

A collection of StashApp scrapers with a focus on correctness, maintainability, and validation.

## Documentation layers

- [`AGENTS.md`](AGENTS.md) — repository-wide agent boundaries and safety rules.
- [`CLAUDE.md`](CLAUDE.md) — Claude-specific repository instructions; defer to `AGENTS.md` for shared rules.
- [`docs/README.md`](docs/README.md) — repository documentation index and workflow guides.
- [`templates/README.md`](templates/README.md) — copyable scraper scaffolds and template relationships.
- [`skills/stash-scraper-builder/SKILL.md`](skills/stash-scraper-builder/SKILL.md) — scraper-builder skill contract.
- [`skills/stash-scraper-builder/references/`](skills/stash-scraper-builder/references/) — specialized scraper authoring references.
- [`tools/SRB-2.0-documentation.md`](tools/SRB-2.0-documentation.md) — Scraper Request Builder form tool manual.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution and review workflow.

## Repository structure

- `scrapers/` — public scraper YAML files.
- `scrapers/private/` — private scraper YAML files; authentication material is restricted here.
- `templates/` — YAML/Python scaffolds; templates are not verified scrapers.
- `skills/stash-scraper-builder/` — skill definition and specialized references.
- `docs/` — repository-level workflow and architecture documentation.
- `validator/` — executable Node validator and validator schema.
- `tools/` — repository inspection, Scraper Request Builder (`SRB-2.0-documentation.md`), documentation utilities, and repeatable build/evaluation/quality-gate workflows.
- `tools/tests/` — Python tests and regression checks.

## Quick start

Install dependencies:

```bash
npm install
python -m pip install -r requirements.txt
```

Validate all scrapers with the canonical validator:

```bash
node validator/index.mjs -a --ci
```

Check URL ordering:

```bash
node validator/index.mjs -a -s --ci
```

Run Python tests:

```bash
python -m pytest tools/tests/
```

Run project workflows:

```bash
bash tools/validate-all.sh
python tools/check_scraper_docs.py
```

Use `validator/index-zh-TW.mjs` only when localized validator output is specifically required. New documentation should use `validator/index.mjs` by default.

## End-to-end workflow

1. Start from the appropriate template in `templates/`, or inspect an existing scraper.
2. Rename YAML using the site’s CamelCase name and keep the required root `name:`.
3. Select the smallest verified runtime path: XPath, JSON, script, or CDP.
4. Read repository-level guidance, then the skill and its specialized references.
5. Keep public/private authentication boundaries intact.
6. Validate with the official CommunityScrapers schema/validator when available.
7. Run URL sorting, tests, documentation checks, and the quality gate.
8. Record unverified selectors, live-page assumptions, and source provenance.

## Naming and format rules

- New Markdown filenames: lowercase kebab-case, except the existing numbered `docs/` series.
- Scraper and template YAML filenames: CamelCase site/object names with `.yml`.
- Python implementation filenames: CamelCase matching the paired YAML/dependency name with `.py`.
- Root scraper YAML must contain `name:`; unsupported `documentHeader` and `$vars` must not be emitted.
- Use ISO dates (`YYYY-MM-DD`) in metadata and `# Last Updated` comments.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md), then follow [`docs/repository-documentation-architecture.md`](docs/repository-documentation-architecture.md).
