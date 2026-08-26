# Eval Pack — 5 Tasks

**Load when:** testing the skill end-to-end.

> **概要（zh-TW）：** 五個任務，各對應一種失敗模式。每題都要輸出完整 YAML、勾選 checklist、標記 selector 驗證狀態。

## Pass criteria (all tasks)

- [ ] Output is a **complete** YAML file (no fragments, no "unchanged" placeholders).
- [ ] Only modes the site verifiably supports are present.
- [ ] `sceneByName` ⇒ `sceneByQueryFragment` present; otherwise both omitted.
- [ ] Every selector is either verified on a real page/response or marked `# UNVERIFIED` with an explanation.
- [ ] Official CommunityScrapers validator passes (or local stub with known limitations noted).
- [ ] Script tasks include the three install prerequisites in the **response**.
- [ ] CDP task includes visible-CDP setup steps (or explicitly states "out of scope").

## Task 1 — New XPath site (public HTML)

**Site:** Use any real public HTML site with scene pages.

**Requirements:**
- `sceneByURL` + `sceneByFragment` only (no search endpoint unless it exists).
- Title cleaning from `title-patterns.md`.
- Date with `parseDate` (Go layout matching the site).
- Performers with canonical JS from `performer-cleaning.md`; `Gender` omitted unless explicit.
- Studio `Name` only (or `fixed` for single-brand).

**Expected output:** one complete YAML, all selectors verified or marked `# UNVERIFIED`.

**Failure modes to catch:**
- Fragment-only output.
- Missing title cleaning or wrong `parseDate` layout.
- Invented `sceneByName`.

## Task 2 — New `scrapeJson` site (real JSON API)

**Site:** Use any real JSON API that returns scene metadata.

**Requirements:**
- `sceneByURL` + `sceneByName` + `sceneByQueryFragment` (if the API supports search).
- `action: scrapeJson` with GJSON selectors.
- Title cleaning + `parseDate` on the release date field.
- Performers array with canonical JS.

**Expected output:** one complete YAML using `jsonScrapers` (not `xPathScrapers`).

**Failure modes to catch:**
- Invented GJSON paths not tested on the real response.
- Using `scrapeXPath` on a JSON-only endpoint.
- Putting `scrapeJson` definitions in `xPathScrapers`.

## Task 3 — Script + dependency

**Site:** Use any site that already has a shared Python scraper.

**Requirements:**
- `sceneByURL` + `sceneByFragment` (or more if the site supports them).
- `action: script` with `# requires:` and the dependency path.
- Response must state: Python on PATH, pip packages, dependency files exist.

**Expected output:** one complete YAML + install prerequisites in the explanation.

**Failure modes to catch:**
- Missing `# requires:` or wrong relative path.
- No install notice in the response.
- `*ByName` returning a bare object instead of an array.

## Task 4 — Date `&nbsp;` fix (complete file)

**Input:** Existing scraper that fails on `15&nbsp;Jan&nbsp;2024`.

**Requirements:**
- Fix the Date field with `replace` then `parseDate`.
- Return the **entire** scraper file, not just the Date block.

**Expected output:** full YAML with the corrected Date `postProcess`.

**Failure modes to catch:**
- Fragment output ("only the changed section").
- `parseDate` before `replace` (still fails).

## Task 5 — Login-gated site

**Site:** Any real login/paywall/human-check site.

**Requirements:**
- Do **not** emit a scraper that silently returns nothing.
- Either:
  - Emit `driver: useCDP: true` **and** the visible-CDP steps, or
  - State that login-gated scraping is out of scope for this skill.

**Expected output:** YAML + CDP steps, or an explicit "out of scope" explanation.

**Failure modes to catch:**
- `useCDP: true` without the setup steps.
- Plain HTTP scraper that will fail on a gated page.

## Scoring

| Task | Pass | Fail |
| --- | --- | --- |
| 1 XPath | 1 | 0 |
| 2 JSON | 1 | 0 |
| 3 Script | 1 | 0 |
| 4 Date | 1 | 0 |
| 5 CDP | 1 | 0 |
| **Total** | **/5** | |

Target: **5/5** before calling the skill "done." If any task fails, fix the workflow or checklists, then re-run.
