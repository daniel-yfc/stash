# Stash Scraper Builder

A collection of StashApp scrapers with a focus on correctness, maintainability, and validation.

## Documentation layers

- [`AGENTS.md`](AGENTS.md) — repository-wide agent boundaries and safety rules.
- [`CLAUDE.md`](CLAUDE.md) — Claude-specific repository instructions; defer to `AGENTS.md` for shared rules.
- [`docs/README.md`](docs/README.md) — human-readable repository documentation index.
- [`docs/index.yml`](docs/index.yml) — machine-readable documentation registry for agents and CI.
- [`docs/repository-documentation-architecture.md`](docs/repository-documentation-architecture.md) — documentation numbering, naming, metadata, routing, and formatter policy.
- [`templates/README.md`](templates/README.md) — copyable scraper scaffolds and template relationships.
- [`skills/stash-scraper-builder/SKILL.md`](skills/stash-scraper-builder/SKILL.md) — scraper-builder skill contract.
- [`skills/stash-scraper-builder/references/`](skills/stash-scraper-builder/references/) — specialized scraper authoring references.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution and review workflow.

## Repository structure

- `scrapers/` — public scraper YAML files.
- `scrapers/private/` — private scraper YAML files; authentication material is restricted here.
- `templates/` — YAML/Python scaffolds; templates are not verified scrapers.
- `skills/stash-scraper-builder/` — skill definition and specialized references.
- `docs/` — repository-level workflow and architecture documentation.
- `validator/` — executable Node validator and validator schema.
- `tools/` — repository inspection, validation, documentation, and live-scrutiny utilities.
- `tools/tests/` — Python tests and regression checks.
- `evidence/` — historical audit evidence; not a live policy source.

## Quick start

Install dependencies:

```bash
npm ci || npm install
python -m pip install -r requirements.txt
```

Validate all scrapers with the official Node validator:

```bash
npm run validate
```

Check URL ordering:

```bash
npm run validate-sort
```

Check formatting:

```bash
npm run format:check
```

Run Python tests and documentation checks:

```bash
python -m pytest tools/tests/
python tools/check_scraper_docs.py
python tools/check_docs_index.py
```

Run quality and live-scrutiny workflows:

```bash
bash tools/validate-all.sh
node tools/scrutiny.js scrapers/<Scraper>.yml --search
```

The official Node/Ajv validator and schema are authoritative. Do not add a second local validator or schema fork.

## End-to-end workflow

1. Start from the appropriate template in `templates/`, or inspect an existing scraper.
2. Rename YAML using the site’s CamelCase name and keep the required root `name:`.
3. Select the smallest verified runtime path: XPath, JSON, script, or CDP.
4. Read repository-level guidance, then the skill and its specialized references.
5. Keep public/private authentication boundaries intact.
6. Validate with the official CommunityScrapers schema/validator.
7. Run URL sorting, tests, documentation checks, documentation-index checks, and the quality gate.
8. Run live scrutiny when the target site is accessible.
9. Record unverified selectors, live-page assumptions, and source provenance.

## Naming and format rules

- New Markdown filenames use lowercase kebab-case, except the existing numbered `docs/` series.
- Scraper and template YAML filenames use CamelCase site/object names with `.yml`.
- Python implementation filenames use CamelCase matching the paired YAML/dependency name with `.py`.
- Root scraper YAML must contain `name:`; unsupported `documentHeader` and `$vars` must not be emitted.
- Use ISO dates (`YYYY-MM-DD`) in metadata and `# Last Updated` comments.
- Documentation IDs, metadata, indexing, and formatter rules are defined in [`docs/repository-documentation-architecture.md`](docs/repository-documentation-architecture.md).

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md), then follow [`docs/repository-documentation-architecture.md`](docs/repository-documentation-architecture.md).
