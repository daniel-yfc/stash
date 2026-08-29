# JSON Patterns

Patterns and guidance for JSON-based scrapers.

## queryURL rules

| Mode | queryURL value |
|------|----------------|
| `sceneByName` | `{}` (empty object for search endpoint) |
| `sceneByQueryFragment` | `{url}` of the selected hit, optionally rewritten with `queryURLReplace`. |
| `sceneByURL` / `sceneByFragment` | Optional rewrite of the pasted URL into an API URL. |

**Official queryURL placeholders:**
- `{}` — empty object (used for `sceneByName` search endpoint)
- `{url}` — the selected hit URL (used for `sceneByQueryFragment`)
- `{filename}` — the scraper filename (fragment modes)
- `{title}` — **official for `sceneByFragment`** but use `{url}` for fragment queries that fetch scene details

**Important:** While `{title}` is an official placeholder for `sceneByFragment`, the recommended practice is to use `{url}` for `sceneByQueryFragment` to pass the selected scene URL. Do not construct queryURLs pointing to search endpoints for fragment queries.

`queryURLReplace` keys are **your** names (`id`, `slug`) filled from regex on the input URL.

```yaml
sceneByName:
  action: scrapeJson
  queryURL: {}
  queryURLReplace:
    search: "(.*)"
    replace: "https://api.example.com/search?q=$1"

sceneByQueryFragment:
  action: scrapeJson
  queryURL: "{url}"
```

## GJSON patterns

- Use `items.#.field` notation for arrays
- Filters like `[?(@.type=='scene')]` may return null; prefer direct path or use `script`
- Test GJSON expressions in validator before deploying

## jsonScrapers structure

```yaml
jsonScrapers:
  scene:
    Title: $.title
    Date: $.date
    Studio:
      name: $.studio.name
    Image: $.poster_url
    Performers: $.actors.#.name
```

## Common patterns

### Nested objects

```yaml
Studio:
  name: $.studio.name
  url: $.studio.url
```

### Arrays

```yaml
Performers: $.cast.#.name
Tags: $.tags.#.name
```

### Conditional fields

```yaml
Date:
  selector: $.release_date
  postProcess:
    - parseDate: 2006-01-02
```

## References

- `references/json-examples.md` — Complete JSON scraper templates
- `references/script-actions.md` — When JSON isn't enough, use `script`
