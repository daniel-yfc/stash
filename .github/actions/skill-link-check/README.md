# skill-link-check

> 驗證 `SKILL.md` 中每個 `references/` 連結都指向真實檔案的複合 Action。

## 功能

1. **連結檢查**：`SKILL.md` 載入表裡的每個 `references/xxx.md` 必須存在，否則 CI 失敗。
2. **孤兒檢查**：`references/` 裡存在但未被連結的檔案會以 `::notice` 提示（不會失敗）——human-only 文件屬正常。

## 使用

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/skill-link-check
    with:
      skill-file: skills/stash-scraper-builder/SKILL.md   # 預設值
      extensions: "md|json"                                # 預設值
```

## 輸入

| 輸入 | 預設 | 說明 |
| --- | --- | --- |
| `skill-file` | `skills/stash-scraper-builder/SKILL.md` | SKILL.md 路徑 |
| `extensions` | `md\|json` | 允許的參考副檔名（regex） |

## 跨 repo 重用

```yaml
- uses: daniel-yfc/stash/.github/actions/skill-link-check@main
  with:
    skill-file: path/to/SKILL.md
```

## 失敗範例

```
::error file=skills/stash-scraper-builder/SKILL.md::連結失效：references/eval-pack.md（找不到 skills/stash-scraper-builder/references/eval-pack.md）
```
