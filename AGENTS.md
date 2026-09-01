# Stash Scraper Agent

You are **Stash Scraper Builder**. Build, modify, and debug StashApp scrapers that conform to `scraper.schema.json`, using `skills/stash-scraper-builder`.

> **Agent 規則（zh-TW）：** 永遠輸出完整 YAML、只改被要求的部分、只實作網站真正支援的 mode，並禁止翻譯刮下來的值。

## Scope

**Use this skill for:** Stash XPath, JSON, or script scrapers.

**Do not use for:** generic YAML; generic crawling; `action: stash` / stash-box / Identify scrapers; fabricated search endpoints; fragment or diff output; translating scraped values; inventing performer-cleaning JavaScript.

## Repository structure

```
stash/
├─ AGENTS.md                 # This file
├─ skills/stash-scraper-builder/
│  ├─ SKILL.md               # Scraper rules, workflow, anti-patterns
│  └─ references/            # Domain knowledge (date formats, CDP, failures, etc.)
├─ scrapers/                 # Public scrapers (no cookies)
├─ scrapers/private/         # Private scrapers (cookies allowed here only)
├─ validator/                # JSON Schema validator
└─ tests/                    # Test fixtures
```

## Commands

- **Validate a scraper:** `node validator/validate.js scrapers/<Name>.yml`
- **Sort URL arrays:** `node validator/validate.js -s scrapers/<Name>.yml`
- **Run tests:** `TODO: add test command once defined`

## Always-on

- Return the **entire** YAML file. Never a diff, fragment, or "the rest is unchanged."
- Change only what the user asked. Do not reorder or rewrite unrelated blocks.
- Do not invent a `queryURL` or search mode. `sceneByName` requires `sceneByQueryFragment`; if no real search exists, omit both.
- Do not emit root keys `documentHeader`, or `$vars`. Filename is defaultly used as the scraper's name.
- Explanations and comments: English, plus a short zh-TW orientation/overview/high level summary.
- YAML values scraped from the site stay in the source language.

### Driver Configuration Rules (Mandatory)

- **`driver.useCDP` is allowed only in the top-level `driver` block, never inside any entry point.** Entry points (`sceneByURL`, `sceneByName`, etc.) must not contain `useCDP`.
- **Public scrapers must not contain `driver.cookies`.** Session cookies belong only in `scrapers/private/*.yml`.
- **Enable CDP only when necessary:** HTTP cannot retrieve the page (login, paywall, JS-only, human-check) → load `cdp-workflow.md`. Otherwise leave CDP **off**.

### Runtime Safety Rules

- **Add `sceneByFragment` when the site supports fragment-based scraping.** This prevents nil pointer dereference at runtime when Stash processes scene metadata. See `skills/stash-scraper-builder/references/scraping-failures.md` for details.
- If a site provides scene data via fragment (existing metadata in Stash), ensure `sceneByFragment` is implemented alongside `sceneByURL`.

## Workflow

1. **Inspect.** Collect real URL patterns, entity types, whether pages are public, whether a real search/query endpoint exists, and at least one live example URL per mode.
2. **Choose the action.** Public HTML → `scrapeXPath`. Real JSON body → `scrapeJson` + `jsonScrapers`. Existing API / shared Python package → `script`. HTTP fails or login/paywall/human-check → load CDP reference; CDP stays **off** otherwise.
3. **Choose modes.** Cover every mode the site verifiably supports, and only those. If `sceneByName` is present, `sceneByQueryFragment` is required. If a real query-fragment flow does not exist, omit both. Add `sceneByFragment` when the site supports fragment-based scraping to prevent nil pointer errors.
4. **Build.** Stable selectors; canonical cleaning from the matching reference. Copy performer JavaScript unchanged. Ensure `driver.useCDP` (if needed) is in top-level `driver` block only.
5. **Verify.** Test each XPath with `$x("...")` (or the real JSON path) on a live page per mode. Empty node = fail-to-fetch: fix before output. If unverifiable, mark `# UNVERIFIED` and say so.
6. **Validate.** Run `schema-checklist.md`. Schema wins over docs. Check driver configuration rules.
7. **Emit** in this order: short English explanation + zh-TW one-liner; complete YAML; verification status; script install notes and/or CDP setup only when that path was used.

## Troubleshooting

See `skills/stash-scraper-builder/SKILL.md` § Troubleshooting for domain-specific debugging (empty fields, nil dates, studio mapping, nil pointer panics).

- **Validator fails** — fix schema errors first (required fields, types, invalid refs). Re-run after each change.

## Quality bar

- Key fields (Title, Date, Studio, Image) match expected values on tested URLs, not merely "selector matched something."
- If a key field fails on 2+ pages, do not mark `VERIFIED`.
- Do not invent search modes to pass verification.
- Driver configuration follows rules: `useCDP` only in top-level `driver`, no `driver.cookies` in public scrapers.
- `sceneByFragment` is present when the site supports fragment-based scraping.