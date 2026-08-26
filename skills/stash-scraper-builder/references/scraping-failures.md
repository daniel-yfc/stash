# Scraping failures (runtime)

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/11.2-scraping-failures

## Common failure modes

- 403 / user-agent / Cloudflare blocks
- Age-gate / interstitial pages
- Cookie expiry or missing `CookieURL`
- Site HTML changed → selector now empty
- `parseDate` mismatch → field becomes empty (no error)
- `replace` / `map` that does not match → original string passes through
- CDP connect failures
- Rate limiting / 429

## Diagnostic flow

1. **Check the HTTP status first** (Stash debug log or `curl -I`). Inspecting the body is wasted on a 4xx/5xx.
2. **403** → set a real browser User-Agent (Stash scraper settings) or per-scraper via `driver.headers` (see below). Cloudflare / Turnstile → visible CDP (`cdp-workflow.md`).
3. **AJAX-loaded content** → add `driver.sleep` (minimum `1` second) or switch to CDP; raw HTTP only sees the pre-JS page.
4. Compare view-source vs browser inspector (JS-rendered DOM). If the data lives in JSON-LD / `__NEXT_DATA__`, prefer `scrapeJson` or `script`.
5. Test selectors with `$x()` in the browser console.
6. Verify `parseDate` input format matches the Go reference string.
7. Reload scrapers after changes.
8. Re-run `sceneByURL` and check fields one by one.

## 403 quick reference

```yaml
driver:
  headers:
    - Key: "User-Agent"
      Value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
```

Use this flow when Date is `nil`, Details is empty, or Image is missing despite a visible value in the browser.
