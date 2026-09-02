# Advanced Patterns

## Anchors

Use YAML anchors to share selector blocks across entry points without duplication.

```yaml
sceneByURL:
  - action: scrapeXPath
    url:
      - https://example.test
    xPathScrapers:
      scene: &scene_selectors
        Title: //h1/text()
        Date: //span[@class="date"]/text()

sceneByFragment:
  action: scrapeXPath
  queryURL: https://example.test/search?q={url}
  xPathScrapers:
    scene: *scene_selectors
```

## Studio map

Use `map` under a studio field to normalise site names to canonical studio names.

```yaml
Studio:
  Name:
    fixed: "Studio Name"
  map:
    "Old Name": "Canonical Name"
    "Alternate Name": "Canonical Name"
```

## subScraper

`subScraper` is a legacy pattern that chains a second scraper call to enrich initial results. It is no longer recommended for new scrapers because it adds maintenance complexity.

If you encounter an existing scraper that uses `subScraper`, prefer rewriting it as a script action or a single consolidated XPath/JSON scraper unless the chained lookup is genuinely unavoidable.
