# Post-processing pipeline

Canonical reference: https://deepwiki.com/stashapp/CommunityScrapers/3.3-post-processing-pipeline

## Order of operations

For each field:

1. Selector execution (multiple matches → first value only, unless `concat` is set)
2. `concat` — **attribute-level**, before `postProcess`. Not a `postProcess` operator.
3. `postProcess[]` in array order. Each item has **exactly one** operator.
4. `split` — attribute-level, after `postProcess`.

Putting `concat` inside `postProcess` fails schema validation.

## Operator order (quality)

Inside `postProcess`, go **specific → general**:

1. Extract the target substring (`replace` / `javascript`).
2. `parseDate` or `map`.
3. Only then trim / protocol / whitespace cleanup.

A broad `replace` first can destroy the date or studio token the later step needs.

## Supported operations

- `replace` — regex or plain. Unmatched → original string passes through.
- `parseDate` — Go reference layout (`2006-01-02`). Failed parse → field becomes **empty** (no error).
- `map` — exact-key remap (studio / gender). Prefer `map` over a long `replace` list for known variants. Unmatched key → original usually passes through; still list every real variant.
- `subScraper` — extra HTTP request; do not use by default.
- `javascript` — goja; `return` a string from `value`.
- `subtractDays` — after a day-count extract.
- `feetToCm` / `lbToKg` / `dimensionToMetric` — performer units, not dates.

Deprecated: inline `replace` / `parseDate` / `subScraper` outside `postProcess`.

## Patterns

```yaml
Details:
  selector: "//div[@class='desc']//text()"
  concat: "\n"
  postProcess:
    - replace:
        - regex: "</?[a-zA-Z][^>]*>"
          with: ""
```

```yaml
Studio:
  Name:
    selector: "//span[@class='brand']"
    postProcess:
      - map:
          "ex-site": "Example Site"
          "EXSITE": "Example Site"
```

```yaml
Image:
  selector: "//img[@id='poster']/@src | //meta[@property='og:image']/@content"
  postProcess:
    - replace:
        - regex: "^//"
          with: "https://"
        - regex: "/thumb/"
          with: "/poster/"
```

- Use `concat` when several nodes should become one string (Details, mixed `<br>`).
- Use `split` when one string should become an array.
- Avoid `subScraper` unless the value exists only on a second page.
