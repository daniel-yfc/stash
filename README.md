# Stash - Scraper Quality Gate System

A robust quality gate system for web scraper development and deployment.

---

## 🌏 Documentation Routing / 文件導航

### For English Users
1. **Start Here**: [02_Quality_Gate_Overview.md](docs/02_Quality_Gate_Overview.md) - Quick overview
2. **Learn Rules**: [03_Quality_Gate_Rules.md](docs/03_Quality_Gate_Rules.md) - The 5 core rules
3. **Deep Dive**: [01_System_Architecture.md](docs/01_System_Architecture.md) - System design
4. **Production**: [04_Production_Gate.md](docs/04_Production_Gate.md) - Deployment checklist

### 繁體中文使用者
1. **由此開始**: [02_Quality_Gate_Overview.md](docs/02_Quality_Gate_Overview.md) - 快速總覽（中文）
2. **學習規則**: [03_Quality_Gate_Rules.md](docs/03_Quality_Gate_Rules.md) - 5 條核心規則
3. **深入瞭解**: [01_System_Architecture.md](docs/01_System_Architecture.md) - 系統架構
4. **生產部署**: [04_Production_Gate.md](docs/04_Production_Gate.md) - 部署檢查清單

---

## 📚 Complete Documentation / 完整文件

### Level 1: Architecture & Overview / 架構與總覽
- **[01_System_Architecture.md](docs/01_System_Architecture.md)** - System design and architecture / 系統設計與架構
- **[02_Quality_Gate_Overview.md](docs/02_Quality_Gate_Overview.md)** - Quality gate overview (中文) / 品質閘門總覽

### Level 2: Rules & Checklists / 規則與檢查清單
- **[03_Quality_Gate_Rules.md](docs/03_Quality_Gate_Rules.md)** - The 5 core quality gate rules / 5 條核心品質閘門規則
- **[04_Production_Gate.md](docs/04_Production_Gate.md)** - Production checklist (A-H Workstream) / 生產部署檢查清單

### Level 3: Operations & Testing / 營運與測試
- **[05_CI_Workflows.md](docs/05_CI_Workflows.md)** - CI/CD workflows and automation / 持續整合工作流程
- **[06_Testing_Guide.md](docs/06_Testing_Guide.md)** - Testing guide and best practices / 測試指南與最佳實踐

---

## 💡 Key Takeaways / 重點摘要

### What is Stash? / 什麼是 Stash?
- A quality gate system for web scraper development
- 網頁爬蟲開發的品質閘門系統
- Ensures all scrapers follow 5 core rules
- 確保所有爬蟲遵循 5 條核心規則

### Why Use It? / 為什麼使用？
- ✅ **Automated Validation** - Catch errors before deployment
- ✅ **Consistent Quality** - All scrapers follow same standards
- ✅ **CI/CD Integration** - GitHub Actions automation
- ✅ **Bilingual Support** - English & 繁體中文 documentation

### Quick Start / 快速開始
```bash
# Test your scraper
bash scripts/scraper-quality-gate.sh scrapers/YOUR_SCRAPER.yml
```

---

## 🚀 Installation / 安裝

### Prerequisites / 先決條件
- Node.js 18+
- GitHub Actions enabled

### Setup / 設定
```bash
# Clone the repository
git clone https://github.com/daniel-yfc/stash.git

# Install dependencies
npm install

# Run quality gate tests
bash scripts/scraper-quality-gate.sh scrapers/YOUR_SCRAPER.yml
```

---

## 🔧 The 5 Quality Gate Rules / 5 條品質閘門規則

1. **name Must Match Filename** / 名稱必須與檔案名匹配
   - The `name` field must match the filename
   - `name` 欄位必須與檔案名稱相同

2. **useCDP at Top-Level Only** / useCDP 僅限頂層
   - `useCDP` must be in top-level `driver` block only
   - `useCDP` 必須僅在頂層 `driver` 區塊中

3. **No driver.cookies** / 禁止 driver.cookies
   - The `driver.cookies` field is prohibited
   - 禁止使用 `driver.cookies` 欄位

4. **sceneByFragment Required** / 必須有 sceneByFragment
   - Every scraper must include `sceneByFragment`
   - 每個爬蟲必須包含 `sceneByFragment`

5. **Last Updated Header Required** / 必須有最後更新標頭
   - Every scraper must include `# Last Updated: YYYY-MM-DD`
   - 每個爬蟲必須包含 `# Last Updated: YYYY-MM-DD`

📖 **See Details**: [03_Quality_Gate_Rules.md](docs/03_Quality_Gate_Rules.md)

---

## 📁 Project Structure / 專案結構

```
stash/
├── docs/                      # Documentation / 文件
│   ├── 01_System_Architecture.md
│   ├── 02_Quality_Gate_Overview.md    # 中文總覽
│   ├── 03_Quality_Gate_Rules.md       # 5 條規則
│   ├── 04_Production_Gate.md          # 生產檢查清單
│   ├── 05_CI_Workflows.md
│   └── 06_Testing_Guide.md
├── scrapers/                  # Scraper definitions / 爬蟲定義
│   └── YOUR_SCRAPER.yml
├── scripts/                   # Quality gate scripts / 品質閘門腳本
│   └── scraper-quality-gate.sh
├── skills/                    # Skill definitions / 技能定義
│   └── stash-scraper-builder/
└── README.md
```

---

## 🧪 Testing / 測試

### Local Testing / 本機測試
```bash
# Test single scraper / 測試單個爬蟲
bash scripts/scraper-quality-gate.sh scrapers/ACCEED.yml

# Test all scrapers / 測試所有爬蟲
bash scripts/scraper-quality-gate.sh scrapers/*.yml
```

### CI/CD Testing / 持續整合測試
All scrapers are automatically tested on every push via GitHub Actions.
所有爬蟲會透過 GitHub Actions 在每次推送時自動測試。

📖 **See Details**: [05_CI_Workflows.md](docs/05_CI_Workflows.md)

---

## 📋 Production Deployment / 生產部署

Before deploying a scraper to production / 部署爬蟲到生產環境前：

1. ✅ Pass all 5 quality gate rules / 通過所有 5 條品質閘門規則
2. ✅ Complete A-H Workstream checklist / 完成 A-H 工作流程檢查清單
3. ✅ Add proper documentation / 添加適當文件
4. ✅ Test with multiple URLs / 使用多個 URL 測試
5. ✅ Merge to main branch / 合併到 main 分支

📖 **See Details**: [04_Production_Gate.md](docs/04_Production_Gate.md)

---

## 🤝 Contributing / 貢獻

1. Fork the repository / 複製專案
2. Create a feature branch / 建立功能分支
3. Add your scraper to `scrapers/` / 將爬蟲添加到 `scrapers/`
4. Run quality gate tests locally / 在本機運行品質閘門測試
5. Submit a pull request / 提交拉取請求

---

## 📄 License / 授權

MIT License - see LICENSE file for details.
MIT 授權 - 詳情請參閱 LICENSE 檔案。

---

**Last Updated / 最後更新**: 2026-08-28  
**Status / 狀態**: ✅ Active / 啟用
