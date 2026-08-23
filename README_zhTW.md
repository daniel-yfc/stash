# stash-scraper-builder

> **StashApp 刮削器建立工具 + Agent Skill + 自製刮削器集合。**

## 這是什麼

一個 repo 同時是：

1. **Agent Skill**：`skills/stash-scraper-builder/` 給 AI 建立刮削器。
2. **刮削器來源**：`scrapers/` 給 Stash 直接匯入。
3. **中文化驗證器**：`validator/index-zh-TW.mjs` 用正體中文報錯。

## 快速開始

### 作為 Skill 使用

把 `skills/stash-scraper-builder/` 加入你的 Agent skills 目錄，或複製 `SKILL.md` 到你的 prompt。

### 作為刮削器來源使用

在 Stash → Settings → Metadata Providers → Scraping → Scraper Sources 加入：

```
https://github.com/daniel-yfc/stash
```

### 本地驗證

```bash
# 驗證所有刮削器
deno run -R=scrapers,validator/scraper.schema.json validator/index-zh-TW.mjs -a -s scrapers/

# 驗證單一刮削器
deno run -R=scrapers,validator/scraper.schema.json validator/index-zh-TW.mjs scrapers/site-a/site-a.yml
```

## 檔案結構

```
stash-scraper-builder/
├── AGENTS.md                    # Agent 規則
├── README.md                    # 英文版
├── README_zhTW.md               # 本檔
├── LICENSE-MIT
├── LICENSE-CC-BY-SA-4.0
├── .github/workflows/           # CI
├── skills/
│   └── stash-scraper-builder/   # Agent Skill
├── scrapers/                    # 自製刮削器
├── validator/                   # 中文化驗證器
└── site/                        # 自動建站輸出
```

## 真實頁面測試（PR 前必做）

Schema 驗證只能證明結構正確，**不能**證明 selector 真的抓得到資料。每個刮削器在發 PR 前，都必須用**目標網站的真實頁面**測試。

### 規則

- 刮削器實作的**每個功能/模式**都要測（`sceneByURL`、`performerByURL`、`sceneByName`、`sceneByFragment` 等）。
- 每個功能至少測 **3 個真實頁面**（例如 3 支不同影片、3 位不同演出者）。
- 每個測試頁面都要記錄 **URL** 與**每個相關欄位的預期值**（標題、日期、演出者、製作商、標籤、封面…）。
- 3+ 頁面盡量涵蓋邊界情況：缺日期、多位演出者、漢字+英文混合姓名、標題含 `[4K]` 標籤。
- selector 在真實頁面抓不到東西就是 **fail-to-fetch 缺陷**——發 PR 前修好，不要出貨。

### 測試記錄格式（貼到 PR 描述）

| 功能 | 測試 URL | 欄位 | 預期值 | 實際值 | 通過 |
| --- | --- | --- | --- | --- | --- |
| sceneByURL | https://site.test/works/ABP-123 | Title | `範例標題` |  | ☐ |
| sceneByURL | https://site.test/works/ABP-123 | Date | `2024-03-15` |  | ☐ |
| sceneByURL | https://site.test/works/ABP-123 | Performers | `水神雷也` |  | ☐ |
| sceneByURL | https://site.test/works/ABP-124 | Title | `另一支影片` |  | ☐ |
| sceneByURL | https://site.test/works/ABP-125 | Date | *（空——此頁無日期）* |  | ☐ |
| performerByURL | https://site.test/actor/alice | Name | `Alice` |  | ☐ |
| performerByURL | https://site.test/actor/alice | Birthdate | `1995-01-02` |  | ☐ |
| sceneByName | 查詢：`ABP-123` | results[0].URL | `https://site.test/works/ABP-123` |  | ☐ |

最低要求：**每個功能的每個欄位 × 3 個頁面**。沒附此表的 PR 會被要求補上。

## 貢獻

1. 用 `references/request-template.md` 或 `references/request-template-zh-TW.md` 寫需求。
2. 用 `skills/stash-scraper-builder/` 產生刮削器。
3. 用 `validator/index-zh-TW.mjs` 驗證。
4. 用 `references/eval-pack.md` 跑 5 任務測試。
5. **每個功能用 3+ 真實頁面測試**，並填上方測試記錄表。
6. 發 PR，描述中附上測試表。

## 授權

- 程式碼：MIT
- 內容：CC BY-SA 4.0

## 參考

- Stash 刮削器開發文件：https://docs.stashapp.cc/in-app-manual/scraping/scraperdevelopment
- CommunityScrapers：https://github.com/stashapp/CommunityScrapers
- netresearch/skill-repo-skill：https://github.com/netresearch/skill-repo-skill
