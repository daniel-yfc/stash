# Schema checklist

**Load when:** every final YAML output.

> **概要（zh-TW）：** 最終輸出前依此檢查。CommunityScrapers 官方 schema 與 validator 才是權威；本 repo 的 `references/scraper.schema.json` 只是離線提示，不能當合併依據。

## Authority and validation

Canonical references:

- https://deepwiki.com/stashapp/CommunityScrapers/8-configuration-reference
- https://deepwiki.com/stashapp/CommunityScrapers/9-validation-system
- https://deepwiki.com/stashapp/CommunityScrapers/9.3-validator-usage

Use the official CommunityScrapers validator for a merge decision. The local schema stub is deliberately incomplete and must **not** override official schema, validator business rules, or a validated upstream example.

```text
# Run the validator supplied by CommunityScrapers against the scraper directory.
# Use its sorting check (-s) before submitting a new or changed scraper.
```

## Before emit

- [ ] Return the entire YAML; do not return a fragment or diff.
- [ ] Root has no `name`, `documentHeader`, or `$vars` key.
- [ ] Implement only modes the site really supports.
- [ ] Stable detail URL → `sceneByURL` entry point has `action`, `url` array, and `scraper`.
- [ ] The referenced scraper exists in `xPathScrapers` for `scrapeXPath`, or `jsonScrapers` for `scrapeJson`.
- [ ] `sceneByName` is present only with `sceneByQueryFragment`; if no real search exists, omit both.
- [ ] `sceneByName.queryURL` uses `{}` only and has no `queryURLReplace`.
- [ ] `sceneByQueryFragment.queryURL` uses `{url}` (or a `{url}` rewrite). `{title}` is **not** a queryURL placeholder.
- [ ] `queryURLReplace` keys are custom capture names such as `id` or `slug`, not official placeholders.
- [ ] Every URL action has `url:` as an array of case-sensitive path fragments.
- [ ] URL patterns are unique within the same entity type and sorted ascending alphabetically for validator `-s`.
- [ ] `concat` is an attribute next to `selector`, never an item inside `postProcess`.
- [ ] Each `postProcess` array item has exactly one operation.
- [ ] New files use `URLs` and `Groups` / `groupByURL`, not legacy `URL` or `Movies` / `movieByURL`.
- [ ] Every selector is live-tested or marked `# UNVERIFIED` with an explanation.

## Cookie / CDP coupling

Use `driver.cookies` only when the site actually needs it. Do not invent session credentials.

| Driver mode | CookieURL | Clicks |
| --- | --- | --- |
| `useCDP: false` or omitted | Required for each configured cookie | Not available |
| `useCDP: true` | Forbidden | Allowed for visible-browser interactions |

Rules:

- `CookieURL` identifies the URL at which Stash sets a configured cookie.
- A CDP scraper inherits the browser session; do not add `CookieURL` when `useCDP: true`.
- `driver.clicks` requires `useCDP: true`. Add a suitable `driver.sleep` when the page needs time to render after a click.
- Keep actual cookie values out of a community scraper. Explain the local setup instead.

## Entity and field reminders

- Scene: no required fields.
- Performer / Group / Studio / Tag: `Name` only.
- Gallery: `Title` only. Image: no required fields.
- Keep `Country`, `Ethnicity`, and `Gender` under `Performers`, never at scene root.
- `performerByFragment` is script-only for this skill; do not emit XPath or JSON for it.

## Final runtime check

- [ ] Reload scrapers after YAML changes.
- [ ] Run `sceneByURL` on real URLs and inspect Stash debug logs.
- [ ] Check Title, Date, Studio, Image, Details, Performers, and Tags against expected values.
- [ ] Validator passing does not prove selector correctness; an empty selector is still a failed scraper.
