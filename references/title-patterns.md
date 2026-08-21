# Title-Cleaning Regex Set

**Load when:** a Title field needs `postProcess: replace`.

> **概要（zh-TW）：** 預設套用下列區塊（網站標題已乾淨則可省略）。規則順序不可改。

Apply to all `Title` fields unless the site is known to emit clean titles.

```yaml
Title:
  selector: "..."
  postProcess:
    - replace:
        - regex: "\\\\s*\\\\[.*?\\\\]\\\\s*$"
          with: ""
        - regex: "\\\\s*【.*?】\\\\s*$"
          with: ""
        - regex: "\\\\s*（.*?）\\\\s*$"
          with: ""
        - regex: "\\\\.(mp4|mkv|avi|wmv|flv|ts|mpg|mpeg|rmvb|mov|m4v|iso|rar|zip|7z)\\\\s*$"
          with: ""
        - regex: "\\\\s{2,}"
          with: " "
        - regex: "^\\\\s+|\\\\s+$"
          with: ""
```

| # | Target |
| --- | --- |
| 1 | Trailing `[…]` tags |
| 2 | Trailing `【…】` |
| 3 | Trailing `（…）` |
| 4 | File extensions |
| 5 | Collapse whitespace |
| 6 | Trim |

Do not reorder: brackets before collapse; collapse before trim; extensions after brackets.

YAML: write `\\s` as `\\\\s` inside double-quoted regex strings. `$1` needs no extra escaping.

Site-name watermark only if the user asks:

```yaml
- regex: "\\\\s*[-–—]\\\\s*SiteName\\\\s*$"
  with: ""
```

Do not strip legitimate title brackets such as `「系列名」`. Do not use greedy `.*`. Do not strip codes like `ABP-123` unless asked.
