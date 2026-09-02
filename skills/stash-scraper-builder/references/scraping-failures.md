# Scraping Failures

Debug common scraping issues and failures.

## All fields empty

**Symptoms:** All scraped fields return empty/null values.

**Causes:**
- Selectors are wrong
- Age-gate or interstitial blocking access
- Site requires cookies or CDP that aren't configured

**Debug steps:**
1. `$x()` your selectors in browser console to verify they match
2. Check for age-gate or interstitial pages
3. Verify `useCDP` and cookie configuration
4. Check HTTP status codes (403 → User-Agent / headers issue)

## Only Date is nil

**Symptoms:** All fields scrape correctly except Date returns nil.

**Causes:**
- Raw date string doesn't match Go layout
- `replace` not applied before `parseDate`

**Debug steps:**
1. Check the raw date string format
2. Verify `parseDate` uses Go layout (`2006-01-02`), not `YYYY-MM-DD`
3. Apply `replace` before `parseDate` if needed (e.g., remove time, timezone)
4. Test with compact dates (`20060102`) if site uses that format

## Studio or Details wrong

**Symptoms:** Studio shows manufacturer when it should show label; Details has HTML tags.

**Causes:**
- Using メーカー (manufacturer) as studio when レーベル (label) is correct
- Not stripping HTML from Details field

**Debug steps:**
1. For JP sites: prefer レーベル over メーカー for Studio.Name
2. Use `concat` or post-process to strip HTML from Details
3. Check if シリーズ is being confused with Group (only use if user asks)

## Nil pointer dereference

**Symptoms:** Stash runtime crashes with "nil pointer dereference" error when processing scene metadata.

**Cause:** This may be an **upstream Stash bug** when `mappedScraper.processSceneRelationships` processes a fragment result with zero rows while the scene block defines relationships (Performers/Tags/Studio).

**Important:** This is not a scraper-authoring workaround. Adding `sceneByFragment` with relationship mappings can create the trigger condition rather than preventing it.

**Mitigation:**
- Test fragment modes against non-matching input before deployment
- Verify fragment scrapers return valid results on test scenes
- If a site doesn't support fragment scraping, omit `sceneByFragment`
- Report upstream to Stash issue tracker if encountered

**Reference:** Stash issue #6921

## 403 / Access denied

**Symptoms:** HTTP 403 errors when fetching pages.

**Causes:**
- Missing or incorrect User-Agent
- Site requires authentication (cookies)
- AJAX/JavaScript-rendered content

**Debug steps:**
1. Add custom User-Agent via `driver.headers`
2. Configure cookies if site requires login
3. Use CDP for JavaScript-rendered content
4. Add `sleep` between requests (min 1 second)

## Turnstile / reCAPTCHA

**Symptoms:** Site requires human verification

**Mitigation:**
- Use CDP with visible browser
- Solve CAPTCHA manually in browser
- Consider whether site is appropriate for automation

## Fragment queryURL note

For XPath/JSON fragment actions, include the required `queryURL` for the entry point and target site. Script actions follow their script contract. Do not add fragment entry points merely to address a runtime panic.

## References

- Stash issue #6921: https://github.com/stashapp/stash/issues/6921
- `references/cdp-workflow.md` — CDP configuration
- `references/script-actions.md` — Script scraper patterns
