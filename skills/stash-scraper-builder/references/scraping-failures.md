# Scraping Failures

> **刮削失敗診斷指南。**

## All Fields Empty

**Symptoms:** Every field returns empty string or null.

**Causes:**
1. **Age gate / interstitial blocking** — page requires login or age verification
2. **Wrong selectors** — XPath/JSON path doesn't match the actual DOM structure
3. **HTTP vs rendered DOM mismatch** — site uses JavaScript to render content
4. **CDP not configured** — site requires browser session but scraper uses HTTP

**Diagnosis:**
- Check HTTP status code (403, 401, 503 indicate blocking)
- Test selectors with `$x("...")` in browser console
- Compare raw HTML response with browser DevTools DOM
- Verify `driver.useCDP` is in top-level `driver` block (not entry points)

**Solutions:**
- Add age-gate handling or CDP session
- Fix selectors to match actual DOM
- Enable CDP if site requires JavaScript rendering
- Check cookie configuration (private scrapers only)

## Nil Pointer Dereference

**Symptoms:** Stash runtime crashes with "nil pointer dereference" error when processing scene metadata.

**Cause:** Missing `sceneByFragment` entry point when the site supports fragment-based scraping.

**Background:**
- Stash processes scene metadata through multiple entry points
- When a scraper provides `sceneByURL` but not `sceneByFragment`, and the site's data structure expects fragment processing, Stash may encounter nil pointers
- This is a runtime safety issue, not a schema validation error

**Solution:**
- Add `sceneByFragment` entry point alongside `sceneByURL`
- Ensure `sceneByFragment` uses the same scraper definition or a fragment-specific variant
- Example:
  ```yaml
  sceneByURL:
    - action: scrapeXPath
      url:
        - "example.com/video/"
      scraper: sceneScraper
  
  sceneByFragment:
    action: scrapeXPath
    scraper: sceneScraper
  ```

**Prevention:**
- When building scrapers for sites that support fragment-based metadata, always include `sceneByFragment`
- Test scraper in Stash with existing scene metadata to verify fragment handling
- See `SKILL.md` → "Runtime Safety Rules" for mandatory guidance

## Only Date is Nil

**Symptoms:** All fields scrape correctly except Date returns null.

**Causes:**
1. **Wrong Go layout** — using `YYYY-MM-DD` instead of `2006-01-02`
2. **Raw string format mismatch** — date string doesn't match expected layout
3. **Missing `replace` preprocessing** — need to clean date string before `parseDate`

**Solutions:**
- Use Go reference time: `2006-01-02` for `YYYY-MM-DD`, `01/02/2006` for `MM/DD/YYYY`
- Add `replace` block before `parseDate` to normalize format
- Check for relative dates ("3 days ago") — may need JavaScript conversion

## Studio or Details Wrong

**Symptoms:** Studio field shows manufacturer instead of label; Details includes HTML or scene list.

**Causes:**
1. **Wrong selector** — targeting メーカー (manufacturer) instead of レーベル (label)
2. **HTML not stripped** — Details field includes markup
3. **Scene list included** — Details cuts off before numbered scene enumeration

**Solutions:**
- Use correct label selector (last `#topicpath` link, not manufacturer block)
- Add HTML stripping in post-processing
- Cut Details before numbered scene list (see `title-patterns.md`)

## HTTP Status Failures

**403 Forbidden:**
- Site blocking automated requests
- Try CDP mode with visible Chrome
- Check User-Agent header

**401 Unauthorized:**
- Login required
- Configure CDP session or cookies (private scrapers)

**503 Service Unavailable:**
- Site temporarily down or rate-limiting
- Retry with delays or use CDP

## CDP-Specific Issues

**Chrome not connecting:**
- Verify Chrome launched with `--remote-debugging-port=9222`
- Check Stash CDP path: `ws://localhost:9222`
- Ensure Chrome window is visible (not headless)

**Session expires:**
- CDP sessions persist in browser, not YAML
- Re-login in Chrome when sessions expire
- Do not embed session tokens in public scrapers

## Verification Checklist

Before marking scraper as complete:

- [ ] Test on 3+ real URLs per mode
- [ ] Verify key fields (Title, Date, Studio, Image) match expected values
- [ ] Check all selectors with `$x()` or JSON path tools
- [ ] Confirm `driver.useCDP` placement (top-level only, if needed)
- [ ] Ensure no `driver.cookies` in public scrapers
- [ ] Add `sceneByFragment` if site supports fragment-based scraping
- [ ] Run validator to catch schema errors
- [ ] Mark unverifiable selectors with `# UNVERIFIED`

## Related References

- `SKILL.md` — Always-on rules and workflow
- `schema-checklist.md` — Validation requirements
- `cdp-workflow.md` — CDP configuration guide
- `date-formats.md` — Date parsing patterns
- `best-practices.md` — Maintainability guidelines
