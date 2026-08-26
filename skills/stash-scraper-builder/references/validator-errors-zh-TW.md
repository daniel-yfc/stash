# 驗證器錯誤指南（zh-TW）

> **摘要：** 本檔協助閱讀驗證器輸出。官方 CommunityScrapers schema 與 validator 才是權威；本 repo 的離線 schema stub 只供快速提示。

## Errors 與 Warnings

| 類型 | 意義 | 處理 |
| --- | --- | --- |
| Error | YAML 結構或業務規則不合法；scraper 不能視為完成 | 必須修正。CI / `--ci` 以 Errors 為失敗條件。 |
| Warning | 不一定阻止執行，但常代表過時欄位、可維護性或資料品質風險 | 應修正或在 PR 說明原因，不要直接忽略。 |

驗證器通過不代表 selector 能抓到資料；仍需用真實 URL 與 Stash debug log 測試。

## 常見錯誤與修正

| 訊息／情境 | 常見原因 | 修正 |
| --- | --- | --- |
| `sceneByName requires sceneByQueryFragment` | 只寫了名稱搜尋 | 加入真實的 `sceneByQueryFragment`，或兩者都刪除。 |
| 找不到 scraper reference | entry point 的 `scraper:` 名稱不存在 | `scrapeXPath` 指向 `xPathScrapers.<name>`；`scrapeJson` 指向 `jsonScrapers.<name>`。 |
| `url` 型別或排序錯誤 | 寫成字串、重複、或未通過 `-s` | 使用 `url: ["..."]` 陣列；同類型不重複；依字母升序排序。 |
| queryURL 結果錯誤 | ByName / fragment 用錯 placeholder | `sceneByName` 只用 `{}`；`sceneByQueryFragment` 用 `{url}`；`{title}` 不是 queryURL placeholder。 |
| `CookieURL` 與 CDP 衝突 | `useCDP: true` 還寫 CookieURL，或非 CDP cookie 缺 CookieURL | CDP 時移除 CookieURL；非 CDP 時每個 configured cookie 要有 CookieURL。 |
| clicks 設定錯誤 | 未開 CDP 就設定 `driver.clicks` | 加 `useCDP: true`，並在需要時加 `sleep`；否則移除 clicks。 |
| `performerByFragment` action 不合法 | 以 `scrapeXPath` 或 `scrapeJson` 實作 | 此 skill 只允許 `action: script`；某些上游情境也接受 `stash`，但 stash-box 不屬本 skill 範圍。 |
| `concat` 不合法 | 放在 `postProcess` 裡 | 把 `concat` 放在 `selector` 同層；它在 postProcess 前執行。 |
| 日期欄位空白但無 Error | `parseDate` layout 不匹配 | 用 Go layout（如 `2006-01-02`），先做 `replace` 清空白/符號，再 parse。 |

## 最小除錯順序

1. 修所有 Errors。
2. 用官方 validator 再跑一次，包含排序檢查。
3. 在 Stash 重載 scrapers。
4. 對真實 URL 執行並查看 debug log。
5. 比對 key fields；YAML 合法但欄位空白仍是 scraper 失敗。

Canonical reference: https://deepwiki.com/stashapp/CommunityScrapers/11.1-common-validation-errors
