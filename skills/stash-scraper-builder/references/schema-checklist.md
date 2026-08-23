# Schema Checklist

**Load when:** every final YAML output.

> **概要（zh-TW）：** 輸出前逐項勾選。`scraper.schema.json` 優先於任何文件或範例。

Schema: `references/scraper.schema.json` (local stub) + live https://github.com/stashapp/CommunityScrapers/blob/master/validator/scraper.schema.json

Validate (from that repo):

```
deno run -R=scrapers -R=validator/scraper.schema.json validate.js scrapers/xxx.yml
```

## Before emit

- [ ] Entire YAML file; unrelated content copied verbatim
- [ ] Only modes the site actually supports
- [ ] `sceneByName` present ⇒ `sceneByQueryFragment` present; otherwise omit both
- [ ] URL actions use a `url` **array**
- [ ] `concat` is attribute-level, not inside `postProcess`
- [ ] `debug` has `printHTML` only (`printURL` does not exist)
- [ ] `studio` object: only `Name` / `URL` / `URLs` (no Aliases/Details/Tags on studio)
- [ ] `Twitter` / `Instagram` are legal performer fields
- [ ] `CareerStart` / `CareerEnd` are legal performer fields in the live schema
- [ ] New scrapers use `groupByURL`; `movieByURL` is deprecated but still in schema
- [ ] `action: stash` / `stashServer` not emitted (out of skill scope)
- [ ] Each selector live-tested, or marked `# UNVERIFIED` with an explanation
- [ ] Script scrapers include install prerequisites in the **response**, not only YAML
- [ ] CDP scrapers include visible-CDP setup steps

## CookieURL ↔ useCDP (validator-enforced)

If `driver.cookies` is used:

| `useCDP` | `CookieURL` on each cookie |
| --- | --- |
| `false` or omitted | **Required** |
| `true` | **Must not** be present |

## Height / weight postProcess (when needed)

| Op | Use |
| --- | --- |
| `feetToCm: true` | Imperial height only (`6'3"`) |
| `dimensionToMetric: true` | Mixed `175cm` / `5'9"` |
| `lbToKg: true` | Pounds → kg |

These are not date operations.

## Docs vs schema (schema wins)

- Some ScraperDevelopment examples over-list studio fields.
- Some docs mention `printURL`; schema has `printHTML` only.
- Some examples put `concat` inside `postProcess`; schema forbids that.
- Attribute-level `parseDate` still parses but is deprecated; this skill uses `postProcess[].parseDate`.

## Offline schema fetch

This package ships `references/scraper.schema.json`, a minimal stub covering the conflicts above. It is **not** a full validator; use it for quick local checks only. For merges, still run the CommunityScrapers validator against the live schema.
