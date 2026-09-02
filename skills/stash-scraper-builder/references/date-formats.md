# Date Formats

Stash uses Go-style reference time layouts for `parseDate`. The reference time is `Mon Jan 2 15:04:05 MST 2006`.

## Common layouts

| Site format | Go layout | Example input |
|---|---|---|
| `2006-01-02` | `2006-01-02` | `2024-03-15` |
| `02 Jan 2006` | `02 Jan 2006` | `15 Mar 2024` |
| `January 2, 2006` | `January 2, 2006` | `March 15, 2024` |
| `02/01/2006` | `02/01/2006` | `15/03/2024` |

## Broken vs. fixed example

```yaml
# Broken — uses non-Go tokens, will silently produce wrong or empty dates
parseDate: "YYYY-MM-DD"

# Fixed — uses Go reference time
parseDate: "2006-01-02"
```

## Post-processing order

Always apply `replace` before `parseDate` when the raw date string contains noise.

```yaml
Date:
  selector: //span[@class="date"]/text()
  postProcess:
    - replace:
        regex: "Published: "
        with: ""
    - parseDate: "January 2, 2006"
```

## Silent failure

If `parseDate` receives a string that does not match the layout, it produces an empty date with no error. Test your layout against a real date string before shipping.
