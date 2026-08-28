# Production Checklist

> **刮削器生產就檢清單。** 本文件聚焦於業務邏輯和內容品質檢核。

## 技術檢核

**請先完成技術檢核：** [`SCRAPER_QUALITY_GATE.md`](./SCRAPER_QUALITY_GATE.md)

技術檢核包含：
- 5 條規則預檢（name, useCDP, cookies, sceneByFragment, Last Updated）
- Schema 驗證
- CI/CD workflow
- 自動化腳本

---

## A-H Workstream 業務檢核

### Workstream A: Entry Contract

- [ ] 完整的 YAML 輸出（非片段）
- [ ] 必要的 `sceneByURL[].action/url/scraper` 骨架
- [ ] 未發明搜尋模式
- [ ] 無 root `name`, `documentHeader`, `$vars`（技術檢核已覆蓋）

### Workstream B+C: Templates & Dates

- [ ] `scrapeJson` 定義僅在 `jsonScrapers`
- [ ] `parseDate` 使用 Go reference time (`2006-01-02`)
- [ ] `sceneByQueryFragment.queryURL` 使用 `{url}`

### Workstream D: Validation

- [ ] 官方 CommunityScrapers schema 為權威
- [ ] Cookie/CDP 設定文件化
- [ ] `url` 陣列按 A-Z 排序（`validator -s`）

### Workstream E: Runtime Modes

- [ ] CDP: 官方設定路徑，可見 Chrome
- [ ] Script: I/O contract, `# requires:`, 錯誤處理
- [ ] Failures: HTTP status → UA/CDP diagnosis

### Workstream F: Field Quality

- [ ] Title cleaning: tags → extension → whitespace → trim
- [ ] Performer names: canonical JS, preserve `・` / `-`
- [ ] 預設 `Gender`: 省略

### Workstream G: Structure & Community Form

- [ ] YAML anchors (3+ reuse)
- [ ] `# Last Updated YYYY-MM-DD` at EOF（技術檢核已覆蓋）
- [ ] CamelCase 檔名
- [ ] `url` sorted A-Z
- [ ] 無 `subScraper` by default

### Workstream H: Regression Gate

- [ ] Eval pack 5 tasks (XPath/JSON/Script/Date/CDP)
- [ ] Test matrix: 6 scenarios + network 3–5 domains
- [ ] Expected vs Actual verification

---

## 內容品質檢核

### 欄位準確性

- [ ] **Title** - 無多餘空格、標籤、網站名稱
- [ ] **Date** - 格式正確 (YYYY-MM-DD)，非上傳日期
- [ ] **Studio** - 正確的 label（非製造商）
- [ ] **Performers** - 正確的漢字/假名，無重複
- [ ] **Tags** - 有意義的分類，無重複
- [ ] **Details** - 無 HTML、無場景列表、無價格資訊
- [ ] **Image** - 高解析度封面，非縮圖
- [ ] **Code** - 符合網站格式

### 網站特定規則

- [ ] 遵循網站的 label/studio 區分
- [ ] 正確的 performer 來源（從網站刮取，非 invented）
- [ ] 正確的 tag 分類（符合網站結構）
- [ ] Details 內容完整但精簡（去除冗餘）

### 多 URL 處理

- [ ] 跨網站 URL 正確（hunk-ch, ko-tube, mensrush 等）
- [ ] URL 格式正確（https, 無多餘參數）
- [ ] 無重複 URL
- [ ] 排序正確（A-Z）

---

## 測試驗證

### 基本測試

- [ ] 至少測試 3 個真實 URL
- [ ] 所有必要欄位正確
- [ ] 無空值或錯誤資料
- [ ] 標註驗證狀態（`VERIFIED` / `UNVERIFIED`）

### 進階測試

- [ ] 搜尋功能正常（如果有 sceneByName）
- [ ] Fragment 處理正確（如果有 sceneByFragment）
- [ ] Group/scene 關係正確（如果有 groupByURL）
- [ ] 多語言處理正確（日文、中文、英文）

---

## 文件完整性

- [ ] `# Last Updated` 日期正確（技術檢核已覆蓋）
- [ ] 驗證狀態標註清楚
- [ ] 測試 URL 記錄完整
- [ ] 已知問題記錄在註解中
- [ ] CDP setup 說明（如果需要）

---

## 安全性檢核

- [ ] Public scraper 無 session tokens
- [ ] 無硬編碼的 credentials
- [ ] CDP 配置正確（如果需要）
- [ ] 無敏感資訊洩漏

---

## 最終確認

在合併到 main branch 前，確認：

- [ ] **技術檢核** 通過（參見 [`SCRAPER_QUALITY_GATE.md`](./SCRAPER_QUALITY_GATE.md)）
- [ ] **業務檢核** 通過（本文件）
- [ ] **內容品質** 通過（本文件）
- [ ] **測試驗證** 通過（本文件）
- [ ] **文件完整性** 通過（本文件）
- [ ] **安全性檢核** 通過（本文件）

---

## 相關文件

- [`SCRAPER_QUALITY_GATE.md`](./SCRAPER_QUALITY_GATE.md) - 技術檢核完整流程
- [`AGENTS.md`](../AGENTS.md) - AI agent 規則
- [`skills/stash-scraper-builder/SKILL.md`](../skills/stash-scraper-builder/SKILL.md) - Skill 定義
- [`skills/stash-scraper-builder/references/`](../skills/stash-scraper-builder/references/) - 參考文件
- [`validator/index-zh-TW.mjs`](../validator/index-zh-TW.mjs) - 驗證器

---

## 使用流程

1. **本地開發** → 完成 scraper 編寫
2. **技術檢核** → 執行 `bash scripts/scraper-quality-gate.sh scrapers/YourScraper.yml`
3. **業務檢核** → 使用本文件檢查 A-H workstream 和內容品質
4. **測試驗證** → 在 Stash 中測試真實 URL
5. **文件更新** → 更新 `# Last Updated` 和驗證狀態
6. **CI/CD** → Push 到 GitHub，等待 workflow 通過
7. **合併** → 合併到 main branch

---

**版本：** 2026-08-28  
**維護者：** Stash Scraper Builder Team
