---
name: stash-scraper-builder
description: Generate, modify, and debug StashApp scraper YAML files (XPath, JSON, script, and CDP driver modes) conforming to scraper.schema.json. Use when building a scraper for a new site, fixing empty fields or nil dates, or validating scraper YAML. Not for CommunityScrapers PR submission, non-Stash YAML, stash-box/Identify scrapers, or generic crawling.
metadata:
  version: "2026-08-30"
---

# Skill: stash-scraper-builder

**Version**: 2026-08-30
**Scope**: Generate Stash scraper YAML files that load and scrape correctly.
**Canonical source**: https://github.com/stashapp/CommunityScrapers (schema: `src/scraper.schema.json`). Docs mirror: https://deepwiki.com/stashapp/CommunityScrapers/

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

- Do **not** emit root keys `documentHeader` or `$vars`. The filename is the scraper name. `#` comments are allowed.
- URL actions: `url` is an array (case-sensitive contains-match).
- Do not invent search modes (`sceneByName` / `sceneByQueryFragment`) unless the site actually has search.

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
- **Nil pointer dereference** — This is an upstream Stash bug (v0.31.1+) that occurs when a fragment scraper returns zero rows while the scene block defines relationships (Performers/Tags/Studio). Mitigate by testing fragment modes against non-matching input before deployment. See `references/scraping-failures.md`.

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

- [ ] YAML validates with `node validator/validate.js`
- [ ] `sceneByURL` has at least one entry with `action`, `url` array, and `scraper`
- [ ] No invented search modes
- [ ] No root `documentHeader` or `$vars`
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
- ❌ Adding `sceneByFragment` as a preventive measure for nil pointer panics (this is an upstream Stash bug; test fragment modes against non-matching input instead)
- ❌ Pointing `sceneByQueryFragment.queryURL` at a search endpoint (use `{url}` for the selected hit)

---

## Notes

- Official schema wins over local stub. If in doubt, check https://github.com/stashapp/CommunityScrapers/blob/master/src/scraper.schema.json
- This skill is for generating scrapers that load in Stash. CommunityScrapers PR submission is a separate process.
