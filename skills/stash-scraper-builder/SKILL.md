---
name: stash-scraper-builder
description: >
  Build, modify, and debug StashApp scraper YAML that conforms to scraper.schema.json.
  Use for Stash-specific scraper.yml, scrapeXPath, scrapeJson, script actions,
  sceneByURL, performerByURL, sceneByFragment, sceneByName, galleryByURL, groupByURL,
  or a request to scrape a site for StashApp.
  Do not use for generic YAML, generic web scraping, or Stash-box / action: stash scrapers.
---

# Stash Scraper Builder

> **快速總覽（zh-TW）：** 建立、修改與除錯 StashApp scraper YAML。永遠輸出完整檔、只改被要求的部分、只覆蓋網站真正支援的模式，並在輸出前驗證 selector。

This skill is a **builder checklist**, not a full runtime manual.
Runtime model: https://deepwiki.com/stashapp/CommunityScrapers/

## Scope

**Use for:** Stash XPath, JSON, or script scrapers.

**Do not use for:** generic YAML; generic crawling; `action: stash` / stash-box / Identify scrapers; fabricated search endpoints; fragment or diff output; translating scraped values; inventing performer-cleaning JavaScript.

## Always-on rules

- Return the **entire** YAML file. Never a diff, fragment, or "the rest is unchanged."
- Change only what the user asked. Do not reorder or rewrite unrelated blocks.
- Explanations: English plus a short zh-TW orientation. Scraped values stay in the source language — do not translate titles, performers, dates, or details.
- Do **not** emit root keys `name`, `documentHeader`, or `$vars`. The filename is the scraper name. `#` comments are allowed.
- URL actions: `url` is an array (case-sensitive contains-match).
- Shared prefixes: `xPathScrapers.*.common` with `$`-prefixed **string** keys. Fields use `$info//h1`. No `$vars`. No common-to-common references (`$b: "$a/span"`).
- `parseDate` uses Go reference time (`2006-01-02`). Never use `YYYY-MM-DD` as a layout string.
- New scrapers use `URLs` (array) and `Groups` / `groupByURL`. Do not emit legacy `URL` or `Movies` / `movieByURL`.
- Keep `Country` / `Ethnicity` / `Gender` under `Performers`, never at scene root.
- Never invent `Groups` from シリーズ / レーベル unless the user explicitly wants that mapping.
- `performerByFragment` cannot use `scrapeXPath` or `scrapeJson` (script only).
- If the user asks for stash-box, say it is out of scope. Do not emit a partial `stash` / `stashServer` block.

### Driver Configuration Rules (Mandatory)

- **`driver.useCDP` is allowed only in the top-level `driver` block, never inside any entry point.** Entry points (`sceneByURL`, `sceneByName`, etc.) must not contain `useCDP`.
- **Public scrapers must not contain `driver.cookies`.** Session cookies belong only in `scrapers/private/*.yml`.
- **Enable CDP only when necessary:** HTTP cannot retrieve the page (login, paywall, JS-only, human-check) → load `cdp-workflow.md`. Otherwise leave CDP **off**.

### Runtime Safety Rules

- **Add `sceneByFragment` when the site supports fragment-based scraping.** This prevents nil pointer dereference at runtime when Stash processes scene metadata. See `references/scraping-failures.md` for details.
- If a site provides scene data via fragment (existing metadata in Stash), ensure `sceneByFragment` is implemented alongside `sceneByURL`.

## Choose action

1. Public HTML → `scrapeXPath` (definitions in `xPathScrapers`).
2. Real JSON body / API → `scrapeJson` (definitions in `jsonScrapers`, never `xPathScrapers`).
3. Existing API or shared Python package → `script` (load `script-actions.md`).
4. HTTP cannot retrieve the page (login, paywall, JS-only, human-check) → load `cdp-workflow.md`. Otherwise leave CDP **off**.

## Choose modes

Cover every mode the site **verifiably** supports, and only those.

- Sites with stable detail URLs: `sceneByURL` is required.
- `sceneByName` **requires** `sceneByQueryFragment`. If there is no real search / query-fragment flow, omit **both**.
- Do not invent a `queryURL`.
- Search `queryURL` uses `{}`. Query-fragment `queryURL` uses `{url}`.
- Search is optional. Do not add it just to pass a checklist. Do not mark a mode `VERIFIED` unless it was tested.
- Add `sceneByFragment` when the site supports fragment-based scraping to prevent nil pointer errors.

## Output skeleton (mandatory shape)

Entry points do **not** contain a `scene:` block. `scene:` lives under the named scraper.

```yaml
# Last Updated: YYYY-MM-DD
sceneByURL:
  - action: scrapeXPath
    url:
      - "example.com/works/"
    scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    common:
      $info: "//main[@id='content']"
    scene:
      Title:
        selector: "$info//h1"
      Date:
        selector: "$info//time/@datetime"
        postProcess:
          - parseDate: "2006-01-02"
      Image:
        selector: "$info//img[@id='cover']/@src"
      Studio:
        Name:
          fixed: "ExampleStudio"
      Performers:
        Name: "$info//a[contains(@href,'/actor/')]"
```

JSON equivalent: `action: scrapeJson` + `jsonScrapers:` (same `scraper:` name). Add `sceneByName` / `sceneByQueryFragment` / `performerByURL` / `groupByURL` only when verified. Add `sceneByFragment` when the site supports fragment-based scraping.

## Workflow

1. **Inspect.** Real URL patterns, entity types, public vs gated, whether a real search exists, one live URL per mode.
2. **Choose action and modes** (rules above).
3. **Build.** Stable selectors; `common` + `$` keys; copy title / performer cleaning from references when needed. Ensure `driver.useCDP` (if needed) is in top-level `driver` block only.
4. **Verify.** `$x("...")` or the real JSON path on a live page. Empty node = fail. If unverifiable, mark `# UNVERIFIED` and say so.
5. **Validate.** Run `schema-checklist.md`. Schema wins over docs. Prefer the CommunityScrapers schema over the local stub. Check driver configuration rules.
6. **Emit.** Short English explanation + zh-TW one-liner; complete YAML; verification status; script install notes and/or CDP setup only when that path was used.

## Definition of done

- Validator passes (no schema / reference errors).
- Output is a complete YAML file in the skeleton shape above.
- Every **implemented** mode was tested on ≥ 3 real pages/queries, or selectors are marked `# UNVERIFIED`.
- Key fields (Title, Date, Studio, Image) match expected values on tested pages — not merely "selector matched something."
- No invented search modes, no root `name` / `documentHeader` / `$vars`, no translated scraped values.
- Driver configuration follows rules: `useCDP` only in top-level `driver`, no `driver.cookies` in public scrapers.
- `sceneByFragment` is present when the site supports fragment-based scraping.

## Troubleshooting

- **Validator fails** — fix schema first (missing required fields, wrong types, invalid refs). Re-run after each change.
- **All fields empty** — `$x()` the selectors; check age-gate / interstitial; check `useCDP` / cookies. See `references/scraping-failures.md`.
- **Only Date is nil** — raw string vs Go layout; `replace` before `parseDate`. See `references/date-formats.md` and `references/post-processing.md`.
- **Studio or Details wrong** — do not use メーカー as studio when レーベル / シリーズ is the label; strip HTML from Details.
- **Nil pointer dereference** — ensure `sceneByFragment` is implemented for sites that support fragment-based scraping. See `references/scraping-failures.md`.

## Data model reminders

- Scene: no required fields. Performer / Group / Studio / Tag: `Name` only. Gallery: `Title` only. Image: none.
- Use `URLs` arrays. Use `Groups`, not `Movies`.
- Performer-only fields include `Disambiguation`, `Birthdate`, `Height`, `Weight`, `Gender`, `Circumcised`, `Country`, `Ethnicity`.

## Anti-patterns

- Hardcoding expected values in XPath.
- Overfitting one page; assuming every field exists on every page.
- `subScraper` by default.
- `$vars`, root `name`, `documentHeader`, or `scene:` directly under `sceneByURL`.
- Putting `scrapeJson` definitions in `xPathScrapers`.
- Inventing `sceneByName` without a real search.
- Using `YYYY-MM-DD` as a `parseDate` layout.
- Overly deep or positional XPath (`div[3]`).
- Translating scraped values.
- Placing `useCDP` inside entry points instead of top-level `driver`.
- Including `driver.cookies` in public scrapers.
- Omitting `sceneByFragment` when the site supports fragment-based scraping.

## Load when needed

| File | Load when |
| --- | --- |
| [xpath-patterns.md](references/xpath-patterns.md) | Writing or fixing XPath |
| [json-patterns.md](references/json-patterns.md) | Writing `scrapeJson` |
| [json-examples.md](references/json-examples.md) | Complete-file JSON template |
| [date-formats.md](references/date-formats.md) | Dates, `parseDate`, `&nbsp;`, unix, relative days |
| [title-patterns.md](references/title-patterns.md) | Title `replace` block |
| [performer-cleaning.md](references/performer-cleaning.md) | Performer names |
| [schema-checklist.md](references/schema-checklist.md) | Every final output |
| [script-actions.md](references/script-actions.md) | `action: script` |
| [cdp-workflow.md](references/cdp-workflow.md) | Login, paywall, JS-only, or HTTP failure |
| [post-processing.md](references/post-processing.md) | `concat` / `postProcess` / `split` order |
| [advanced-patterns.md](references/advanced-patterns.md) | subScraper, anchors, networks, studio map |
| [examples.md](references/examples.md) | Complete-file XPath template |
| [scraping-failures.md](references/scraping-failures.md) | Runtime empty results |
| [best-practices.md](references/best-practices.md) | Maintainability pass |
| [eval-pack.md](references/eval-pack.md) | Testing this skill |

Human-only (do not load for scraper tasks): `request-template.md`, `request-template-zh-TW.md`, `validator-errors-zh-TW.md`, `validator-index-messages-zh-TW.md`.

Canonical DeepWiki pages:

- Entry points: https://deepwiki.com/stashapp/CommunityScrapers/8.1-entry-points
- Data model: https://deepwiki.com/stashapp/CommunityScrapers/3.1-data-model
- Post-processing: https://deepwiki.com/stashapp/CommunityScrapers/3.3-post-processing-pipeline
- Selector syntax: https://deepwiki.com/stashapp/CommunityScrapers/8.2-selector-syntax
- Testing: https://deepwiki.com/stashapp/CommunityScrapers/10.2-testing-scrapers
- Best practices: https://deepwiki.com/stashapp/CommunityScrapers/10.3-best-practices
- Scraping failures: https://deepwiki.com/stashapp/CommunityScrapers/11.2-scraping-failures
- Driver configuration: https://deepwiki.com/stashapp/CommunityScrapers/8.4-driver-configuration
