# Architecture

> **STASH-SCRAPER-BUILDER 架構說明。**

## 1. 設計目標

一個 repo 同時是：

1. **Agent Skill**：`skills/stash-scraper-builder/` 給 AI 建立刮削器。
2. **刮削器來源**：`scrapers/` 給 Stash 直接匯入。
3. **中文化驗證器**：`validator/index-zh-TW.mjs` 用正體中文報錯。
4. **可 CI 驗證**：`.github/workflows/` 自動驗證與評估。
5. **自動建站**：`site/` 由 CI 產生。

## 2. 目錄結構

```
stash-scraper-builder/
├── AGENTS.md                    # Agent 規則
├── README.md                    # 英文版
├── README_zhTW.md               # 中文版
├── LICENSE-MIT                  # 程式碼授權
├── LICENSE-CC-BY-SA-4.0         # 內容授權
├── .github/workflows/           # CI
│   ├── validate.yml             # 驗證刮削器
│   ├── eval.yml                 # 評估測試
│   └── site.yml                 # 自動建站
├── scripts/                     # 套件級自動化
│   ├── eval-run.sh              # 評估執行
│   └── build-site.sh            # 建站
├── skills/
│   └── stash-scraper-builder/   # Agent Skill
│       ├── SKILL.md             # Agent 入口
│       └── references/          # 參考文件
│           ├── xpath-patterns.md
│           ├── json-patterns.md
│           ├── json-examples.md
│           ├── date-formats.md
│           ├── title-patterns.md
│           ├── performer-cleaning.md
│           ├── schema-checklist.md
│           ├── scraper.schema.json
│           ├── script-actions.md
│           ├── cdp-workflow.md
│           ├── advanced-patterns.md
│           ├── examples.md
│           ├── eval-pack.md
│           ├── request-template.md
│           ├── request-template-zh-TW.md
│           ├── validator-errors-zh-TW.md
│           └── validator-index-messages-zh-TW.md
├── scrapers/                    # 自製刮削器
├── validator/                   # 中文化驗證器
│   ├── index-zh-TW.mjs          # 中文化 validator
│   └── scraper.schema.json      # 最小離線草稿
├── docs/                        # 文件
│   └── ARCHITECTURE.md          # 本檔
├── tests/                       # 測試
├── Build/Scripts/               # 建置腳本
└── site/                        # 自動建站輸出
```

## 3. 資料流

### 3.1 作為 Skill

```
使用者需求 → AGENTS.md → SKILL.md → references/ → 產生刮削器 → validator/ → 驗證通過
```

### 3.2 作為刮削器來源

```
Stash → 讀取 scrapers/*.yml → 執行刮削
```

### 3.3 CI 流程

```
push/PR → validate.yml → eval.yml → site.yml → GitHub Pages
```

## 4. 關鍵設計

| 決策 | 理由 |
| --- | --- |
| `skills/` 與 `scrapers/` 分開 | 一個 repo 同時是 Skill 與刮削器來源，但兩者生命週期不同 |
| `validator/` 獨立 | 中文化 validator 可被 CI 與本地共用 |
| `references/` 在 `skills/stash-scraper-builder/` 下 | 符合 netresearch 風格，Skill 自帶參考 |
| `evals/` 在 `skills/stash-scraper-builder/` 下 | 評估與 Skill 綁定，可版本化 |
| `site/` 為 CI 輸出 | 自動建站結果不進版控 |

## 5. 與 CommunityScrapers 的差異

| 項目 | CommunityScrapers | 本套件 |
| --- | --- | --- |
| 刮削器數量 | 500+ | 自製，不複製 |
| 驗證器語言 | 英文 | 正體中文（`index-zh-TW.mjs`） |
| Skill | 無 | 有（`skills/stash-scraper-builder/`） |
| 評估 | 無 | 有（`evals/` + `eval-pack.md`） |
| 需求表 | 無 | 有（`request-template.md` / `request-template-zh-TW.md`） |
| 自動建站 | 有 | 有（`site.yml`） |

## 6. 擴充點

| 擴充 | 位置 |
| --- | --- |
| 新增刮削器 | `scrapers/` |
| 新增參考文件 | `skills/stash-scraper-builder/references/` |
| 新增評估任務 | `skills/stash-scraper-builder/evals/` |
| 新增 CI 工作 | `.github/workflows/` |
| 新增腳本 | `scripts/` |
| 新增文件 | `docs/` |

## 7. 相依性

| 套件 | 用途 |
| --- | --- |
| Deno | 執行 validator |
| Ajv | JSON Schema 驗證 |
| better-ajv-errors | 錯誤訊息美化 |
| chalk | 終端機顏色 |
| yaml | YAML 解析 |

## 8. 安全性

- 不執行刮削器（只驗證 YAML）。
- 不存取外部網路（除了 CI 下載 Deno）。
- 不寫入使用者檔案（除了 CI 產生 `site/`）。

## 9. 效能

- Validator 是單執行緒，500+ 刮削器約 5 秒。
- 建站是靜態檔案複製，約 1 秒。
- 評估是檔案檢查，約 1 秒。

## 10. 限制

- 不支援 `action: stash` / stash-box。
- 不支援即時 selector 驗證（需人工）。
- 不支援自動翻譯刮削器（需人工）。
