# Schema Checklist

Validate scraper YAML against the official CommunityScrapers schema before emitting.

## Before emit

- [ ] Return the entire YAML; do not return a fragment or diff.
- [ ] Root has no `documentHeader` or `$vars` key. **Root `name` is required** and should match the CamelCase filename.
- [ ] Implement only modes the site really supports.
- [ ] Stable detail URL → `sceneByURL` entry point has `action`, `url` array, and `scraper`.
- [ ] The referenced scraper exists in `xPathScrapers` for `scrapeXPath`, or `jsonScrapers` for `scrapeJson`.

## Schema conformance

- [ ] `name` field present at root level (required by official schema)
- [ ] `url` is an array (case-sensitive contains-match)
- [ ] No invented keys (e.g., `documentHeader`, `$vars`)
- [ ] `additionalProperties: false` — no extra keys at any level
- [ ] All referenced keys exist (no dangling refs)

## Mode validation

- [ ] `sceneByURL` — at least one entry with `action`, `url`, `scraper`
- [ ] `sceneByName` — only if site has search; requires `sceneByQueryFragment`
- [ ] `sceneByFragment` — only if site supports fragment scraping
- [ ] No `scene:` at entry point (must be under `xPathScrapers` or `jsonScrapers`)

## queryURL rules

- [ ] `sceneByName.queryURL` = `{}` (empty object for search endpoint)
- [ ] `sceneByQueryFragment.queryURL` = `{url}` (selected hit URL)
- [ ] `{title}` is an official placeholder for `sceneByFragment`; use it only where that mode supports it
- [ ] `queryURLReplace` keys are custom names (e.g., `id`, `slug`), not used on `sceneByName`

## Driver configuration

- [ ] `useCDP: true` only in top-level `driver` (not in `driver.cookies`)
- [ ] `CookieURL` required when `useCDP: false`; forbidden when `useCDP: true`
- [ ] `clicks` only with `useCDP: true`
- [ ] No `driver.cookies` in public scrapers

## Post-processing

- [ ] `parseDate` uses Go layout (`2006-01-02`), not `YYYY-MM-DD`
- [ ] `concat` at attribute level, not inside `postProcess`
- [ ] `postProcess[]` operators in correct order (specific → general)
- [ ] No timezone conversion in YAML (strip `+0900` / `JST` / time; keep site calendar day)

## Final checks

- [ ] `url` arrays sorted A–Z (`validator -s`)
- [ ] `# Last Updated YYYY-MM-DD` at end of file (optional but recommended)
- [ ] No translated scraped values
- [ ] `# UNVERIFIED` on untested selectors

## References

- Official schema: https://github.com/stashapp/CommunityScrapers/blob/master/src/scraper.schema.json
- Validator: `node validator/validate.js scrapers/Foo.yml`
