# Contributing

Thanks for contributing to Stash Scraper Builder!

## Quick Start

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   # Node.js (validator)
   npm install

   # Python (tests)
   pip install -r requirements.txt
   ```
3. Create a branch: `git checkout -b feat/my-scraper`

## Making Changes

### Adding a Scraper

1. Create `scrapers/MyScraper.yml`
2. Validate locally: `npm run validate`
3. Check URL sorting: `npm run validate-sort`
4. Test on live pages

### Modifying the Skill

1. Edit files in `skills/stash-scraper-builder/`
2. Ensure all references remain valid
3. Update `AGENTS.md` if rules change

## Before You Push

- [ ] Run `npm run validate` — no schema errors
- [ ] Run `npm run validate-sort` — URLs sorted A–Z
- [ ] Run `python tools/check_scraper_docs.py` when documentation/examples change
- [ ] Run `pytest` — all tests pass
- [ ] Check links in Markdown: `lychee .` (optional)

## Pull Requests

- PRs to `scrapers/`, `skills/`, or `validator/` require maintainer review (see `.github/CODEOWNERS`)
- CI runs automatically:
  - `validate.yml` — schema + URL sorting
  - `test-eval.yml` — Python tests
  - `link-check.yml` — Markdown links
  - `pr-check.yml` — scraper and documentation checks
- All CI checks must pass before merge

## Code Style

- YAML: 2-space indentation, sorted URL arrays
- Python: follow `pytest` conventions in `tests/`
- Markdown: links checked by CI, use relative paths for internal links

## Evidence and source policy

Use this source hierarchy when authoring or changing scraper guidance:

1. Official CommunityScrapers schema and validator.
2. Official Stash scraper-development documentation.
3. Upstream Stash issues or source for runtime behavior.
4. Project references and examples.
5. Heuristics, explicitly labeled `Heuristic`.

- Normative schema/runtime rules must include a nearby source citation or point to `skills/stash-scraper-builder/references/UPSTREAM_SOURCES.md`.
- Experience-based recommendations must be labeled `Heuristic`; do not present them as schema behavior or runtime causality.
- Search the full `skills/stash-scraper-builder/` tree for duplicated wording before changing a rule.
- Keep complete YAML examples copy-paste-valid and include the required root `name:` field.
- If project guidance conflicts with an authoritative source, correct the project guidance first.

## Runtime claims

Do not claim a configuration prevents a runtime crash without a reproducible test or authoritative upstream evidence. For upstream bugs, cite the issue and document the trigger and mitigation separately.

## Pull-request evidence

Describe the authoritative source for behavior changes, list validation commands run, and note any remaining unverified live-page selectors.

## Questions?

Open an issue or reach out to `@daniel-yfc`.
