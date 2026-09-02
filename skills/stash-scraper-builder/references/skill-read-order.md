# Skill Read Order

Read references in this order before creating or revising a scraper.

## Always read first

1. `out-of-scope.md` — confirm the task belongs to this skill
2. `source-selection.md` — choose XPath, JSON, script, or CDP
3. `phase0-secrets-policy.md` — if the task touches login state, cookies, or private files

## Then read by path

| Task type | Read next |
|---|---|
| New XPath scraper | `xpath-patterns.md` → `schema-checklist.md` → `post-processing.md` |
| New JSON scraper | `json-patterns.md` → `schema-checklist.md` → `post-processing.md` |
| Script scraper | `script-actions.md` → `schema-checklist.md` |
| CDP / login scraper | `cdp-workflow.md` → `phase0-secrets-policy.md` → `schema-checklist.md` |
| Dates / post-processing | `date-formats.md` → `post-processing.md` |
| Advanced patterns | `advanced-patterns.md` (anchors, studio map, subScraper) |

## Before editing any reference doc

Read `UPSTREAM_SOURCES.md` and verify the claim against the pinned upstream source before changing it.
