# Scraper Request Template

**Use:** when asking a human or an agent to build a Stash scraper. Fill only what you know; leave blanks if unknown.

> **概要（zh-TW）：** 一頁式需求表。填好範圍、URL、欄位、清理規則、模式、測試案例，減少猜測與返工。

## 1. Request table (fill what you know)

| Field | Your input | Notes / examples |
| --- | --- | --- |
| **Scope** |  | `scene`, `performer`, `movie/group`, `gallery`, `image` |
| **Modes wanted** |  | `sceneByURL`, `sceneByFragment`, `sceneByName`, `performerByURL`, etc. |
| **Base domain** |  | e.g. `site.test` |
| **Scene URL pattern** |  | e.g. `https://site.test/works/ABP-123` |
| **Performer URL pattern** |  | e.g. `https://site.test/actor/Alice` |
| **Search URL** |  | e.g. `https://site.test/search?q={}` or “no search” |
| **Access** |  | Public / Login / Paywall / JS-only |
| **Action type** |  | `scrapeXPath` / `scrapeJson` / `script` |
| **Scene fields** |  | Title, Date, Details, Image, Performers, Studio, Tags, … |
| **Performer fields** |  | Name, Gender, Birthdate, Height, Image, socials, … |
| **Title cleaning** |  | e.g. “strip trailing `[...]`, `【...】`, extensions, collapse whitespace” |
| **Date example** |  | e.g. `2024.03.15`, `15 Jan 2024`, `2024年1月15日` |
| **Performer name rule** |  | e.g. “Hanzi > English > Kana” (if relevant) |
| **Special quirks** |  | e.g. “Date has `&nbsp;`”, “Title has `[4K]` tags”, “Studio name is domain” |
| **Constraints** |  | e.g. “No CDP”, “Must use visible-CDP”, “Do not add `sceneByName` if no real search” |

## 2. Live examples (required)

Provide at least one real URL per mode you want implemented.

| Mode | Example URL | Notes |
| --- | --- | --- |
| Scene URL |  |  |
| Performer URL |  |  |
| Search (if wanted) |  |  |
| JSON sample (if `scrapeJson`) |  | Paste a sample response or `curl` output |

## 3. Test cases (optional but recommended)

Describe 2–3 concrete cases and expected behavior.

| # | Scenario | Expected behavior |
| --- | --- | --- |
| 1 | Normal scene with full metadata | All fields populated |
| 2 | Scene with missing date | Date left empty, no error |
| 3 | Performer “水神雷也 Raiya” | Name cleaned to `水神雷也` |
| 4 | … | … |

## 4. Pre-flight checklist (manual)

Before sending the request, tick these:

- [ ] Scope and entity types are clear (scene / performer / etc.).
- [ ] Modes wanted are listed and realistic for the site.
- [ ] At least one live URL per requested mode is provided.
- [ ] For `scrapeJson`, a sample JSON response is attached or linked.
- [ ] Title, date, and performer cleaning rules are described with examples.
- [ ] Access model is stated (public vs login/paywall/JS-only).
- [ ] Any hard constraints (no CDP, no search, etc.) are explicit.
- [ ] If login/paywall: you are OK with visible-CDP steps or you accept “out of scope”.

Use this as a **human reference only**; it is not loaded by the skill.
