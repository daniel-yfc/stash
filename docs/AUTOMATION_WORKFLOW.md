# 自動化工作流程

> 版本：v1.0｜日期：2026-08-26

---

## 現有 CI/CD 流程

### 1. Validate Workflow (`.github/workflows/validate.yml`)

**觸發條件**：
- `scrapers/*.yml` 或 `scrapers/**/*.yml` 變更
- `validator/**` 變更
- `skills/**` 變更

**執行內容**：
- 多版本 Node 測試（18, 20）
- npm ci with cache
- 執行 validator

**狀態**：✅ 已部署（PR #18）

---

### 2. Eval Workflow (`.github/workflows/eval.yml`)

**觸發條件**：手動觸發（`workflow_dispatch`）

**執行內容**：
- 執行 eval-pack 5 任務

**狀態**：✅ 已部署（PR #18）

---

### 3. Link Check Workflow (`.github/workflows/link-check.yml`)

**觸發條件**：push / pull_request

**執行內容**：
- 檢查所有 Markdown 檔案的連結

**狀態**：✅ 已部署

---

### 4. Site Workflow (`.github/workflows/site.yml`)

**觸發條件**：push to main

**執行內容**：
- 部署 GitHub Pages

**狀態**：✅ 已部署

---

## 新增自動化腳本

### `scripts/validate-scrapers.sh`

**用途**：本地驗證所有刮削器

**執行方式**：
```bash
chmod +x scripts/validate-scrapers.sh
./scripts/validate-scrapers.sh
```

**功能**：
- 檢查 deno 是否安裝
- 逐一驗證 `scrapers/` 目錄下所有 `.yml` 檔案
- 顯示通過/失敗統計
- 失敗時顯示詳細錯誤訊息

**狀態**：✅ 已部署

---

## 建議的自動化流程

### 1. 本地開發流程

```bash
# 1. 修改刮削器
vim scrapers/YourScraper.yml

# 2. 本地驗證
./scripts/validate-scrapers.sh

# 3. 修正錯誤（如有）
# ...

# 4. 提交
git add scrapers/YourScraper.yml
git commit -m "scraper(YourSite): add new scraper"
git push
```

### 2. CI 自動驗證

當你 push 或建立 PR 時：
- ✅ 自動觸發 validate workflow
- ✅ 自動觸發 link-check workflow
- ✅ 在 PR 中顯示驗證結果

### 3. 生產部署

1. 通過所有 CI 檢查
2. PR 合併到 main
3. 自動部署到 GitHub Pages（如有）

---

## 自動化狀態總覽

| 流程 | 狀態 | 觸發條件 | 負責人 |
| --- | --- | --- | --- |
| Validate | ✅ 已部署 | scrapers/*.yml 變更 | CI |
| Eval | ✅ 已部署 | 手動觸發 | 開發者 |
| Link Check | ✅ 已部署 | push/PR | CI |
| Site Deploy | ✅ 已部署 | push to main | CI |
| Local Validate | ✅ 已部署 | 手動執行 | 開發者 |

---

## 下一步優化（可選）

1. **自動格式化**：建立 `scripts/format-scrapers.sh` 自動修正 YAML 格式
2. **自動重命名**：建立 `scripts/rename-scrapers.sh` 批次移除 `-fixed` 後綴
3. **測試報告**：在 CI 中加入測試報告上傳
4. **Slack/Discord 通知**：CI 失敗時自動通知
