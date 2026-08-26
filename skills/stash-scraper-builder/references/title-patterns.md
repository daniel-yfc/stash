# Title patterns

**Load when:** building Title cleaning.

> **概要（zh-TW）：** 有序 `replace`：去標籤括號 → 去副檔名 → 折疊空白 → trim。保留真實標題括號（如 `【系列】作品名`）；依站點語言調整 CJK 標點。

Canonical reference: https://deepwiki.com/stashapp/CommunityScrapers/10.3-best-practices

## Order of operations

Apply in this order. Do not hard-code expected titles.

```yaml
postProcess:
  - replace:
      # 1. Strip bracket tags that are not part of the real title
      - regex: "\\s*\\[.*?\\]\\s*$"
        with: ""
      - regex: "\\s*【.*?】\\s*$"
        with: ""
      - regex: "\\s*（.*?）\\s*$"
        with: ""
      # 2. Strip file extensions
      - regex: "\\.(mp4|mkv|avi|wmv|flv|ts|mpg|mpeg|rmvb|mov|m4v|iso)\\s*$"
        with: ""
      # 3. Collapse whitespace
      - regex: "\\s{2,}"
        with: " "
      # 4. Trim
      - regex: "^\\s+|\\s+$"
        with: ""
```

## Site-specific studio prefix

If the site always prefixes titles with the studio/brand, add one more `replace` before step 3:

```yaml
- regex: "^(BrandName\\s*[:：-]?\\s*)"
  with: ""
```

Do not translate the remaining title. Keep the source language.

## CJK punctuation

For sites that mix full/half-width punctuation, adjust step 1 to include full-width brackets or add a dedicated pass:

```yaml
- regex: "\\s*[\u3000-\u303f].*?\\s*$"
  with: ""
```

Tune per site; do not apply blindly.
