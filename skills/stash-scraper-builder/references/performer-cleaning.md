# Performer name cleaning

**Load when:** building Performer Name (and optionally Gender).

> **概要（zh-TW）：** 漢字 > 英語 > 假名。保留 `・` / `-`。無明確性別欄位時預設不寫 Gender；單性別站才用 `fixed`。別名用 `replace` 去掉 ` / ` 後段。

Canonical reference: https://deepwiki.com/stashapp/CommunityScrapers/10.3-best-practices

## Priority

| Input | Output | Pattern |
| --- | --- | --- |
| `東出省吾 Shogo` | `東出省吾` | Hanzi (+ optional English) |
| `大河 (たいが)` / `大河（たいが）` | `大河` | Hanzi + kana in parens |
| `うる Uru` | `Uru` | kana + English → English |
| `たろう` | `たろう` | pure kana |

## Canonical block (copy verbatim)

goja engine; input is `value`; must `return` a string. This is the only authorized implementation.

```yaml
postProcess:
  - javascript: |
      var cleaned = value.replace(/\s+/g, ' ').trim();
      var m1 = cleaned.match(/^([\u4e00-\u9fff\u3400-\u4dbf]+(?:\s+[\u4e00-\u9fff\u3400-\u4dbf]+)*)(?:\s+[A-Za-z]+)?$/);
      if (m1) return m1[1].replace(/\s+/g, '');
      var m2 = cleaned.match(/^([\u4e00-\u9fff\u3400-\u4dbf]+)\s*[\(（][^\)）]+[\)）]$/);
      if (m2) return m2[1];
      var m3 = cleaned.match(/^[\u3041-\u3093\u30a1-\u30f6\u30fc\u3005\u309b\u309c]+\s+([A-Za-z]+)$/);
      if (m3) return m3[1];
      if (/^[\u3041-\u3093\u30a1-\u30f6\u30fc\u3005\u309b\u309c\s]+$/.test(cleaned)) return cleaned.replace(/\s+/g, '');
      return cleaned;
```

`\u4e00-\u9fff\u3400-\u4dbf` = CJK Unified + Ext. A. `\u3041-\u3093\u30a1-\u30f6` = hiragana + katakana. `\u30fc\u3005\u309b\u309c` = `ー々゛゜`.

## Preserve symbols

- Keep `・` and `-` unless the site standardizes names without them.
- Do not translate or romanize.

## Gender

Default: do not write Gender when no explicit field exists.

Single-gender sites may use `fixed` with a stated reason:

```yaml
Gender:
  fixed: "Female"  # all performers on this site are female
```

When an explicit field exists, map to the schema enum (case-insensitive; capitalize output):

```yaml
Gender:
  selector: "//dt[contains(text(),'性別')]/following-sibling::dd[1]/text()"
  postProcess:
    - map:
        "男": "Male"
        "男性": "Male"
        "女": "Female"
        "女性": "Female"
```

## Aliases

If the site appends aliases like `Name / Alias`, strip the alias:

```yaml
postProcess:
  - replace:
      - regex: "\\s*/.*$"
        with: ""
```

## Unmatched regex

If none of the patterns match, return the original string. Do not force a rewrite.
