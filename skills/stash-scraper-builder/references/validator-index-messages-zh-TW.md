# Validator 錯誤訊息對照表（index.mjs）

| 原文 | 中譯 | 出現位置 |
| --- | --- | --- |
| `ERROR` | 錯誤 | YAML 解析失敗時 |
| `in:` | ： | 檔案路徑前 |
| `Validation passed!` | 驗證通過！ | 成功時 |
| `Valid:` | 驗證： | 每個檔案結果 |
| `通過` | 通過 | 驗證成功 |
| `失敗` | 失敗 | 驗證失敗 |
| `a \`sceneByQueryFragment\` configuration is required for \`sceneByName\` to work` | 使用 `sceneByName` 時必須同時設定 `sceneByQueryFragment` | `_collectConfigMappingErrors` |
| `root object should contain a \`stashServer\` definition` | 必須在根物件中定義 `stashServer` | `action: stash` 但沒 `stashServer` |
| `xPathScrapers should contain a XPath scraper definition for \`${scraper}\`` | xPathScrapers 中缺少 XPath 刮削器定義：`${scraper}` | XPath scraper 參考不存在 |
| `\`${scraper}\` should create an object of type \`${type}\`` | `${scraper}` 定義的實體型別必須是 `${type}` | scraper 型別不符 |
| `jsonScrapers should contain a JSON scraper definition for \`${scraper}\`` | jsonScrapers 中缺少 JSON 刮削器定義：`${scraper}` | JSON scraper 參考不存在 |
| `URLs for type \`${type}\` should be unique, already exists on ${exists}` | 型別 `${type}` 的 URL 不可重複，已存在於 ${exists} | URL 重複 |
| `URL list should be sorted in ascending alphabetical order` | URL 清單必須按字母升序排序 | 使用 `-s` 且未排序 |
| `\`stashServer\` is defined, but never used` | 已定義 `stashServer` 但從未使用 | 未使用 `action: stash` |
| `\`CookieURL\` is required because useCDP is \`false\`` | `useCDP` 為 `false` 時必須設定 `CookieURL` | 非 CDP 模式缺 `CookieURL` |
| `Should not have \`CookieURL\` because useCDP is \`true\`` | `useCDP` 為 `true` 時不得設定 `CookieURL` | CDP 模式有 `CookieURL` |

**旗標說明：**

| 旗標 | 意義 |
| --- | --- |
| `-a` | 顯示所有錯誤（不要遇到第一個就停） |
| `-s` | 強制 URL 清單按字母排序 |
| `-v` | 詳細輸出（每個檔案都顯示驗證結果） |
| `-d` | 允許已棄用功能 |
| `--ci` | CI 模式：失敗時回傳碼 1 |
