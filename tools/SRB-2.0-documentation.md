# Scraper Request Builder V2.0 

**Version:** SRB V2.0 · **Spec date:** 2026-08-30

---

## 快速啟動 / Quick Start

1. 用瀏覽器直接打開 `Scrapers Builder Accompany.html`
2. 需要網路連線（React / Babel / Google Fonts 仍走 CDN，未內嵌）

## 相依 CDN 資源 / External Dependencies

執行時從 CDN 載入（未內嵌）：

| Resource | Source |
|---|---|
| React 18.3.1 | `unpkg.com/react@18.3.1` |
| ReactDOM 18.3.1 | `unpkg.com/react-dom@18.3.1` |
| Babel Standalone 7.29.0 | `unpkg.com/@babel/standalone@7.29.0` |
| Space Grotesk / Space Mono | `fonts.googleapis.com` |

## 資料儲存 / Data Storage

- 草稿存於瀏覽器 `localStorage`（key: `stash-scraper-request-draft-v1`）
- 刷新頁面不會遺失

## 版本資訊 / Version Info

- **SRB V2.0** · 2026-08-30
- 產品：Stash Scraper Request 表單建置器
- 語言：繁體中文（主）/ English（副）
- 授權：內部工具

Scraper Request Builder 是一個互動式小工具表單，用來幫助你快速建立 Stash 爬蟲/刮取器(Scarper)。可動態選擇要提取的物件欄位、新增多個測試用的實例，最後一鍵匯出 Markdown 或 JSON，方便爬蟲技能使用或回報問題。

# Scrapers Builder Accompany — Manual / 操作手冊
**Version:** SRB V2.0 · 2026-08-30

**Scrapers Builder Accompany** 是一個互動式表單工具，用來為 [Stash](https://github.com/stashapp/stash) 產生**爬蟲請求規格檔（Scraper Request Spec）**。你透過五個步驟描述目標網站、要抓取的資料欄位、測試案例與技術條件，工具會產生對應的 **JSON** 或 **Markdown** 檔案，可交給爬蟲開發流程使用。

**核心特色：**
- 五步驟引導（目標 → 欄位 → 測試 → 技術 → 匯出）
- 支援 Stash 五種物件類型（場景 / 演出者 / 合集 / 製作商 / 標籤）
- 多值欄位（Tags、URLs、Performers、Aliases…）用 chip 標籤方式輸入
- 五種驗證方式（Access Token / API Key Extraction / Cookie Header / API Key Header / Cookie File）
- 草稿自動儲存於瀏覽器，關閉頁面不會遺失
- 支援匯入既有 JSON 回填表單
- 左側步驟導覽 + 案例計數即時反映填寫進度

---

## 使用流程 

### 01 目標 · Target

**目的：** 定義爬蟲要抓什麼類型的資料、目標網站是哪個。

**步驟：**

1. **選物件類型** — 五選一：
   - 場景 (Scene) — 單一影片頁
   - 演出者 (Performer) — 演員個人頁
   - 合集 (Group) — 系列 / 合輯
   - 製作商 (Studio) — 廠商 / 品牌
   - 標籤 (Tag) — 分類標籤

2. **填寫網站資訊：**
   - **網站名稱** — 顯示用名稱（例：`ExampleSite`）
   - **爬蟲名稱** — YAML 檔名（例：`ExampleSite.yml`）
   - **網站網址（必填）** — 網站根 URL，會驗證格式
   - **搜尋模式** — 搜尋 URL 樣式（例：`/search?q={query}`）
   - **詳情頁模式** — 內容頁 URL 樣式（例：`/scene/{id}`）

**⚠️ 網址必須以 `http://` 或 `https://` 開頭**，否則會顯示紅色錯誤。

---

### 02 提取欄位 · Fields

**目的：** 勾選要從目標頁面抓取哪些欄位。

**步驟：**

1. 勾選需要的欄位（選項會根據上一步的物件類型變動）
2. 可用 **全選 / 清除** 按鈕批次操作
3. 已選數量會顯示在說明列（例：`已選 5 / 10`）

**注意：** 取消勾選只會停止該欄位在測試案例區塊出現，**不會刪掉**你之前填的預期值——重新勾選就會回來。

---

### 03 測試案例 · Test Cases

**目的：** 為每個測試 URL 定義預期能抓到的值，用來驗證爬蟲結果是否正確。

**每個案例的組成：**

- **測試 URL（必填）** — 該案例對應的目標網址，會驗證格式
- **開啟預覽 ↗** — 直接在新分頁打開該 URL
- **預期值** — 上一步勾選的每個欄位都會出現一格輸入欄
  - 單值欄位（Title、Date…）→ 一般文字輸入
  - 多值欄位（Tags、Performers…）→ **Chip 輸入器**（見下）
- **案例附註** — 可寫給爬蟲開發者看的備忘（例：「這頁的封面圖是 lazy-load」）
- **移除案例** — 右上 `✕` icon，點兩次確認才會刪除

**Chip 輸入器（多值欄位）：**

- 輸入文字後按 `Enter` / `,` / `、` / `;` / `Tab` 建立 chip
- 直接貼上多值文字（例：`solo, blonde, POV`）會自動切成多個 chip
- **Backspace** 於空輸入時把最後一個 chip 拉回來編輯
- Chip 上的 `×` 移除該項
- 重複值自動去除

**案例狀態指示（Header 上）：**

- **綠色 badge `N/M`** — URL 有效，M 個欄位中填了 N 個
- **紅色 badge `URL 無效`** — URL 格式錯
- **灰色 badge `空`** — URL 尚未填
- **✎ 藍色小圓** — 該案例有附註（摺疊時仍可見）

**新增案例：** 底部虛線按鈕「+ 新增測試案例」。可以有多個案例。

---

### 04 技術備註 · Technical Notes

**目的：** 描述爬蟲需要面對的技術狀況。三個獨立可摺疊區塊：

#### A. 需要使用 Chromium 動態渲染

勾選代表：**網站需要執行 JavaScript 才能取得內容**（例：SPA、無限滾動、需要點展開）。

勾選後選擇動態載入類型：
- 等待特定元素出現
- 固定等待時間
- 需要滾動載入
- 需要點擊展開
- 其他

並填寫細節說明。

**不勾 = Static HTML**（一般 HTTP 請求即可）。

#### B. 需要處理分頁

勾選代表：**目標資料分散在多頁**，爬蟲需要翻頁邏輯。

勾選後在 textarea 描述分頁方式（例：`?page=N`、「載入更多」按鈕、無限滾動觸發 XHR）。

**不勾 = 單頁即可**。

#### C. 需要登入驗證

勾選代表：**網站需要憑證**才能取得完整內容。

⚠️ **會出現黃色安全警示** — 提醒憑證會存進 localStorage 且會寫入匯出檔案，請勿提交到公開 Git repo。

勾選後可**複選**五種驗證方式：

| 方式 | 需要輸入 |
|---|---|
| **存取權杖 (Access Token)** | Token 值 |
| **提取 API 金鑰狀況 (API Key Extraction)** | 來源 URL + Regex 樣式 + 放入的 Header 名稱 |
| **靜態標頭 (Cookie Header)** | 完整 `name=value; name2=value2` Cookie 字串 |
| **API 金鑰 Header** | Header 名稱 + Key 值 |
| **Cookie 檔上傳 (.txt)** | Netscape 格式的 Cookie 檔案 |

**Cookie 檔案內容不會存草稿** — 只記檔名，關閉頁面後需重新載入。

#### 其他備註

自由文字欄位，寫任何額外資訊（API 限制、反爬機制、特殊處理…）。

---

### 05 匯出 · Export

**目的：** 輸出結果為 JSON 或 Markdown 檔案。

**操作：**

- **切換格式** — 上方 tabs「MARKDOWN」/「JSON」
- **↖ 匯入** — 上傳既有 JSON 檔回填表單（會經過格式遷移，舊格式也吃）
- **⎘ 複製** — 複製當前顯示的內容到剪貼簿
- **↓ 下載** — 產生檔案並下載
  - 檔名自動從「爬蟲名稱」推導：`{ScraperName}-Scraper-Request.md` / `.json`
  - 空白時 fallback 為 `Scraper-Request.md`

**Footer 資訊：**

- 左邊：顯示上次自動儲存時間（例：`草稿於 08/29 15:37:31 自動儲存`）
- 右邊 **♻ icon** — 點兩次確認可清空全部資料

---
