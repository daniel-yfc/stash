# JSON Scraper Examples

**Load when:** you need a complete-file `scrapeJson` template.

> **概要（zh-TW）：** 只放完整 YAML。先用真實 API 回應驗證路徑。

## 1. Scene + search (real JSON API)

```yaml
name: ExampleJsonSite

sceneByURL:
  - action: scrapeJson
    url:
      - "api.examplesite.test/v1/scene/"
    scraper: sceneJson

sceneByName:
  action: scrapeJson
  queryURL: "https://api.examplesite.test/search?q={}"
  scraper: sceneSearch

sceneByQueryFragment:
  action: scrapeJson
  queryURL: "https://api.examplesite.test/search?q={title}"
  scraper: sceneSearch

xPathScrapers:
  sceneJson:
    scene:
      Title:
        selector: "data.title"
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
        selector: "data.release_date"
        postProcess:
          - parseDate: "2006-01-02"
      Details:
        selector: "data.description"
      Image:
        selector: "data.cover_url"
      Performers:
        Name:
          selector: "data.performers[*].name"
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
      Studio:
        Name:
          selector: "data.studio.name"
      Tags:
        Name:
          selector: "data.tags[*].name"
  sceneSearch:
    scene:
      Title:
        selector: "results[*].title"
      URL:
        selector: "results[*].url"
      Image:
        selector: "results[*].cover_url"
```

Copy the title block from `title-patterns.md` and the performer JS from `performer-cleaning.md`. Mark selectors `# UNVERIFIED` until you test them on the real API.
