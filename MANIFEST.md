# stash-scraper-builder — Package Manifest

> **Not loaded by the skill.** Human install index and changelog only. Agents follow `SKILL.md`.

> **概要（zh-TW）：** 給人看的安裝清單。技能入口是 `SKILL.md`；參考檔在 `references/`。

Version: 2026-08-22

## Layout

```
stash-scraper-builder/
├── SKILL.md                 # agent entry (workflow + always-on rules)
├── MANIFEST.md              # this file (humans only)
└── references/
    ├── xpath-patterns.md
    ├── json-patterns.md
    ├── json-examples.md
    ├── date-formats.md
    ├── title-patterns.md
    ├── performer-cleaning.md
    ├── schema-checklist.md
    ├── scraper.schema.json  # minimal offline stub
    ├── script-actions.md
    ├── cdp-workflow.md
    ├── advanced-patterns.md
    ├── examples.md
    └── eval-pack.md
```

Do not flatten these files into the same directory as `SKILL.md`. Links in `SKILL.md` are `references/<file>.md`.

## Inventory

| File | Role | Loaded by agent |
| --- | --- | --- |
| `SKILL.md` | Workflow, scope, always-on rules, load table | Yes (entry) |
| `MANIFEST.md` | Install tree and changelog | No |
| `references/xpath-patterns.md` | XPath `common`, anchors, anti-patterns | When writing XPath |
| `references/json-patterns.md` | GJSON path patterns for `scrapeJson` | When writing JSON |
| `references/json-examples.md` | Complete-file `scrapeJson` template | When a JSON template is needed |
| `references/date-formats.md` | Go `parseDate` layouts | When parsing dates |
| `references/title-patterns.md` | Canonical title `replace` set | When cleaning titles |
| `references/performer-cleaning.md` | Canonical performer JS + gender | When handling performers |
| `references/schema-checklist.md` | Pre-output validation + schema conflicts | Every final YAML |
| `references/scraper.schema.json` | Minimal offline schema stub | No (humans / external tools) |
| `references/script-actions.md` | Script I/O, `# requires:`, install, dirs | When `action: script` |
| `references/cdp-workflow.md` | Visible-CDP login workflow | When HTTP is not enough |
| `references/advanced-patterns.md` | Optional advanced YAML | When the case requires it |
| `references/examples.md` | Complete-file templates only | When a template is needed |
| `references/eval-pack.md` | 5-task end-to-end test suite | When testing the skill |

## Known gaps (not shipped)

- Full `scraper.schema.json` — this package ships only a minimal stub covering known conflicts. For CI, still use the live schema from CommunityScrapers.
- Automated eval runner — `eval-pack.md` is a human-run checklist; no CI hook yet.

## Change log

### 2026-08-22 (eval pack)

- Added `references/eval-pack.md` (5-task end-to-end test suite).
- Updated `MANIFEST.md` inventory and known gaps.

### 2026-08-22 (offline schema stub)

- Added `references/scraper.schema.json` (minimal stub).
- Updated `schema-checklist.md` to point at the local file.
- Updated `MANIFEST.md` inventory.

### 2026-08-22 (JSON examples + offline schema note)

- Added `references/json-examples.md` with one complete `scrapeJson` scraper.
- Added an “Offline schema fetch” note to `schema-checklist.md`.
- Updated `SKILL.md` and `MANIFEST.md` load tables.

### 2026-08-22 (JSON reference)

- Added `references/json-patterns.md` for `scrapeJson` / GJSON selectors.
- Updated `SKILL.md` load table and `MANIFEST.md` inventory.

### 2026-08-21 (alignment)

- `SKILL.md` restructured: process + load table; G-numbers removed from the agent path.
- References moved under `references/` and renamed (suffixes dropped).
- `script-scraper-patterns.md` + `dependency-patterns.md` merged into `script-actions.md`.
- Added `cdp-workflow.md`, `schema-checklist.md`, `advanced-patterns.md`, `examples.md`.
- Defect fixes: XPath compliant `common` example no longer nests `$` keys; performer JS is a single `\u`-escaped YAML block; broken wareki string-concat example removed; `groupByURL` script args aligned; fragment “date-only” example replaced with a complete file.
- Manifest is human-only and no longer restates G-1…G-15 as live rules.

### 2026-08-20

- Language rule: technical English + zh-TW overview; scraped values keep source language.
- Modes: only verifiably supported; `sceneByName` requires `sceneByQueryFragment`.
- Visible-CDP login workflow; script install prerequisites; `action: stash` out of scope; live selector verification; optional advanced patterns.

## Verification (humans)

- Schema (live): https://github.com/stashapp/CommunityScrapers/blob/master/validator/scraper.schema.json
- Validator: `deno run -R=scrapers -R=validator/scraper.schema.json validate.js scrapers/xxx.yml`
- Local stub: `references/scraper.schema.json` (quick checks only)
- Checklist copy of CookieURL ↔ useCDP and other conflicts: `references/schema-checklist.md`
- Eval pack: `references/eval-pack.md` (5 tasks, 5/5 target)
