# Schema Validation Checklist

Use this checklist before emitting a scraper YAML file. Run `node validator/validate.js` after each change.

## Required Structure

- [ ] `name` key present and matches CamelCase filename
- [ ] At least one entry point (`sceneByURL`, `sceneByName`, etc.)
- [ ] Each entry has `action`, `url` (array), and `scraper` reference
- [ ] No root keys `documentHeader` or `$vars`
- [ ] `url` arrays are sorted A–Z (`validator -s`)

## Scraper Definition

- [ ] All referenced keys exist (no dangling refs)
- [ ] XPath selectors tested with `$x("...")` on live pages
- [ ] JSON paths tested on real API responses
- [ ] No invented search modes (`sceneByName` / `sceneByQueryFragment` without real search)

## Data Model

- [ ] Title cleaned per `title-patterns.md`
- [ ] Date uses Go layout (`2006-01-02`), not `YYYY-MM-DD`
- [ ] Studio mapping correct (メーカー ≠ レーベル / シリーズ)
- [ ] Image uses `|` fallbacks, upgrades `/thumb/` → `/poster/`, prefixes `^//` with `https:`
- [ ] Performers cleaned per `performer-cleaning.md`, no default `Gender`

## Driver Configuration Rules

- [ ] `driver.useCDP` (if present) is in the top-level `driver` block only, not inside any entry point
- [ ] Public scrapers (`scrapers/*.yml`) do not contain `driver.cookies`
- [ ] Session cookies appear only in `scrapers/private/*.yml`

## Output

- [ ] Key fields (Title, Date, Studio, Image) match expected values on tested pages
- [ ] Untested selectors marked `# UNVERIFIED`
- [ ] `# Last Updated YYYY-MM-DD` at end of file (optional but recommended)
- [ ] Explanations in English + short zh-TW orientation; scraped values in source language
