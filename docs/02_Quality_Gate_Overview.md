---
doc_id: DOC-QG-20
title: Quality Gate Overview
status: active
layer: repository
owner: maintainer
audience:
  - agent
  - maintainer
applies_to:
  - scrapers
  - ci
last_verified: "2026-09-09"
authority: canonical
routing:
  intents:
    - quality-gate
    - validation
---
# Scraper 品質管線總覽

## 目的

本文件提供品質管線的高层概覽。詳細規則以 [`03_Quality_Gate_Rules.md`](03_Quality_Gate_Rules.md) 為準；文件編號、命名與索引規則以 [`repository-documentation-architecture.md`](repository-documentation-architecture.md) 為準。

## 技術檢核原則

1. XPath/JSON scraper 必須有非空白的根層級 `name:`；檔名一致是專案慣例。
2. `driver.useCDP` 只能宣告於頂層 `driver` 區塊。
3. 公開 `scrapers/*.yml` 不得包含 `driver.cookies`；需要登入的版本置於 `scrapers/private/`。
4. `sceneByFragment` 不是每個 scraper 的必填項目；只有目標網站確實支援 fragment/title lookup 時才加入。若 XPath/JSON fragment mapping 存在，必須提供對應 `queryURL`。
5. 日期格式使用 Go reference layout，例如 `2006-01-02`。
6. Schema 驗證與 live-site selector 驗證是不同層級，不得以 schema 通過取代實頁測試。

## 驗證層級

| 層級 | 工具 | 證明範圍 |
|---|---|---|
| Schema | `npm run validate` | YAML 符合官方 schema |
| URL ordering | `npm run validate-sort` | URL array 排序符合 validator 要求 |
| Repository policy | `bash tools/validate-all.sh` | 命名、credentials、fragment、日期等政策 |
| Python regression | `python -m pytest tools/tests/` | 工具與測試套件可執行 |
| Documentation | `python tools/check_scraper_docs.py` | 文件範例與規則一致 |
| Documentation index | `python tools/check_docs_index.py` | 文件 ID、路徑與索引一致 |
| Live scrutiny | `node tools/scrutiny.js scrapers/<Scraper>.yml --search` | 目標網站實頁 selector 可用性 |

## CI 工作流

- `validate.yml`：blocking schema、sorting、quality gate、pytest 與文件檢查。
- `pr-check.yml`：針對 PR 變更的 scraper 執行檢查並回報。
- `scrutiny.yml`：手動觸發 live-site probing。
- `link-check.yml`：檢查 Markdown 連結。
- `eval.yml`：手動評估測試。

## 狀態追蹤

- Schema/CI 結果不代表 live selector 正確。
- Live 測試結果記錄於 [`LIVE_TEST_STATUS.md`](LIVE_TEST_STATUS.md)。
- 測試報告使用 [`test-report-template.md`](test-report-template.md)。

**最後更新**: 2026-09-09
