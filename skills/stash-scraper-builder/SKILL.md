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
**Source policy:** Normative schema/runtime claims require a source citation. Experience-based recommendations are labeled `Heuristic` and require live verification.

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

**Source:** Official CommunityScrapers schema — root `name` is required and unknown root keys are rejected (`additionalProperties: false`).

### Prohibited patterns

- Do **not** emit root keys `documentHeader` or `$vars`. Root `name` is required by the official schema; conventionally match the CamelCase filename. **Source:** official schema (`required: [name]`, `additionalProperties: false`).
- URL actions: `url` is an array (case-sensitive contains-match). **Source:** official schema, `definitions.anyByURL.url`.
- Do not invent search modes (`sceneByName` / `sceneByQueryFragment`) unless the site actually has search. **Heuristic:** verify the real endpoint before adding these modes.
- For `scrapeXPath`/`scrapeJson` fragment entry points, provide the action-required `queryURL`. URL entry points may optionally use `queryURL`/`queryURLReplace` when translating a page URL to a data endpoint. Script actions follow their script contract. **Source:** official schema `definitions.anyByURL` and `definitions.anyByFragment`.

---

## Workflow

### Step 1: Identify the site

- Confirm the site URL and whether it has search functionality.
- Check if the site returns HTML or JSON.
- Note any restrictions (age-gate, cookie requirement, CDP needed).

**Heuristic:** Site capability must be established from a live page/response or an authoritative site source; do not infer it from the domain name.

### Step 2: Choose the mode

- **HTML site** → `scrapeXPath` with `xPathScrapers`
- **JSON API** → `scrapeJson` with `jsonScrapers`
- **Requires Python** → `script` scraper (see `references/script-actions.md`)
- **Requires visible browser** → `driver` with `useCDP: true` (see `references/cdp-workflow.md`)

**Source:** Official schema action enums plus Stash scraper-development documentation; see `references/UPSTREAM_SOURCES.md`.

### Step 3: Build the YAML

1. Start with the mandatory skeleton above.
2. Add `sceneByURL` entries for each URL pattern.
3. Define the scraper (`xPathScrapers` or `jsonScrapers`).
4. Add `driver` config if needed (cookies, CDP, headers).

### Step 4: Validate

- Run `node validator/index.mjs scrapers` locally if possible.
- Run `node validator/index.mjs -s scrapers` for URL ordering.
- Run `python tools/check_scraper_docs.py` after changing reference documentation or embedded examples.
- Check that all referenced keys exist (no dangling refs).

**Source:** Repository validator workflow and official schema. The documentation checker is a repository safeguard; it is not an upstream Stash feature.

---

## Data model reminders

- **Title**: Clean per `references/title-patterns.md`. Do not translate. **Heuristic:** cleaning is site-dependent; verify against expected pages.
- **Date**: Use Go layout (`2006-01-02`), not `YYYY-MM-DD`. **Source:** Stash scraper-development behavior; see `references/date-formats.md`.
- **Studio**: Prefer `Studio.Name.fixed` for single-brand sites. Map JP terms (メーカー/レーベル/シリーズ) per `references/best-practices.md`. **Heuristic:** field semantics must be confirmed from the site's labels/context.
- **Image**: Use `|` fallbacks; upgrade `/thumb/` → `/poster/`; prefix `^//` with `https:`. **Heuristic:** fallback and quality choices are authoring guidance; verify the resulting URL.
- **Performers**: Clean per `references/performer-cleaning.md`. Do not write `Gender` by default. **Heuristic:** normalization is only safe when the source naming pattern is verified.

---

## Troubleshooting

- **All fields empty** — `$x()` the selectors; check age-gate / interstitial; check `useCDP` / cookies. See `references/scraping-failures.md`. **Source:** troubleshooting guidance; live-test the selector.
- **Only Date is nil** — raw string vs Go layout; `replace` before `parseDate`. See `references/date-formats.md` and `references/post-processing.md`. **Source:** official post-processing order and Go layouts.
- **Studio or Details wrong** — do not use メーカー as studio when レーベル / シリーズ is the label; strip HTML from Details. **Heuristic:** confirm the site's labels before mapping.
- **Nil pointer dereference** — This is an upstream Stash bug reported in issue #6921. It can occur when a fragment scraper returns zero rows while the scene block defines relationships (Performers/Tags/Studio). Test non-matching fragment input before deployment; do not add `sceneByFragment` as a workaround. See `references/scraping-failures.md`. **Source:** Stash issue #6921.

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

**Source registry:** `references/UPSTREAM_SOURCES.md` records the authoritative source for each normative area.

---

## Output rules

- Explanations: English plus a short zh-TW orientation. Scraped values stay in the source language — do not translate titles, performers, dates, or details.
- Emit the entire YAML; min change. Mark untested selectors with `# UNVERIFIED`.
- New files: `URLs` + `Groups` / `groupByURL`. Do not add new `Movies` / `movieByURL`.

**Heuristic:** Field-quality and selector choices are recommendations, not schema guarantees; live verification is required before marking them verified.

---

## Definition of Done

- [ ] YAML validates with `node validator/index.mjs`
- [ ] `sceneByURL` has at least one entry with `action`, `url` array, and `scraper`
- [ ] No invented search modes
- [ ] No root `documentHeader` or `$vars`
- [ ] `url` arrays sorted A–Z
- [ ] Key fields (Title, Date, Studio, Image) match expected values on tested pages
- [ ] Driver configuration follows rules: `useCDP` only in top-level `driver`, no `driver.cookies` in public scrapers
- [ ] Scraped values not translated
- [ ] `python tools/check_scraper_docs.py` passes when documentation/examples changed

**Source:** Official schema/validator for structure; live-page verification for extracted values; repository checker for documentation regression.

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

**Source:** Structural and date rules are official-schema or Stash-development-backed; site capability, selector stability, studio semantics, and quality rules are `Heuristic` guidance and require live verification. Runtime panic guidance cites Stash issue #6921 in `scraping-failures.md`.

---

## Notes

- The official CommunityScrapers schema and validator take precedence over local stubs and prose.
- This skill is for generating scrapers that load in Stash. CommunityScrapers PR submission is a separate process.
- Before changing a normative rule, verify it against `references/UPSTREAM_SOURCES.md` and add a nearby `Source:` or `Heuristic:` label.
