# Go `parseDate` formats

**Load when:** building Date / Birthdate fields.

> **概要（zh-TW）：** `parseDate` 用 Go 參考時間，不是 `YYYY-MM-DD`。失敗不報錯，欄位變空。`replace` 必須在 `parseDate` 之前。

Canonical reference: https://deepwiki.com/stashapp/CommunityScrapers/3.3-post-processing-pipeline

`parseDate` is a Go layout based on `Mon Jan 2 15:04:05 MST 2006`. Use it inside `postProcess` (attribute-level `parseDate` is deprecated).

**Array order is execution order.**

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

Do **not** write `parseDate: "YYYY-MM-DD"`. That string is not a Go layout; the field becomes empty.

Compact dates such as `20240424` can use `parseDate: "20060102"` directly. You do **not** have to rewrite them to hyphenated ISO first unless the site mixes separators.

`2006年1月2日` fails on zero-padded `2024年03月05日`. Match the site. Mixed `2024.4.24` / `2024/4/24` may need `replace` to a single layout first.

`parseDate` already accepts `Today` / `Yesterday` (case-insensitive).

## Timezones

Stash does **not** convert timezones. A timestamp with `+0900` / `JST` can shift the calendar day vs the site's published date.

Prefer stripping the zone and keeping the date the site shows:

```yaml
postProcess:
  - replace:
      - regex: "[Tt ].*$"
        with: ""
  - parseDate: "2006-01-02"
```

Do not invent YAML TZ math. If you must convert, use `script`.

## `&nbsp;` and irregular whitespace

```yaml
Date:
  selector: "//span[@class='date']"
  postProcess:
    - replace:
        - regex: "[\\xa0\\s]+"
          with: " "
    - parseDate: "2 Jan 2006"
```

## Space-padded day

Raw `2024- 1- 5` → `parseDate: "2006-1-_2"`.

## Relative “N days ago”

```yaml
Date:
  selector: "//span[@class='date']"
  postProcess:
    - replace:
        - regex: "(\\d+)\\s*(days?|日)\\s*(ago|前).*"
          with: "$1"
    - subtractDays: true
```

`replace` first, then `subtractDays`.

## Japanese era (wareki)

Do **not** concatenate an era prefix with the year (`令和6年` → `20186年` is wrong). Omit wareki unless a verified replace/javascript yields a Gregorian layout, then `parseDate`.

Height/weight conversions are not date operations; see `schema-checklist.md`.
