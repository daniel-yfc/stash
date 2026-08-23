# Link Check CI

> **Markdown 連結檢查。** 確保 `SKILL.md` 載入表與所有文件的相對連結永遠有效。

## 涵蓋範圍

| 檢查 | 工具 | 範圍 |
| --- | --- | --- |
| 相對連結（檔案存在性） | markdown-link-check | 所有 `*.md` |
| 外部連結（HTTP 狀態） | markdown-link-check | 所有 `*.md` |
| SKILL.md 載入表專項 | skill-link-check action | `skills/stash-scraper-builder/SKILL.md` |

## 觸發時機

- push 到 `main` 且有 `*.md` / `*.json` 變更
- PR 到 `main` 且有 `*.md` / `*.json` 變更

## 忽略的網域

範例/佔位網域不會真的發請求（見 `.github/markdown-link-check.json`）：

- `localhost` / `127.0.0.1`（CDP 設定）
- `*.test`（範例網站）
- `example.com`（文件範例）
- `github.com/your-org/`（佔位 URL）

## 失敗時怎麼修

| 錯誤 | 修法 |
| --- | --- |
| `FILE NOT FOUND: references/xxx.md` | 檔案被改名或移動；更新 `SKILL.md` 載入表或還原檔案 |
| `ERROR: 404` | 外部連結失效；換成 archive.org 或最新網址 |
| `ERROR: 429` | GitHub 限速；CI 會自動重試 3 次 |

## 本地執行

```bash
npm install -g markdown-link-check
markdown-link-check -c .github/markdown-link-check.json skills/stash-scraper-builder/SKILL.md
find . -name "*.md" -exec markdown-link-check -c .github/markdown-link-check.json {} \;
```
