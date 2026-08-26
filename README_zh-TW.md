# Stash Scraper Builder

> **狀態：** ✅ 所有工作流 A-H 完成（2026 年 8 月）

建立符合 [CommunityScrapers schema](https://deepwiki.com/stashapp/CommunityScrapers/) 的 StashApp 刮削器。

## 概述

此技能讓 AI 代理能夠生成、修改和除錯 StashApp 刮削器，並確保：

- ✅ 可載入（有效 YAML、正確的 schema）
- ✅ 可刮取（正確的 selector、後處理）
- ✅ 遵循社群最佳實踐（錨點、Last Updated、CamelCase 檔名）

## 已完成的工作流

| 階段 | 工作流 | 狀態 | PR |
| --- | --- | --- | --- |
| P0 | **A** — 入口契約 | ✅ | #1 |
| P0 | **B+C** — 範本與日期 | ✅ | #2 |
| P1 | **D** — 驗證真相 | ✅ | #13 |
| P1 | **E** — 執行期模式 | ✅ | #14 |
| P2 | **F** — 欄位品質 | ✅ | #15 |
| P3 | **G** — 結構與社群形 | ✅ | #16 |
| P4 | **H** — 回歸閘門 | ✅ | #17 |
| — | **CI** — 工作流優化 | ✅ | #18 |

## 主要功能

### 入口契約 (A)
- 完整 YAML 輸出（非片段）
- 強制 `sceneByURL[].action/url/scraper` 骨架
- 不發明搜尋模式
- 無根 `name`、`documentHeader` 或 `$vars`

### 範本與日期 (B+C)
- `scrapeJson` 定義僅在 `jsonScrapers`
- `parseDate` 使用 Go 參考時間（`2006-01-02`）
- `sceneByQueryFragment.queryURL` 使用 `{url}`

### 驗證 (D)
- 官方 CommunityScrapers schema 為權威
- 本地 stub 標記為「非權威」
- Cookie/CDP 形狀已文件化
- `url` 陣列按 A–Z 排序（`validator -s`）

### 執行期模式 (E)
- CDP：官方設定路徑、可見 Chrome
- Script：I/O 契約、`# requires:`、錯誤處理
- 失敗診斷：HTTP 狀態 → UA/CDP

### 欄位品質 (F)
- 標題清理：tags → extension → whitespace → trim
- 演員名：canonical JS、保留 `・` / `-`
- 預設 `Gender`：省略

### 結構 (G)
- YAML 錨點（3+ 次重用）
- `# Last Updated YYYY-MM-DD` 在檔尾
- CamelCase 檔名
- `url` 按 A–Z 排序
- 預設禁用 `subScraper`

### 回歸閘門 (H)
- Eval pack 5 任務（XPath/JSON/Script/Date/CDP）
- 測試矩陣：6 情境 + 網路 3–5 網域
- Expected vs Actual 驗證清單

## CI 狀態

| 工作流 | 觸發 | 狀態 |
| --- | --- | --- |
| `validate.yml` | 路徑過濾（scrapers, validator, skills） | ✅ |
| `eval.yml` | 手動（`workflow_dispatch`） | ✅ |
| `link-check.yml` | Push/PR | ✅ |
| `site.yml` | Push/PR（GitHub Pages） | ✅ |

## 使用方式

### AI 代理

1. 讀取 `skills/stash-scraper-builder/SKILL.md`
2. 按需載入參考文件（見 SKILL.md 中的載入表）
3. 遵循工作流：檢查 → 選擇 action → 建立 → 驗證 → 校驗 → 輸出

### 人類使用者

- **技能文件：** `skills/stash-scraper-builder/references/`
- **驗證器：** `validator/validate.js`
- **Schema：** [CommunityScrapers](https://github.com/stashapp/CommunityScrapers/blob/develop/scraper.schema.json)

## 參考資料

- [CommunityScrapers DeepWiki](https://deepwiki.com/stashapp/CommunityScrapers/)
- [Scraper Schema](https://github.com/stashapp/CommunityScrapers/blob/develop/scraper.schema.json)
- [驗證器錯誤（zh-TW）](skills/stash-scraper-builder/references/validator-errors-zh-TW.md)

## 授權

與主 repo 相同。
