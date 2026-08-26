# Complete-file examples

**Load when:** you need an XPath template. These are **not** live-verified for a real site.

> **概要（zh-TW）：** 只放完整 YAML。禁止 root `name` / `documentHeader` / `$vars`。搜尋用 `{}`，詳情 fragment 用 `{url}`。

Copy performer JavaScript from `performer-cleaning.md`. Copy title cleaning from `title-patterns.md`. Mark unverified selectors.

## 1. XPath scene + search (only if a real search exists)

```yaml
# Last Updated: YYYY-MM-DD
sceneByURL:
  - action: scrapeXPath
    url:
      - "examplesite.test/works/"
    scraper: sceneScraper

sceneByName:
  action: scrapeXPath
  queryURL: "https://examplesite.test/search?q={}"
  scraper: sceneSearch

sceneByQueryFragment:
  action: scrapeXPath
  queryURL: "{url}"
  scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    common:
      $info: "//main[@data-page='work']"
    scene:
      Title:
        selector: "$info//h1 | $info//h1[@itemprop='name']" # UNVERIFIED
        postProcess:
          - replace:
              - regex: "\\s*\\[.*?\\]\\s*$"
                with: ""
              - regex: "\\s*【.*?】\\s*$"
                with: ""
              - regex: "\\.(mp4|mkv|avi|wmv|flv|ts|mpg|mpeg|rmvb|mov|m4v)\\s*$"
                with: ""
              - regex: "\\s{2,}"
                with: " "
              - regex: "^\\s+|\\s+$"
                with: ""
      Date:
        selector: "$info//time/@datetime" # UNVERIFIED
        postProcess:
          - parseDate: "2006-01-02"
      Image:
        selector: "$info//img[@data-role='cover']/@src | //meta[@property='og:image']/@content" # UNVERIFIED
      Studio:
        Name:
          fixed: "ExampleSite"
      Performers:
        Name:
          selector: "$info//a[contains(@href,'/actor/')]" # UNVERIFIED
  sceneSearch:
    scene:
      Title:
        selector: "//article[@data-result]//a" # UNVERIFIED
      URL:
        selector: "//article[@data-result]//a/@href" # UNVERIFIED
```

If the site has **no** search, omit `sceneByName` and `sceneByQueryFragment`.

`sceneByQueryFragment.queryURL` is `{url}` (the selected hit). Do **not** reuse the search endpoint with `{title}` — `{title}` is not an official queryURL placeholder.

Stash YAML does not paginate. Multi-page search belongs in a `script` scraper, not in this template.

## 2. Date `&nbsp;` fix (complete file)

```yaml
# Last Updated: YYYY-MM-DD
sceneByURL:
  - action: scrapeXPath
    url:
      - "examplesite.test/works/"
    scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    scene:
      Title:
        selector: "//h1" # UNVERIFIED
      Date:
        selector: "//span[@class='date']" # UNVERIFIED
        postProcess:
          - replace:
              - regex: "[\\xa0\\s]+"
                with: " "
          - parseDate: "2 Jan 2006"
```

`replace` must run **before** `parseDate`.
