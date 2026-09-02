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
- [ ] Run `pytest` — all tests pass
- [ ] Check links in Markdown: `lychee .` (optional)

## Pull Requests

- PRs to `scrapers/`, `skills/`, or `validator/` require maintainer review (see `.github/CODEOWNERS`)
- CI runs automatically:
  - `validate.yml` — schema + URL sorting
  - `test-eval.yml` — Python tests
  - `link-check.yml` — Markdown links
  - `pr-check.yml` — combined status check
- All CI checks must pass before merge

## Code Style

- YAML: 2-space indentation, sorted URL arrays
- Python: follow `pytest` conventions in `tests/`
- Markdown: links checked by CI, use relative paths for internal links

## Questions?

Open an issue or reach out to `@daniel-yfc`.
