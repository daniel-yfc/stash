# JSON scraping patterns

**Load when:** writing or fixing `scrapeJson` (GJSON) selectors.

> **概要（zh-TW）：** 定義必須在 `jsonScrapers`。ByName 用 `{}`，fragment 用 `{url}`。不要寫 GJSON filter 表達式。

Canonical reference: https://deepwiki.com/stashapp/CommunityScrapers/5.1-json-scraper-configuration

## 1. Required shape

```yaml
sceneByURL:
  - action: scrapeJson
    url:
      - "api.example.com/v1/scene/"
    scraper: sceneJson

jsonScrapers:
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
          selector: "data.performers.#.name"
      Studio:
        Name:
          selector: "data.studio.name"
```

`action: scrapeJson` looks up `jsonScrapers.<name>`. Putting the body under `xPathScrapers` fails validation and returns nothing.

## 2. GJSON basics

Always test the path against a real JSON body (`curl` or DevTools → Network).

| Form | Meaning |
| --- | --- |
| `data.title` | Nested field |
| `items.0` / `items[0]` | First element |
| `items.#.name` / `items[*].name` | All names |
| `..title` | Recursive search (only if the key is unique) |

Do **not** use JSONPath filters such as `items[?(@.type=='scene')]`. They may look valid and still return null at runtime. Take `items.#.field` and filter in `script` if needed.

Missing keys / `null` become empty. Do not invent paths from docs alone.

`*ByName` must return an array of objects. `*ByURL` / `*ByFragment` return one object.

## 3. Verify a path (5 steps)

1. Open the real API URL (same headers/cookies the site uses).
2. Copy the JSON body.
3. Evaluate the GJSON path (tester or `jq` for simple dotted paths).
4. Confirm a non-null value.
5. Only then put it in YAML. If unverifiable, mark `# UNVERIFIED`.

## 4. `queryURL` and `queryURLReplace`

| Mode | `queryURL` |
| --- | --- |
| `sceneByName` | `{}` only. **No** `queryURLReplace`. |
| `sceneByQueryFragment` | `{url}` of the selected hit, optionally rewritten with `queryURLReplace`. |
| `sceneByURL` / `sceneByFragment` | Optional rewrite of the pasted URL into an API URL. |

Official queryURL placeholders are `{}`, `{url}`, and (fragment) `{filename}` — not `{title}`.
`queryURLReplace` keys are **your** names (`id`, `slug`) filled from regex on the input URL.

```yaml
sceneByURL:
  - action: scrapeJson
    url:
      - example.com/video/
    queryURL: "https://api.example.com/v1/scene/{id}"
    queryURLReplace:
      id:
        - regex: ".*/video/([^/?#]+).*"
          with: "$1"
    scraper: sceneJson
```

If the regex does not capture, the API request is wrong and every field is empty.

Stash YAML fetches **one** URL per run. Pagination (`hasNextPage`, cursors) is a `script` concern, not a YAML loop.

## 5. Search pair

```yaml
sceneByName:
  action: scrapeJson
  queryURL: "https://api.example.com/search?q={}"
  scraper: sceneSearch

sceneByQueryFragment:
  action: scrapeJson
  queryURL: "{url}"
  scraper: sceneJson
```

`sceneSearch` must expose `Title` + `URL`. Do **not** set fragment `queryURL` to `.../search?q={title}`.

## 6. When to prefer `scrapeJson`

| Situation | Prefer |
| --- | --- |
| Site exposes a JSON API | `scrapeJson` |
| HTML is a thin shell over JSON / `__NEXT_DATA__` / JSON-LD extracted via script | `scrapeJson` or `script` |
| Multi-site shared logic | `script` |
| Simple static HTML | `scrapeXPath` |

## 7. Anti-patterns

| Avoid | Prefer |
| --- | --- |
| `scrapeJson` + `xPathScrapers` | `jsonScrapers` |
| Invented paths | `curl` the real endpoint |
| `{title}` on queryURL | `{}` / `{url}` |
| `items[?(@.type=='scene')]` | `items.#.field` or `script` |
| Root `name` | Filename + `#` comments |
