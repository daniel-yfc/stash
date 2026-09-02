---
name: stash-scraper-builder
description: >-
  Build, modify, validate, and debug StashApp scraper YAML files using XPath,
  JSON, script, and CDP modes. Use when creating a scraper for a supported
  site, fixing empty fields, nil dates, or nil pointer errors, validating
  scraper YAML, or mapping studio, performer, or group extraction.
  Do not use for generic web scraping, generic YAML, Identify or stash-box
  scrapers, fabricated search endpoints, or CommunityScrapers PR submission.
metadata:
  version: "2026-09-03"
  canonical-schema: "https://github.com/stashapp/CommunityScrapers/blob/master/src/scraper.schema.json"
---
# Skill: stash-scraper-builder

**Version**: 2026-09-03
**Scope**: Generate Stash scraper YAML files that load and scrape correctly.
**Canonical runtime**: Official CommunityScrapers validator and schema.

---

## Entry contract

When the user requests a new scraper, emit a complete YAML file following this structure:

### Mandatory skeleton

```yaml
name: ExampleScraper  # Required: matches CamelCase filename
sceneByURL:
  - action: scrapeXPath
    url:
      - example.com
    scraper: xPathScrapers

xPathScrapers:
  scene:
    # ... scraper definition
```

### Prohibited patterns

- Do **not** emit root keys `documentHeader` or `$vars`. Root `name` is required by the official schema; conventionally match the CamelCase filename.
- URL actions: `url` is an array (case-sensitive contains-match).
- Do not invent search modes (`sceneByName` / `sceneByQueryFragment`) unless the site actually has search.
- For XPath/JSON fragment entry points, provide the action-required `queryURL`; script actions may use their script contract instead.

---

## Workflow

### Step 1: Identify the site

- Confirm the site URL and whether it has search functionality.
- Check if the site returns HTML or JSON.
- Note any restrictions (age-gate, cookie requirement, CDP needed).

### Step 2: Choose the mode

- **HTML site** → `scrapeXPath` with `xPathScrapers`
- **JSON API** → `scrapeJson` with `jsonScrapers`
- **Requires Python** → `script` scraper (see `references/script-actions.md`)
- **Requires visible browser** → `driver` with `useCDP: true` (see `references/cdp-workflow.md`)

### Step 3: Build the YAML

1. Start with the mandatory skeleton above.
2. Add `sceneByURL` entries for each URL pattern.
3. Define the scraper (`xPathScrapers` or `jsonScrapers`).
4. Add `driver` config if needed (cookies, CDP, headers).

### Step 4: Validate

- Run `node validator/validate.js scrapers/Foo.yml` locally if possible.
- Prefer the official CommunityScrapers validator and schema over the bundled local stub.
- Check that all referenced keys exist (no dangling refs).
- Ensure `url` arrays are sorted A–Z (`validator -s`).

---

## Data model reminders

- **Title**: Clean per `references/title-patterns.md`. Do not translate.
- **Date**: Use Go layout (`2006-01-02`), not `YYYY-MM-DD`. See `references/date-formats.md`.
- **Studio**: Prefer `Studio.Name.fixed` for single-brand sites. Map JP terms (メーカー/レーベル/シリーズ) per `references/best-practices.md`.
- **Image**: Use `|` fallbacks; upgrade `/thumb/` → `/poster/`; prefix `^//` with `https:`.
- **Performers**: Clean per `references/performer-cleaning.md`. Do not write `Gender` by default.

---

## Troubleshooting

- **All fields empty** — `$x()` the selectors; check age-gate / interstitial; check `useCDP` / cookies. See `references/scraping-failures.md`.
- **Only Date is nil** — raw string vs Go layout; `replace` before `parseDate`. See `references/date-formats.md` and `references/post-processing.md`.
- **Studio or Details wrong** — do not use メーカー as studio when レーベル / シリーズ is the label; strip HTML from Details.
- **Nil pointer dereference** — This may be an upstream Stash bug when a fragment scraper returns zero rows while the scene block defines relationships (Performers/Tags/Studio). Test non-matching fragment input before deployment and report upstream failures; do not add `sceneByFragment` as a workaround. See `references/scraping-failures.md`.

---

## Reference files

Load these files as needed for specific guidance:

| File | Load when |
|------|-----------|
| `best-practices.md` | Studio mapping, anchors, `# Last Updated`, image upgrades |
| `cdp-workflow.md` | Site requires visible browser, login, or CDP |
| `date-formats.md` | Date parsing (Go layouts, not `YYYY-MM-DD`) |
| `examples.md` | Complete YAML templates (XPath, JSON, script) |
| `json-examples.md` | JSON scraper templates |
| `json-patterns.md` | JSON path patterns, `queryURL` rules |
| `multi-site-network-scrapers.md` | Network sites with shared templates |
| `performer-cleaning.md` | Performer name normalization |
| `post-processing.md` | `postProcess[]` operators, order of operations |
| `schema-checklist.md` | Pre-emit validation checklist |
| `script-actions.md` | Python script scrapers, I/O format |
| `scraping-failures.md` | Debug empty fields, nil pointer panics |
| `title-patterns.md` | Title cleaning patterns |
| `validator-errors-zh-TW.md` | Validator error messages (Chinese) |
| `xpath-patterns.md` | XPath selector patterns, verification steps |

---

## Output rules

- Explanations: English plus a short zh-TW orientation. Scraped values stay in the source language — do not translate titles, performers, dates, or details.
- Emit the entire YAML; min change. Mark untested selectors with `# UNVERIFIED`.
- New files: `URLs` + `Groups` / `groupByURL`. Do not add new `Movies` / `movieByURL`.

---

## Definition of Done

- [ ] YAML validates with the official validator or the local stub with limitations documented
- [ ] Root `name` is present and conventionally matches the CamelCase filename
- [ ] `sceneByURL` has at least one entry with `action`, `url` array, and `scraper`
- [ ] No invented search modes
- [ ] No root `documentHeader` or `$vars
- [ ] Fragment XPath/JSON modes include the required `queryURL`; script exceptions follow the script contract
- [ ] `url` arrays sorted A–Z
- [ ] Key fields (Title, Date, Studio, Image) match expected values on tested pages
- [ ] Driver configuration follows rules: `useCDP` only in top-level `driver`, no `driver.cookies` in public scrapers
- [ ] Scraped values not translated
- [ ] `# Last Updated YYYY-MM-DD` at end of file (optional but recommended)

---

## Anti-patterns

- ❌ Inventing search modes when the site has no search
- ❌ Using `subScraper` by default (only when value exists solely on another page)
- ❌ Writing `Gender` by default (omit unless site is single-gender with stated reason)
- ❌ Using `YYYY-MM-DD` for `parseDate` (use Go layout: `2006-01-02`)
- ❌ Putting `concat` inside `postProcess` (use attribute-level `concat`)
- ❌ Adding `sceneByFragment` without verified fragment support or required queryURL
- ❌ Treating `sceneByFragment` as a nil-pointer workaround
- ❌ Pointing `sceneByQueryFragment.queryURL` at a search endpoint (use `{url}` for the selected hit)

---

## Notes

- The official CommunityScrapers schema and validator take precedence over local stubs and prose.
- This skill is for generating scrapers that load in Stash. CommunityScrapers PR submission is a separate process.
