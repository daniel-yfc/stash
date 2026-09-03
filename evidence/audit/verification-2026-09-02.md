# Verification Notes — 2026-09-02

## CDP Endpoint

- **Upstream baseline**: Stash login guide instructs setting Chrome CDP Path to `http://localhost:9222/json/version`.
- **Action**: Treat `http://localhost:9222/json/version` as the documented baseline.
- If any local doc uses `ws://localhost:9222`, flag it as an unverified deviation and annotate with the Stash version once tested on a live build.

## queryURL Placeholder — `{title}`

- **Upstream baseline**: CommunityScrapers uses `{}` for search terms and `{url}` for selected-result URLs.
- `{title}` is a fragment-property value relevant to `byFragment` entry points, not universally forbidden.
- **Action**: Do not blanket-ban `{title}`. Rewrite any local doc that categorically rejects it to say the behavior is entry-point-specific and requires validator confirmation.

## Files to update after live verification

| File | What to check |
|---|---|
| `cdp-workflow.md` | CDP attach path matches upstream baseline |
| `scraping-failures.md` | CDP error messages reference correct endpoint |
| `schema-checklist.md` | `{title}` rule is scoped, not global |
| `validator-errors-zh-TW.md` | Same as above |
| `json-patterns.md` | queryURL placeholder table is accurate |
