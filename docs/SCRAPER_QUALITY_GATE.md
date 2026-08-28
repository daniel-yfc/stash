# Scraper Quality Gate

> **完整刮削器品質檢核流程。** 所有 scraper 在合併到 main branch 前必須通過以下檢核。

## 檢核流程總覽

```
1. 本地開發 → 2. 5 條規則預檢 → 3. Schema 驗證 → 4. 功能測試 → 5. CI/CD → 6. 合併
```

---

## Phase 1: 5 條規則預檢（必過）

**執行時機：** 每次本地修改後、commit 前

**檢核項目：**

### 1. Root `name:` 必須存在且與檔名一致

```yaml
# ✅ 正確：Coat.yml
name: COAT

# ❌ 錯誤：檔名不符
name: WRONG_NAME  # 檔名是 Coat.yml

# ❌ 錯誤：缺少 name
# 沒有 name: 欄位
```

**驗證指令：**
```bash
# 檢查 name 是否存在
grep -q "^name:" scraper.yml

# 檢查 name 是否與檔名一致（不大小寫）
FILENAME=$(basename scraper.yml .yml | tr '[:lower:]' '[:upper:]')
NAME_VALUE=$(grep "^name:" scraper.yml | cut -d: -f2 | tr -d ' ' | tr '[:lower:]' '[:upper:]')
[ "$FILENAME" = "$NAME_VALUE" ] && echo "✅ PASS" || echo "❌ FAIL"
```

---

### 2. `driver.useCDP` 只能在 top-level `driver` 區塊

```yaml
# ✅ 正確：useCDP 在 top-level driver
driver:
  useCDP: true

sceneByURL:
  - action: scrapeXPath
    # 沒有 useCDP

# ❌ 錯誤：useCDP 在 entry point
sceneByURL:
  - action: scrapeXPath
    useCDP: true  # ❌ 錯誤位置
```

**驗證指令：**
```bash
# 檢查 useCDP 是否出現在 sceneByURL/sceneByName 等 entry point 下
if grep -A20 "^sceneByURL:" scraper.yml | grep -q "useCDP:"; then
  echo "❌ FAIL: useCDP inside sceneByURL"
  exit 1
fi
if grep -A20 "^sceneByName:" scraper.yml | grep -q "useCDP:"; then
  echo "❌ FAIL: useCDP inside sceneByName"
  exit 1
fi
echo "✅ PASS: useCDP placement"
```

---

### 3. Public scraper 不能有 `driver.cookies`

```yaml
# ✅ 正確：public scraper 沒有 cookies
driver:
  useCDP: true
  # 沒有 cookies 區塊

# ❌ 錯誤：public scraper 有 cookies
driver:
  useCDP: false
  cookies:
    - CookieURL: "https://example.com"
      Cookies:
        - Name: SESSIONID
          Value: "abc123"
```

**驗證指令：**
```bash
# 檢查 public scraper 是否有 driver.cookies
if grep -A5 "^driver:" scraper.yml | grep -q "cookies:"; then
  echo "❌ FAIL: driver.cookies found in public scraper"
  echo "   Move to scrapers/private/ or use CDP mode"
  exit 1
fi
echo "✅ PASS: no driver.cookies in public scraper"
```

---

### 4. `sceneByFragment` 在支援 fragment 的網站必須存在

```yaml
# ✅ 正確：有 sceneByFragment
sceneByURL:
  - action: scrapeXPath
    url:
      - "example.com/video/"
    scraper: sceneScraper

sceneByFragment:
  action: scrapeXPath
  scraper: sceneScraper

# ⚠️ 注意：如果網站不支援 fragment，可以不加入
```

**驗證指令：**
```bash
# 檢查是否有 sceneByFragment（如果 site 支援 fragment）
if grep -q "^sceneByFragment:" scraper.yml; then
  echo "✅ PASS: sceneByFragment present"
else
  echo "⚠️  WARNING: sceneByFragment not present"
  echo "   Verify if site supports fragment-based scraping"
fi
```

---

### 5. `# Last Updated` 標頭必須存在

```yaml
# ✅ 正確：有 Last Updated
# Last Updated: 2026-08-28

# ❌ 錯誤：沒有 Last Updated
# 沒有標頭
```

**驗證指令：**
```bash
# 檢查是否有 Last Updated 標頭
if grep -q "^# Last Updated:" scraper.yml; then
  echo "✅ PASS: # Last Updated header present"
else
  echo "❌ FAIL: missing # Last Updated header"
  exit 1
fi
```

---

## Phase 2: Schema 驗證（必過）

**執行時機：** 5 條規則預檢通過後

**工具：** `validator/index-zh-TW.mjs`

**驗證指令：**
```bash
# 執行 validator
deno run --allow-read validator/index-zh-TW.mjs scrapers/YourScraper.yml

# 檢查回傳碼
if [ $? -eq 0 ]; then
  echo "✅ PASS: Schema validation"
else
  echo "❌ FAIL: Schema validation errors"
  exit 1
fi
```

**常見錯誤：**
- 缺少必要欄位（Title, Image 等）
- 類型錯誤（Date 格式錯誤）
- 無效的 XPath 或 JSON path
- 參照的 scraper 不存在

---

## Phase 3: 功能測試（必過）

**執行時機：** Schema 驗證通過後

**測試項目：**

### 3.1 URL Pattern 測試

```bash
# 測試至少 3 個真實 URL
TEST_URLS=(
  "https://example.com/video/123"
  "https://example.com/video/456"
  "https://example.com/video/789"
)

for url in "${TEST_URLS[@]}"; do
  echo "Testing: $url"
  # 在 Stash 中執行 scraper，檢查欄位是否正確
  # 記錄結果
done
```

### 3.2 欄位驗證

- [ ] Title 正確（無多餘空格、標籤）
- [ ] Date 正確（格式 YYYY-MM-DD）
- [ ] Studio 正確（非製造商）
- [ ] Image URL 有效（可訪問）
- [ ] Code 正確（符合網站格式）
- [ ] Performers 正確（無重複、無空值）
- [ ] Tags 正確（有意義的分類）
- [ ] Details 正確（無 HTML、無場景列表）

### 3.3 搜尋功能測試（如果有 sceneByName）

```bash
# 測試搜尋 query
TEST_QUERIES=("keyword1" "keyword2" "keyword3")

for query in "${TEST_QUERIES[@]}"; do
  echo "Testing search: $query"
  # 在 Stash 中執行搜尋，檢查結果是否正確
  # 記錄結果
done
```

---

## Phase 4: CI/CD 自動化驗證

**執行時機：** Push 或 PR 時自動觸發

### 4.1 Lint 5 Rules Workflow

**檔案：** `.github/workflows/lint-rules.yml`

**觸發條件：**
```yaml
on:
  push:
    paths:
      - 'scrapers/*.yml'
      - 'scrapers/**/*.yml'
  pull_request:
    paths:
      - 'scrapers/*.yml'
      - 'scrapers/**/*.yml'
```

**檢核項目：**
1. Root `name:` 存在且與檔名一致
2. `driver.useCDP` 只在 top-level
3. Public scraper 沒有 `driver.cookies`
4. `# Last Updated` 標頭存在
5. `sceneByFragment` 存在（如果 site 支援）

### 4.2 Schema Validation Workflow

**檔案：** `.github/workflows/validate.yml`

**觸發條件：**
```yaml
on:
  push:
    paths:
      - 'scrapers/*.yml'
      - 'scrapers/**/*.yml'
      - 'validator/**'
  pull_request:
    paths:
      - 'scrapers/*.yml'
      - 'scrapers/**/*.yml'
```

**執行步驟：**
1. 安裝 Deno
2. 執行 `validator/index-zh-TW.mjs`
3. 回報錯誤

### 4.3 Link Check Workflow

**檔案：** `.github/workflows/link-check.yml`

**觸發條件：**
```yaml
on:
  push:
  pull_request:
```

**執行步驟：**
1. 檢查 Markdown 檔案中的連結
2. 驗證外部連結是否有效
3. 回報失效連結

---

## Phase 5: 人工審查（必過）

**執行時機：** CI/CD 全部通過後

**審查項目：**

### 5.1 程式碼審查

- [ ] XPath/JSON path 是否穩定（避免 `div[3]` 等脆弱選擇器）
- [ ] JavaScript 是否過度複雜（可維護性）
- [ ] 是否有適當的錯誤處理
- [ ] 是否有適當的註解

### 5.2 文件審查

- [ ] `# Last Updated` 日期是否正確
- [ ] 驗證狀態是否標註清楚（`VERIFIED` / `UNVERIFIED`）
- [ ] 測試 URL 是否記錄完整
- [ ] 已知問題是否記錄

### 5.3 安全性審查

- [ ] Public scraper 沒有 session tokens
- [ ] 沒有硬編碼的 credentials
- [ ] CDP 配置正確（如果需要）

---

## 完整檢核清單

**在合併到 main branch 前，必須全部通過：**

```markdown
## Phase 1: 5 條規則預檢
- [ ] 1. Root `name:` 存在且與檔名一致
- [ ] 2. `driver.useCDP` 只在 top-level
- [ ] 3. Public scraper 沒有 `driver.cookies`
- [ ] 4. `sceneByFragment` 存在（如果 site 支援）
- [ ] 5. `# Last Updated` 標頭存在

## Phase 2: Schema 驗證
- [ ] Validator 通過（無 schema 錯誤）

## Phase 3: 功能測試
- [ ] 測試至少 3 個真實 URL
- [ ] 所有必要欄位正確（Title, Date, Studio, Image）
- [ ] 搜尋功能正常（如果有 sceneByName）
- [ ] 標註驗證狀態（`VERIFIED` / `UNVERIFIED`）

## Phase 4: CI/CD
- [ ] Lint 5 Rules Workflow 通過
- [ ] Schema Validation Workflow 通過
- [ ] Link Check Workflow 通過

## Phase 5: 人工審查
- [ ] 程式碼審查通過
- [ ] 文件審查通過
- [ ] 安全性審查通過
```

---

## 自動化腳本

### 本地完整檢核腳本

```bash
#!/bin/bash
# scripts/scraper-quality-gate.sh

set -e

SCRAPER_FILE=$1

if [ -z "$SCRAPER_FILE" ]; then
  echo "Usage: $0 <scraper.yml>"
  exit 1
fi

echo "=== Scraper Quality Gate ==="
echo "File: $SCRAPER_FILE"
echo ""

# Phase 1: 5 條規則預檢
echo "Phase 1: 5 Rules Pre-check"
echo "--------------------------"

# Rule 1: name exists and matches filename
FILENAME=$(basename "$SCRAPER_FILE" .yml | tr '[:lower:]' '[:upper:]')
NAME_VALUE=$(grep "^name:" "$SCRAPER_FILE" | cut -d: -f2 | tr -d ' ' | tr '[:lower:]' '[:upper:]')
if [ "$FILENAME" = "$NAME_VALUE" ]; then
  echo "✅ Rule 1: name matches filename ($NAME_VALUE)"
else
  echo "❌ Rule 1: name mismatch (filename: $FILENAME, name: $NAME_VALUE)"
  exit 1
fi

# Rule 2: useCDP placement
if grep -A20 "^sceneByURL:" "$SCRAPER_FILE" | grep -q "useCDP:"; then
  echo "❌ Rule 2: useCDP inside sceneByURL"
  exit 1
fi
if grep -A20 "^sceneByName:" "$SCRAPER_FILE" | grep -q "useCDP:"; then
  echo "❌ Rule 2: useCDP inside sceneByName"
  exit 1
fi
echo "✅ Rule 2: useCDP placement correct"

# Rule 3: no driver.cookies in public scraper
if grep -A5 "^driver:" "$SCRAPER_FILE" | grep -q "cookies:"; then
  echo "❌ Rule 3: driver.cookies found in public scraper"
  exit 1
fi
echo "✅ Rule 3: no driver.cookies in public scraper"

# Rule 4: sceneByFragment (warning only)
if grep -q "^sceneByFragment:" "$SCRAPER_FILE"; then
  echo "✅ Rule 4: sceneByFragment present"
else
  echo "⚠️  Rule 4: sceneByFragment not present (verify if needed)"
fi

# Rule 5: Last Updated header
if grep -q "^# Last Updated:" "$SCRAPER_FILE"; then
  echo "✅ Rule 5: # Last Updated header present"
else
  echo "❌ Rule 5: missing # Last Updated header"
  exit 1
fi

echo ""
echo "Phase 1: PASSED"
echo ""

# Phase 2: Schema validation
echo "Phase 2: Schema Validation"
echo "--------------------------"
if deno run --allow-read validator/index-zh-TW.mjs "$SCRAPER_FILE"; then
  echo "✅ Schema validation: PASSED"
else
  echo "❌ Schema validation: FAILED"
  exit 1
fi

echo ""
echo "=== All Phases PASSED ==="
echo "Scraper is ready for commit and PR"
```

**使用方式：**
```bash
# 執行完整檢核
bash scripts/scraper-quality-gate.sh scrapers/YourScraper.yml
```

---

## 錯誤處理

### 如果檢核失敗

1. **Phase 1 失敗**：立即修正 5 條規則違反
2. **Phase 2 失敗**：查看 validator 錯誤訊息，修正 schema 問題
3. **Phase 3 失敗**：重新測試 URL，修正 selector 或 post-processing
4. **Phase 4 失敗**：查看 GitHub Actions 日誌，修正 CI 錯誤
5. **Phase 5 失敗**：根據審查意見修正

### 如果無法確定

1. 查閱 `skills/stash-scraper-builder/references/` 文件
2. 查看 `docs/PRODUCTION_CHECKLIST.md`
3. 參考已通過的 scraper 範例（如 `CK-Download.yml`, `Hunks-Ch.yml`）
4. 在 PR 中提問

---

## 相關文件

- [`AGENTS.md`](../AGENTS.md) - AI agent 規則
- [`skills/stash-scraper-builder/SKILL.md`](../skills/stash-scraper-builder/SKILL.md) - Skill 定義
- [`skills/stash-scraper-builder/references/schema-checklist.md`](../skills/stash-scraper-builder/references/schema-checklist.md) - Schema 檢查清單
- [`docs/PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md) - 生產就檢清單
- [`validator/index-zh-TW.mjs`](../validator/index-zh-TW.mjs) - 驗證器
- [`.github/workflows/lint-rules.yml`](../.github/workflows/lint-rules.yml) - Lint 5 Rules CI
- [`.github/workflows/validate.yml`](../.github/workflows/validate.yml) - Schema Validation CI
