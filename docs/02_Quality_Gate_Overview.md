# Scraper 品質管線技能總覽

## 📋 執行摘要

本文檔總結 Scraper 品質管線的目前組成、檢查邊界與驗證結果。

---

## 🎯 核心目標

建立一套可維護的 Scraper 開發品質管線，確保：

1. ✅ Scraper 通過官方 CommunityScrapers schema/validator。
2. ✅ Repository policy checks 具備明確且可重現的實作。
3. ✅ CI/CD 與本機測試使用一致的路徑與責任邊界。
4. ✅ 公開與私有 scraper 的認證資料邊界清楚。
5. ✅ 文件、測試與實際 workflow 不互相矛盾。

---

## 📊 系統組成

### 1. 官方驗證

`validate.yml` 在執行時從 `stashapp/CommunityScrapers@master` 取得：

- `validator/index.mjs`。
- `validator/scraper.schema.json`。

它會驗證 `scrapers/**/*.yml`，包含 `scrapers/private/`。官方版本優先於 repository 內可能不同步的 local copies。

### 2. Repository Policy Gate

`tools/scraper-quality-gate.sh` 目前實作以下檢查：

1. XPath scraper 必須有非空的 root `name:`。
2. `sceneByQueryFragment` 若存在，必須使用 `queryURL: "{url}"`。
3. 公開 `scrapers/*.yml` 不得包含 `cookies:`；`scrapers/private/` 可依需求使用 session cookies。
4. `parseDate` 必須使用 Go reference-time layout，不得使用 `YYYY`、`YY`、`DD` 或 `%` 類 strftime tokens。

批次執行：

```bash
bash tools/validate-all.sh
```

### 3. Python Tests

測試位於 `tools/tests/`，涵蓋：

- shell tool syntax checks。
- scraper policy-gate execution。
- skill/reference layout。
- validator、scrapers、tools 與 docs 的基本結構。

執行：

```bash
python -m pytest tools/tests/ -v
```

---

## 📈 CI/CD 工作流

- `validate.yml`: blocking upstream schema validation and URL sorting check.
- `pr-check.yml`: changed-scraper policy gate, documentation check, and PR result comment.
- `link-check.yml`: scheduled link report; non-blocking。
- `eval.yml`: manual pytest evaluation。
- `test-eval.yml`: manual single-scraper policy-gate smoke test。

---

## 📚 參考文件

- [01_System_Architecture.md](01_System_Architecture.md) - 系統架構。
- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) - policy rule 詳情。
- [04_Production_Gate.md](04_Production_Gate.md) - 上線檢核清單。
- [05_CI_Workflows.md](05_CI_Workflows.md) - CI/CD workflows。
- [06_Testing_Guide.md](06_Testing_Guide.md) - 測試指南。

---

**建立日期**: 2026-08-28  
**最後更新**: 2026-09-06  
**版本**: 2.0  
**狀態**: ✅ Active
