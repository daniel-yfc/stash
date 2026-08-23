# 驗證器錯誤訊息中譯（CommunityScrapers）

**來源：** `validator/index.mjs` / `index.js` + 常見錯誤頁面。  
**用途：** 把驗證器報錯與訊息翻成正體中文，方便除錯。

> **概要：** 五大類錯誤：Schema 違規、設定映射、刮削器參考、Cookie 設定、URL 規則。每條錯誤附範例與修正。

## 錯誤分類總覽

| 類別 | 驗證函式 | 常見原因 |
| --- | --- | --- |
| Schema 違規 | AJV `compile()` | 屬性名稱錯誤、型別錯誤、缺少必填 |
| 設定映射 | `_collectConfigMappingErrors()` | 缺少相依設定（例如 `sceneByQueryFragment`） |
| 刮削器參考 | `_collectScraperDefinitionErrors()` | 參考的 scraper 不存在、型別不符、未使用 |
| Cookie 設定 | `_collectCookieErrors()` | `CookieURL` 與 `useCDP` 衝突 |
| URL 規則 | `_collectScraperDefinitionErrors()` | URL 重複、未排序（`-s` 旗標） |

---

## Schema 驗證錯誤

### 1. 未知屬性（Unknown Property）

**原因：** 設定檔出現 schema 未定義的屬性名稱。

**範例：**
```text
ERROR in: scrapers/Example.yml:
> 1 | name: Example
    | ^^^^^ 不允許額外屬性 name
```

**常見失誤：**
- 拼錯（`xPathScraper` 而非 `xPathScrapers`）
- 在根層使用已棄用屬性
- 自訂 schema 沒有的屬性

**修正：**
```yaml
# 錯
xPathScraper: ...

# 對
xPathScrapers: ...
```

---

### 2. 缺少必填屬性（Missing Required Property）

**原因：** 缺少必填欄位。

**範例：**
```text
ERROR in: scrapers/Example.yml:
> sceneByURL[0] 缺少必填屬性 'scraper'
```

**常見缺少：** `name`、`action`、`url`、`scraper`、`script`

**修正：**
```yaml
# 錯
sceneByURL:
  - action: scrapeXPath
    url: ["example.com"]

# 對
sceneByURL:
  - action: scrapeXPath
    url: ["example.com"]
    scraper: sceneScraper
```

---

### 3. 無效的列舉值（Invalid Enum Value）

**原因：** 欄位填入不允許的值（例如 `action`）。

**範例：**
```text
ERROR in: scrapers/Example.yml:
> sceneByURL[0].action 必須是以下之一：["script","scrapeXPath","scrapeJson"]
```

**有效 `action`：**
- `*ByURL`：`script`、`scrapeXPath`、`scrapeJson`
- `sceneByFragment`：以上 + `stash`
- `performerByFragment`：僅 `script`、`stash`
- `sceneByName`：`scrapeXPath`、`scrapeJson`（`script` 允許但 `queryURLReplace` 不支援）

**修正：**
```yaml
# 錯
action: scrapeXpath

# 對
action: scrapeXPath
```

---

### 4. 型別錯誤（Type Mismatch）

**原因：** 型別不符（例如字串 vs 陣列）。

**範例：**
```text
ERROR in: scrapers/Example.yml:
> sceneByURL 必須是陣列
```

**修正：**
```yaml
# 錯
sceneByURL:
  action: scrapeXPath

# 對
sceneByURL:
  - action: scrapeXPath
    url: ["example.com"]
    scraper: sceneScraper
```

---

## 設定映射錯誤（Configuration Mapping）

### sceneByName 必須搭配 sceneByQueryFragment

**原因：** 有 `sceneByName` 但沒 `sceneByQueryFragment`。

**範例：**
```text
ERROR in: scrapers/Example.yml:
/sceneByName
✖ `sceneByQueryFragment` 為必填，`sceneByName` 才能運作
```

**說明：** 搜尋流程：
1. 使用者以名稱搜尋
2. 回傳結果（URL 列表）
3. 選一個結果
4. 呼叫 `sceneByQueryFragment` 刮該 URL

**修正：**
```yaml
# 錯
sceneByName:
  action: scrapeXPath
  queryURL: "https://site.test/search?q={}"
  scraper: sceneSearch

# 對
sceneByName:
  action: scrapeXPath
  queryURL: "https://site.test/search?q={}"
  scraper: sceneSearch

sceneByQueryFragment:
  action: scrapeXPath
  queryURL: "https://site.test/search?q={title}"
  scraper: sceneSearch
```

---

## 刮削器參考錯誤

### 缺少 Scraper 定義

**原因：** `scraper` 欄位指向不存在的定義。

**範例：**
```text
ERROR in: scrapers/Example.yml:
/sceneByURL/0/scraper
✖ xPathScrapers 必須包含 XPath scraper 定義 `sceneScraper`
```

**修正：**
```yaml
# 錯
sceneByURL:
  - action: scrapeXPath
    url: ["example.com"]
    scraper: sceneScraper

xPathScrapers:
  otherScraper: ...

# 對
xPathScrapers:
  sceneScraper:
    scene:
      Title:
        selector: "//h1/text()"
```

---

### Scraper 型別不符

**原因：** 定義存在但實體型別不對（scene/performer/movie/gallery）。

**範例：**
```text
ERROR in: scrapers/Example.yml:
/xPathScrapers/sceneScraper
✖ `sceneScraper` 必須建立 `scene` 型別物件
```

**修正：**
```yaml
# 錯
xPathScrapers:
  sceneScraper:
    performer:
      Name: ...

# 對
xPathScrapers:
  sceneScraper:
    scene:
      Title: ...
```

---

### URL 重複

**原因：** 同一實體型別的 URL 重複。

**範例：**
```text
ERROR in: scrapers/Example.yml:
/sceneByURL/1/url/0
✖ `scene` 型別的 URL 必須唯一，已存在於 /sceneByURL/0/url/1
```

**修正：** 移除重複或改用不同模式。

---

### URL 未排序（`-s` 旗標）

**原因：** 使用 `-s` 時，URL 陣列需按字母排序。

**範例：**
```text
ERROR in: scrapers/Example.yml:
/sceneByURL/0/url
✖ URL 陣列應按字母升序排序
```

**修正：**
```yaml
# 錯
url:
  - "z.com"
  - "a.com"

# 對
url:
  - "a.com"
  - "z.com"
```

---

### 未使用的 stashServer

**原因：** 定義了 `stashServer` 但沒有任何 `action: stash` 入口。

**範例：**
```text
ERROR in: scrapers/Example.yml:
/stashServer
✖ 定義了 `stashServer` 但從未使用
```

**修正：** 移除 `stashServer` 或新增 `action: stash` 入口。

---

## Cookie 設定錯誤

### 非 CDP 模式缺少 CookieURL

**規則：** `useCDP: false`（或未設）時，每個 cookie 必須有 `CookieURL`。

**範例：**
```text
ERROR in: scrapers/Example.yml:
/driver/cookies/0
✖ 因為 useCDP 為 `false`，所以必填 `CookieURL`
```

**修正：**
```yaml
driver:
  useCDP: false
  cookies:
    - Name: "session"
      Value: "abc123"
      CookieURL: "https://site.test"
```

---

### CDP 模式不該有 CookieURL

**規則：** `useCDP: true` 時，cookie 不該有 `CookieURL`。

**範例：**
```text
ERROR in: scrapers/Example.yml:
/driver/cookies/0/CookieURL
✖ 因為 useCDP 為 `true`，所以不該有 `CookieURL`
```

**修正：**
```yaml
driver:
  useCDP: true
  cookies:
    - Name: "session"
      Value: "abc123"
      # 移除 CookieURL
```

---

## 已棄用功能警告

### 內嵌 postProcess 操作（已棄用）

**舊語法（仍可用但不建議）：**
```yaml
Date:
  selector: "//span/text()"
  parseDate: "2 Jan 2006"
```

**新語法（建議）：**
```yaml
Date:
  selector: "//span/text()"
  postProcess:
    - parseDate: "2 Jan 2006"
```

**已棄用操作：** `parseDate`、`replace`、`subScraper`（在屬性層）→ 改用 `postProcess[]`。

---

## 常見 YAML 語法錯誤（非驗證器錯誤）

### 縮排錯誤

YAML 需一致縮排（通常 2 空格）：

```yaml
# 錯
scene:
   Title: "..."

# 對
scene:
  Title: "..."
```

### 錨點/別名錯誤

錨點需先定義：

```yaml
# 錯
performer: &perf
  Name: "..."
scene:
  Performers:
    - *perf

# 對
xPathScrapers:
  commonPerf: &perf
    Name: "..."
  sceneScraper:
    scene:
      Performers:
        - *perf
```

---

## 驗證工作流程

1. 修正 YAML 語法
2. 跑 validator（無旗標）
3. 修正第一個錯誤
4. 重複直到通過
5. 用 `-a` 看所有錯誤
6. 用 `-s` 檢查 URL 排序
7. 用 `-v` 看所有檔案結果

**建議旗標：**

| 旗標 | 用途 | 時機 |
| --- | --- | --- |
| 無 | 遇到第一個錯誤就停，基本檢查 | 初期開發 |
| `-a` | 顯示所有錯誤 | 全面檢查 |
| `-s` | 強制 URL 排序 | 準備 PR |
| `-v` | 詳細輸出（所有檔案） | 除錯 |
| `-d` | 允許已棄用功能 | 維護舊刮削器 |
| `--ci` | 失敗時回傳碼 1 | 自動化 |

---

## 快速參考：錯誤對照表

| 錯誤類型 | 快速修正 |
| --- | --- |
| 未知屬性 | 檢查拼寫，只用 schema 定義的屬性 |
| 缺少必填 | 補上 `name`、`action`、`url`、`scraper`、`script` |
| 無效 action | 用合法列舉：`script`、`scrapeXPath`、`scrapeJson`、`stash` |
| `sceneByName` 無 `sceneByQueryFragment` | 補上 `sceneByQueryFragment` |
| 缺少 scraper 定義 | 加到 `xPathScrapers` 或 `jsonScrapers` |
| 型別不符 | 確認 scraper 定義的實體型別（scene/performer/…） |
| URL 重複 | 移除重複或改用不同模式 |
| URL 未排序 | 字母升序排序（`-s` 時） |
| `useCDP: true` 但有 `CookieURL` | 移除 `CookieURL` |
| `useCDP: false` 但缺 `CookieURL` | 補上 `CookieURL` |
| 未使用的 `stashServer` | 移除或新增 `action: stash` 入口 |

---

## 執行驗證器

```bash
# 基本
deno run -R=scrapers -R=validator/scraper.schema.json validate.js scrapers/xxx.yml

# 所有錯誤
deno run ... validate.js -a scrapers/xxx.yml

# 強制排序
deno run ... validate.js -s scrapers/xxx.yml

# 詳細
deno run ... validate.js -v scrapers/
```

本文件僅供**人工參考**，技能不會載入。
