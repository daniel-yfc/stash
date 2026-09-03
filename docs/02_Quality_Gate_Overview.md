# Scraper 品質管線總覽

## 📋 執行摘要

本文檔說明 Stash Scraper 品質管線（Quality Gate Pipeline）的架構與標準。品質管線旨在確保所有 Scraper 程式碼符合技術規範、業務需求與 CI/CD 自動化檢查。

---

## 🎯 核心目標

建立一套完整的 Scraper 開發與驗證管線，確保：
1. **技術規範**：遵循品質閘門核心規則（格式、結構與安全性）。
2. **業務與資料品質**：涵蓋完整欄位提取與場景需求（A-H Workstream）。
3. **自動化驗證**：透過 CI/CD 在提交與 Pull Request 時自動執行檢查。
4. **職責分離**：區分公開版（`scrapers/`）與私有版（`scrapers/private/`）檔案。
5. **測試覆蓋**：提供完整的語法、Schema 與單元測試機制。

---

## 🏛️ 品質管線架構

### 1. 技術檢核機制

核心規則由 `scripts/scraper-quality-gate.sh` 自動化檢查：
- **Rule 1**: YAML 根層級 `name` 欄位必須與檔名一致。
- **Rule 2**: `useCDP` 僅能宣告於頂層 `driver` 區塊。
- **Rule 3**: 公開 scraper 禁止包含 `driver.cookies`（私有版本需置於 `scrapers/private/`）。
- **Rule 4**: 必須包含 `sceneByFragment` 等相應片段定義。
- **Rule 5**: 必須包含 `# Last Updated: YYYY-MM-DD` 標頭註記。

### 2. 業務檢核機制 (A-H Workstream)

- **A: 需求分析與場景定義**（Target & Scenario）
- **B: 技術實作與程式碼審查**（Implementation & Code Review）
- **C: 內容品質與欄位覆蓋**（Content Quality & Field Coverage）
- **D: 測試驗證與評估**（Testing & Evaluation）
- **E: 文件完整性**（Documentation Completeness）
- **F: 安全性檢核**（Security Controls & Credential Isolation）
- **G: 效能優化**（Performance & Selector Stability）
- **H: 上線部署與監控**（Deployment & CI Gate Monitoring）

### 3. CI/CD 工作流

- `validate.yml` — 全量 Scraper Schema 驗證與品質閘門檢查。
- `pr-check.yml` — Pull Request 變更檔案自動檢查與回饋。
- `link-check.yml` — 內部與外部文件連結有效性定期檢核。
- `eval.yml` / `test-eval.yml` — 評估套件測試與驗證。

---

## 📚 參考文件

### 核心指南
- [01_System_Architecture.md](01_System_Architecture.md) — 系統架構說明
- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) — 品質閘門 5 大規則細節
- [04_Production_Gate.md](04_Production_Gate.md) — 上線前業務檢核表（A-H Workstream）
- [05_CI_Workflows.md](05_CI_Workflows.md) — CI/CD 工作流說明
- [06_Testing_Guide.md](06_Testing_Guide.md) — 本地與 CI 測試指南
