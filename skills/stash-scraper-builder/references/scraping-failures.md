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

1. Check Stash debug logs for the scraper run.
2. Compare view-source vs browser inspector (JS-rendered DOM).
3. Test selectors with `$x()` in the browser console.
4. Verify `parseDate` input format matches the Go reference string.
5. Reload scrapers after changes.
6. Re-run `sceneByURL` and check fields one by one.

Use this flow when Date is `nil`, Details is empty, or Image is missing despite a visible value in the browser.
