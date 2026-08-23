# JSON Scraping Patterns

**Load when:** writing or fixing `scrapeJson` (GJSON) selectors.

> **概要（zh-TW）：** GJSON 是 JSONPath 子集。路徑用 `.` 分隔；陣列用 `[0]`、`[*]`；`..` 遞迴搜尋。先用真實 API 回應驗證。

## 1. GJSON basics

GJSON is a subset of JSONPath used by Stash. Paths are strings like `data.title` or `items[*].url`.

| Form | Meaning |
| --- | --- |
| `data.title` | `data.title` field |
| `items[0]` | First element of `items` |
| `items[*]` | All elements (returns array) |
| `..title` | Recursive search for `title` anywhere |
| `items[?(@.type=="scene")]` | Filter by field (when supported) |

Always test the path against the real JSON body, not a guessed schema.

## 2. Selector shape

```yaml
sceneByURL:
  - action: scrapeJson
    url:
      - "api.example.com/v1/scene/"
    scraper: sceneJson

xPathScrapers:
  sceneJson:
    scene:
      Title:
        selector: "data.title"
      Date:
        selector: "data.release_date"
        postProcess:
          - parseDate: "2006-01-02"
      Image:
        selector: "data.cover_url"
      Performers:
        Name:
          selector: "data.performers[*].name"
        Gender:
          fixed: "Male"
      Studio:
        Name:
          selector: "data.studio.name"
```

`scrapeJson` returns a single object; `*ByName` returns an array.

## 3. Common patterns

### Nested objects

```yaml
Studio:
  Name:
    selector: "meta.studio.name"
  URL:
    selector: "meta.studio.url"
```

### Arrays

```yaml
Performers:
  Name:
    selector: "cast[*].name"
  URL:
    selector: "cast[*].profile_url"
```

### Recursive search

```yaml
Details:
  selector: "..description"
```

Use only when the key is unique in the response.

### Filtering (when supported)

```yaml
Tags:
  Name:
    selector: "tags[?(@.type=='category')].name"
```

If the validator rejects this, fall back to a plain `tags[*].name` and filter in Python.

## 4. Missing keys and nulls

GJSON returns `null` when a path is absent. Stash treats `null` as empty.

```yaml
Date:
  selector: "data.release_date" # may be null
  postProcess:
    - parseDate: "2006-01-02"
```

If the site sometimes omits the field, leave it as-is; do not add defensive `replace` unless you have seen real failures.

## 5. `*ByName` vs other modes

| Mode | Output |
| --- | --- |
| `sceneByName` | `[{...}]` array |
| `sceneByFragment` | `{...}` object |
| `sceneByURL` | `{...}` object |

Even for one result, `*ByName` must wrap the object in an array.

## 6. Verify against the real response

1. Open the API URL in a browser or `curl`.
2. Paste the JSON into a GJSON tester (or use `jq '.data.title'`).
3. Confirm the path returns the expected value.
4. Only then put it into the YAML.

If the API requires auth, use the same session / headers the site uses; do not guess paths from documentation alone.

## 7. When to prefer `scrapeJson` over `scrapeXPath`

| Situation | Prefer |
| --- | --- |
| Site exposes a JSON API | `scrapeJson` |
| HTML is thin and just renders JSON | `scrapeJson` |
| Multi-site shared logic via Python | `script` |
| Simple static HTML | `scrapeXPath` |

Do not force `scrapeJson` on an HTML-only site.

## 8. Example: search endpoint

```yaml
sceneByName:
  action: scrapeJson
  queryURL: "https://api.example.com/search?q={}"
  scraper: sceneSearch

sceneByQueryFragment:
  action: scrapeJson
  queryURL: "https://api.example.com/search?q={title}"
  scraper: sceneSearch

xPathScrapers:
  sceneSearch:
    scene:
      Title:
        selector: "results[*].title"
      URL:
        selector: "results[*].url"
      Image:
        selector: "results[*].cover_url"
```

`queryURL` uses `{}` for the search term; `queryURLReplace` can clean the title first.

## 9. Anti-patterns

| Avoid | Prefer |
| --- | --- |
| `..title` on a huge response | Direct path `data.title` |
| `items[*]` when you need one field | `items[*].name` |
| Inventing paths from docs | `curl` the real endpoint |
| Using `scrapeJson` on HTML | `scrapeXPath` or `script` |

If a path returns `null` on the real page, it is a fail-to-fetch defect — fix it before output.
