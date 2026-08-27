# 檢查清單

> 版本：v1.1｜日期：2026-08-2７
> 適用：本儲存庫當中 'scrapers/*.yml' 以及所有開發中的 scarpers

---

## 快速檢查

執行自動化驗證：
```bash
chmod +x scripts/validate-scrapers.sh
./scripts/validate-scrapers.sh
```

---

## 詳細檢查清單

### 1. 基本結構

- [ ] 使用 `sceneByURL` 作為主要入口
- [ ] `url` 使用陣列格式（非字串）
- [ ] `url` 陣列按字母 A–Z 排序
- [ ] root `name` 欄位（若無，則以檔名作為`name`）
- [ ] 無 `documentHeader` 或 `$vars`
- [ ] 若有 `sceneByName`，必須同時有 `sceneByQueryFragment`

### 2. Selector 穩定性

- [ ] 使用 `common:` 區塊，鍵名以 `$` 開頭（如 `$info`）
- [ ] 無 common-to-common 引用
- [ ] 優先使用屬性選擇器（`@id`, `@itemprop`, `@data-*`）
- [ ] 避免位置索引（`div[3]`），改用文字或屬性錨點
- [ ] 已用 DevTools `$x()` 驗證所有 selector

### 3. 日期處理  

- [ ] `parseDate` 使用 Go 參考時間格式（如 `"2006-01-02"`）
- [ ] `replace` 在 `parseDate` 之前（處理 `&nbsp;`、空白）
- [ ] 日期格式與網站實際輸出匹配
- [ ] 若網站有時區，已處理或註明

### 4. 標題清洗  

- [ ] 依序套用：括號標籤 → 副檔名 → 折疊空白 → trim
- [ ] 保留真實標題括號（如 `【系列】`）
- [ ] 未使用貪婪 `.*`

### 5. Performer 處理 

- [ ] 使用 canonical JavaScript（不修改邏輯）
- [ ] 保留 `・` 和 `-` 符號
- [ ] 無明確性別欄位時，不寫 `Gender` 或用 `fixed` 並註明原因

### 6. 結構與最佳實踐  

- [ ] 檔名為 CamelCase（如 `KoVideo.yml`）
- [ ] 檔尾有 `# Last Updated: YYYY-MM-DD`
- [ ] 若有 `subScraper`，已評估 rate limit 風險
- [ ] 若有多個網站共用模板，考慮網路刮削器模式

### 7. 驗證  

- [ ] 已通過官方 validator：
  ```bash
  deno run -R=scrapers -R=validator/scraper.schema.json validator/index-zh-TW.mjs scrapers/YourScraper.yml
  ```
- [ ] 無 CookieURL/useCDP 衝突
- [ ] 無 `performerByFragment` 使用 `scrapeXPath` 或 `scrapeJson`

### 8. 執行 

- [ ] 若有 `driver.clicks`，使用 `xpath` 欄位（非 `selector`）
- [ ] 若有 `useCDP: true`，已附可見 Chrome 設定步驟
- [ ] 若有 403 問題，已設定 `driver.headers` 或 Stash UA

### 9. 測試 

- [ ] 已測試 3+ 個真實的 URL 
- [ ] 驗證 Title/Date/Studio/Image/Details 符合預期值
- [ ] 所有 selector 已驗證或標記 `# UNVERIFIED` 並註明原因
4. 在真實網站測試 3+ URL
5. 提交 PR 到 CommunityScrapers（可選）
