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

> **快速總覽（zh-TW）：** 建立、修改與除錯 StashApp scraper YAML。輸出完整檔案、只改被要求的部分、只覆蓋網站真正支援的模式，並在輸出前驗證 selector。

## Scope

**Use this skill for:** Stash XPath, JSON, or script scrapers.

**Do not use for:** generic YAML; generic crawling; `action: stash` / stash-box / Identify scrapers; fabricated search endpoints; fragment or diff output; translating scraped values; inventing performer-cleaning JavaScript.

- Return the **entire** YAML file. Never return a diff, fragment, or “the rest is unchanged.”
- Change only what the user asked. Do not reorder or “optimize” unrelated blocks.
- Explanations and comments: English, plus a short zh-TW orientation when it helps.
- YAML values scraped from the site stay in the source language.
- If the user asks for stash-box, state that it is out of scope. Do not emit a partial `stash` / `stashServer` block.

## Workflow

1. **Inspect.** Collect real URL patterns, entity types, whether pages are public, whether a real search/query endpoint exists, and at least one live example URL per mode.
2. **Choose the action.** Public HTML → `scrapeXPath`. Real JSON body → `scrapeJson`. Existing API / shared Python package → `script`. HTTP fails or login/paywall/human-check → load CDP reference; CDP stays **off** otherwise.
3. **Choose modes.** Cover every mode the site verifiably supports, and only those. If `sceneByName` is present, `sceneByQueryFragment` is required. If a real query-fragment flow does not exist, omit both.
4. **Build.** Stable selectors; canonical cleaning from the matching reference. Copy performer JavaScript unchanged.
5. **Verify.** Test each XPath with `$x("...")` (or the real JSON path) on a live page per mode. Empty node = fail-to-fetch: fix before output. If unverifiable, mark `# UNVERIFIED` and say so.
6. **Validate.** Run `schema-checklist.md`. Schema wins over docs.
7. **Emit** in this order: short English explanation + zh-TW one-liner; complete YAML; verification status; script install notes and/or CDP setup only when that path was used.

## Always-on rules

- URL actions: `url` is an array (contains-match).
- `performerByFragment` cannot use `scrapeXPath` or `scrapeJson`.
- Search `queryURL` uses `{}`. Do not invent a `queryURL`.
- Repeated XPath prefixes: `common:` with `$`-prefixed keys. No common-to-common references. Avoid `div[3]`; prefer attributes or text anchors.
- `parseDate` uses Go reference time (`2006-01-02 15:04:05`). Normalize `&nbsp;` / irregular whitespace with `replace` **before** `parseDate`.
- Title cleaning: copy the ordered block from `title-patterns.md` unless the site already emits clean titles.
- Performer names: Hanzi > English > Kana. Copy the canonical JavaScript from `performer-cleaning.md`. Do not rewrite it.
- Gender: `fixed: "Male"` unless an explicit scrapeable gender field exists. Say so in the explanation.
- Script actions: load `script-actions.md` and always print install prerequisites.
- CDP: load `cdp-workflow.md` only when HTTP cannot retrieve the content. Never emit `useCDP: true` without the visible-CDP steps.

## Load when needed

| File | Load when |
| --- | --- |
| [xpath-patterns.md](references/xpath-patterns.md) | Writing or fixing XPath |
| [date-formats.md](references/date-formats.md) | Dates, `parseDate`, `&nbsp;`, unix, relative days |
| [title-patterns.md](references/title-patterns.md) | Title `replace` block |
| [performer-cleaning.md](references/performer-cleaning.md) | Performer names or gender |
| [schema-checklist.md](references/schema-checklist.md) | Every final output |
| [script-actions.md](references/script-actions.md) | `action: script` |
| [cdp-workflow.md](references/cdp-workflow.md) | Login, paywall, JS-only, or HTTP failure |
| [advanced-patterns.md](references/advanced-patterns.md) | subScraper, anchors, networks, studio map |
| [examples.md](references/examples.md) | Need a complete-file template |

Do not load `MANIFEST.md`. It is a human install index only.
