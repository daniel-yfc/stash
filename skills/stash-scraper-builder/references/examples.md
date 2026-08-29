# Examples

Complete YAML templates for common scraper patterns.

## XPath template

**Load when:** you need an XPath template. These are **not** live-verified for a real site.

> **概要（zh-TW）：** 只放完整 YAML。禁止 root `documentHeader` / `$vars`（`name` 必填）。搜尋用 `{}`，詳情 fragment 用 `{url}`。`{title}` 是官方支援的 placeholder（限 `sceneByFragment`），但不要把 queryURL 指向搜尋端點。

Copy performer JavaScript from `performer-cleaning.md`. Copy title cleaning from `title-patterns.md`. Mark unverified selectors.

```yaml
name: ExampleScraper
sceneByURL:
  - action: scrapeXPath
    url:
      - example.com
    scraper: xPathScrapers

xPathScrapers:
  scene:
    Title: //h1[@class='title']
    Date:
      selector: //span[@class='date']
      postProcess:
        - parseDate: 2006-01-02
    Studio:
      selector: //a[@class='studio']
      postProcess:
        - replace:
            - from: "Studio Name"
              to: "Studio Name Fixed"
    Image: //img[@class='poster']/@src
    Performers:
      selector: //a[@class='performer']
      action:
        type: javascript
        code: |
          // Copy from performer-cleaning.md
```

## JSON template

**Load when:** the site returns JSON or has a JSON API.

> **概要（zh-TW）：** 用 `scrapeJson` + `jsonScrapers`。`sceneByName.queryURL` = `{}`；`sceneByQueryFragment.queryURL` = `{url}`。

```yaml
name: JsonExample
sceneByURL:
  - action: scrapeJson
    url:
      - api.example.com
    scraper: jsonScrapers

jsonScrapers:
  scene:
    Title: $.title
    Date: $.date
    Studio:
      name: $.studio.name
```

## Script template

**Load when:** you need Python for authentication, pagination, or complex logic.

> **概要（zh-TW）：** `script` 處理認證、翻頁、複雜邏輯。輸出 `print(json.dumps(result))`。

```yaml
name: ScriptExample
sceneByURL:
  - action: script
    url:
      - example.com
    scraper: script

script:
  code: |
    import py_common.log as log
    import requests
    
    result = {}
    # Your scraping logic here
    print(json.dumps(result))
```

## Notes

- `sceneByQueryFragment.queryURL` is `{url}` (the selected hit). Do **not** reuse the search endpoint with `{title}` — while `{title}` is an official placeholder for `sceneByFragment`, the guidance is to use `{url}` for fragment queries that fetch scene details.
- Stash YAML does not paginate. Multi-page search belongs in a `script` scraper, not in this template.
- Always include `name:` at root level (required by official schema).
