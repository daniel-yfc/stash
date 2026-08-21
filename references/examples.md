# Complete-file examples

**Load when:** you need a template. These are **not** live-verified for a real site.

> **概要（zh-TW）：** 只放完整 YAML。禁止片段範例當最終輸出。

Copy performer JavaScript from `performer-cleaning.md`. Copy title cleaning from `title-patterns.md`. Mark unverified selectors.

## 1. XPath scene + search (search exists)

```yaml
name: ExampleSite

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
  queryURL: "https://examplesite.test/search?q={title}"
  scraper: sceneSearch

xPathScrapers:
  sceneScraper:
    common:
      $info: "//main[@data-page='work']"
    scene:
      Title:
        selector: "$info//h1/text()" # UNVERIFIED
        postProcess:
          - replace:
              - regex: "\\\\s*\\\\[.*?\\\\]\\\\s*$"
                with: ""
              - regex: "\\\\s*【.*?】\\\\s*$"
                with: ""
              - regex: "\\\\s*（.*?）\\\\s*$"
                with: ""
              - regex: "\\\\.(mp4|mkv|avi|wmv|flv|ts|mpg|mpeg|rmvb|mov|m4v|iso|rar|zip|7z)\\\\s*$"
                with: ""
              - regex: "\\\\s{2,}"
                with: " "
              - regex: "^\\\\s+|\\\\s+$"
                with: ""
      Date:
        selector: "$info//time/@datetime" # UNVERIFIED
        postProcess:
          - parseDate: "2006-01-02"
      Image:
        selector: "$info//img[@data-role='cover']/@src" # UNVERIFIED
      Performers:
        Name:
          selector: "$info//a[contains(@href,'/actor/')]/text()" # UNVERIFIED
          postProcess:
            - javascript: |
                var cleaned = value.replace(/\s+/g, ' ').trim();
                var m1 = cleaned.match(/^([\u4e00-\u9fff\u3400-\u4dbf]+(?:\s+[\u4e00-\u9fff\u3400-\u4dbf]+)*)(?:\s+[A-Za-z]+)?$/);
                if (m1) return m1[1].replace(/\s+/g, '');
                var m2 = cleaned.match(/^([\u4e00-\u9fff\u3400-\u4dbf]+)\s*[\(（][^\)）]+[\)）]$/);
                if (m2) return m2[1];
                var m3 = cleaned.match(/^[\u3041-\u3093\u30a1-\u30f6\u30fc\u3005\u309b\u309c]+\s+([A-Za-z]+)$/);
                if (m3) return m3[1];
                if (/^[\u3041-\u3093\u30a1-\u30f6\u30fc\u3005\u309b\u309c\s]+$/.test(cleaned)) return cleaned.replace(/\s+/g, '');
                return cleaned;
        Gender:
          fixed: "Male"
  sceneSearch:
    scene:
      Title:
        selector: "//article[@data-result]//a/text()" # UNVERIFIED
      URL:
        selector: "//article[@data-result]//a/@href" # UNVERIFIED
```

## 2. Script + dependency

Also state PATH / pip / dependency-path prerequisites from `script-actions.md`.

```yaml
# requires: ExampleAPI
name: ExampleNetwork

sceneByURL:
  - action: script
    url:
      - examplenetwork.test/video
    script:
      - python
      - ../ExampleAPI/ExampleAPI.py
      - examplenetwork
      - scene-by-url

sceneByFragment:
  action: script
  script:
    - python
    - ../ExampleAPI/ExampleAPI.py
    - examplenetwork
    - scene-by-fragment

sceneByName:
  action: script
  script:
    - python
    - ../ExampleAPI/ExampleAPI.py
    - examplenetwork
    - scene-by-name

sceneByQueryFragment:
  action: script
  script:
    - python
    - ../ExampleAPI/ExampleAPI.py
    - examplenetwork
    - scene-by-query-fragment
```

## 3. Date `&nbsp;` fix (complete file)

A real response still returns the user’s full scraper. This template is complete so it does not teach fragment output.

```yaml
name: ExampleDateFix

sceneByURL:
  - action: scrapeXPath
    url:
      - "examplesite.test/works/"
    scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    scene:
      Title:
        selector: "//h1/text()" # UNVERIFIED
      Date:
        selector: "//span[@class='date']/text()" # UNVERIFIED
        postProcess:
          - replace:
              - regex: "[\\\\xa0\\\\s]+"
                with: " "
          - parseDate: "2 Jan 2006"
```
