# Stash Scraper Builder

> **Status:** ✅ All workstreams A-H complete (August 2026)

Build StashApp scrapers that conform to [CommunityScrapers schema](https://deepwiki.com/stashapp/CommunityScrapers/).

## Overview

This skill enables AI agents to generate, modify, and debug StashApp scrapers that:

- ✅ Load successfully (valid YAML, correct schema)
- ✅ Scrape successfully (proper selectors, post-processing)
- ✅ Follow community best practices (anchors, Last Updated, CamelCase)

## Completed Workstreams

| Phase | Workstream | Status | PR |
| --- | --- | --- | --- |
| P0 | **A** — Entry contract | ✅ | #1 |
| P0 | **B+C** — Templates & dates | ✅ | #2 |
| P1 | **D** — Validation truth | ✅ | #13 |
| P1 | **E** — Runtime modes | ✅ | #14 |
| P2 | **F** — Field quality | ✅ | #15 |
| P3 | **G** — Structure & community form | ✅ | #16 |
| P4 | **H** — Regression gate | ✅ | #17 |
| — | **CI** — Workflow optimization | ✅ | #18 |

## Key Features

### Entry Contract (A)
- Complete YAML output (no fragments)
- Mandatory `sceneByURL[].action/url/scraper` skeleton
- No invented search modes
- No root `name`, `documentHeader`, or `$vars`

### Templates & Dates (B+C)
- `scrapeJson` definitions in `jsonScrapers` only
- `parseDate` uses Go reference time (`2006-01-02`)
- `sceneByQueryFragment.queryURL` uses `{url}`

### Validation (D)
- Official CommunityScrapers schema is authoritative
- Local stub marked "non-authoritative"
- Cookie/CDP shape documented
- `url` arrays sorted A–Z (`validator -s`)

### Runtime Modes (E)
- CDP: Official settings path, visible Chrome
- Script: I/O contract, `# requires:`, error handling
- Failures: HTTP status → UA/CDP diagnosis

### Field Quality (F)
- Title cleaning: tags → extension → whitespace → trim
- Performer names: canonical JS, preserve `・` / `-`
- Default `Gender`: omitted

### Structure (G)
- YAML anchors (3+ reuse)
- `# Last Updated YYYY-MM-DD` at EOF
- CamelCase filenames
- `url` sorted A–Z
- No `subScraper` by default

### Regression Gate (H)
- Eval pack 5 tasks (XPath/JSON/Script/Date/CDP)
- Test matrix: 6 scenarios + network 3–5 domains
- Expected vs Actual verification

## CI Status

| Workflow | Trigger | Status |
| --- | --- | --- |
| `validate.yml` | Path-filtered (scrapers, validator, skills) | ✅ |
| `eval.yml` | Manual (`workflow_dispatch`) | ✅ |
| `link-check.yml` | Push/PR | ✅ |
| `site.yml` | Push/PR (GitHub Pages) | ✅ |

## Usage

### For AI Agents

1. Read `skills/stash-scraper-builder/SKILL.md`
2. Load reference files on demand (see load table in SKILL.md)
3. Follow the workflow: Inspect → Choose action → Build → Verify → Validate → Emit

### For Humans

- **Skill docs:** `skills/stash-scraper-builder/references/`
- **Validator:** `validator/validate.js`
- **Schema:** [CommunityScrapers](https://github.com/stashapp/CommunityScrapers/blob/develop/scraper.schema.json)

## References

- [CommunityScrapers DeepWiki](https://deepwiki.com/stashapp/CommunityScrapers/)
- [Scraper Schema](https://github.com/stashapp/CommunityScrapers/blob/develop/scraper.schema.json)
- [Validator Errors (zh-TW)](skills/stash-scraper-builder/references/validator-errors-zh-TW.md)

## License

Same as parent repo.
