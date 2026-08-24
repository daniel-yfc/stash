# Post-processing pipeline

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/3.3-post-processing-pipeline

## Order of operations

For each field:

1. Selector execution
2. `concat` (if present, before `postProcess`)
3. `postProcess[]` in array order
4. `split` (if present, after `postProcess`)

## Supported operations

Common operators:

- `replace` – string substitution (regex or plain).
- `parseDate` – parse date string using Go reference format (e.g. `"2006-01-02"`).
- `map` – map input strings to new values (e.g. studio normalization).
- `subScraper` – run another scraper to fill a field (expensive; use sparingly).
- `concat` – join multiple matches into one string.
- `split` – split a string into an array.
- `feetToCm`, `lbToKg`, `dimensionToMetric` – unit conversions.
- `subtractDays` – subtract days from a parsed date.
- `javascript` – custom JS transformation.

Important behaviors:

- Failed `parseDate` → field becomes empty (no error).
- Unmatched `replace` / `map` → original string passes through.
- Each `postProcess` item must have exactly one operator.
- Deprecated: inline `replace`, `parseDate`, `subScraper` outside `postProcess`.

## Patterns

- Use `map` for studio normalization instead of many `replace` calls.
- Use `concat` when you expect multiple nodes to contribute to one field.
- Avoid `subScraper` unless no other option exists.
