# Go `parseDate` Formats

**Load when:** building Date / Birthdate fields.

> **概要（zh-TW）：** 使用 Go 參考時間；`1`/`2` 不補零、`01`/`02` 補零。`&nbsp;` 必須先 `replace`。

`parseDate` is a Go layout based on `Mon Jan 2 15:04:05 MST 2006`. Use it inside `postProcess` (attribute-level `parseDate` is deprecated).

**Array order is execution order.** Put `replace` before `parseDate` when you need it.

## Layouts

| Placeholder | Meaning |
| --- | --- |
| `2006` | Four-digit year |
| `01` / `1` | Month, zero-padded / not |
| `02` / `2` | Day, zero-padded / not |
| `_2` | Day, space-padded |
| `Jan` / `January` | English month |
| `15` `04` `05` | Hour 24h, minute, second |
| `-0700` | Timezone offset |
| `unix` | Unix timestamp |

| Raw example | `parseDate` |
| --- | --- |
| `2024-01-15` | `2006-01-02` |
| `2024.01.15` | `2006.01.02` |
| `2024/01/15` | `2006/01/02` |
| `20240115` | `20060102` |
| `Jan 15, 2024` | `Jan 2, 2006` |
| `15 Jan 2024` | `2 Jan 2006` |
| `2024年1月15日` | `2006年1月2日` |
| `2024年01月15日` | `2006年01月02日` |
| `1705276800` | `unix` |

`2006年1月2日` fails on zero-padded `2024年03月05日`. Match the site.

`parseDate` already accepts `Today` / `Yesterday` (case-insensitive).

## `&nbsp;` and irregular whitespace

```yaml
Date:
  selector: "//span[@class='date']/text()"
  postProcess:
    - replace:
        - regex: "[\\\\xa0\\\\s]+"
          with: " "
    - parseDate: "2 Jan 2006"
```

## Space-padded day

Raw `2024- 1- 5`:

```yaml
postProcess:
  - parseDate: "2006-1-_2"
```

## Relative “N days ago”

```yaml
Date:
  selector: "//span[@class='date']/text()"
  postProcess:
    - replace:
        - regex: "(\\\\d+)\\\\s*(days?|日)\\\\s*(ago|前).*"
          with: "$1"
    - subtractDays: true
```

## Japanese era (wareki)

Do **not** string-concatenate an era prefix with the year (`令和6年` → `20186年` is wrong). Omit wareki unless you have a verified replace/javascript that yields a Gregorian layout, then `parseDate`.

Height/weight conversions (`feetToCm`, `lbToKg`, `dimensionToMetric`) are listed in `schema-checklist.md`, not here.
