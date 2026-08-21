# Performer Name Cleaning

**Load when:** performer `Name` or `Gender` is in play.

> **概要（zh-TW）：** 漢字 > 英語 > 假名。只允許複製下方唯一 javascript 區塊，不得改邏輯。無明確性別欄位時 `Gender: fixed: "Male"`。

## Priority

| Input | Output | Pattern |
| --- | --- | --- |
| `東出省吾 Shogo` | `東出省吾` | A Hanzi (+ optional English) |
| `大河(たいが)` | `大河` | B Hanzi + kana in `()` / `（）` |
| `うる Uru` | `Uru` | C kana + English → English |
| `たろう` | `たろう` | D pure kana |

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

## Gender

Default when no scrapeable gender field (state this in the explanation):

```yaml
Gender:
  fixed: "Male"
```

Only if the page has an explicit field:

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

Schema enum (case-insensitive; capitalized form recommended): `male` | `female` | `transgender_male` | `transgender_female` | `intersex` | `non_binary`.
