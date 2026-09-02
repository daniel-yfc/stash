# Advanced Patterns

## Anchors

Use YAML anchors to share selector blocks across scraper definitions in the same file. Entry points reference those root-level definitions by name.

```yaml
name: ExampleAnchors
sceneByURL:
  - action: scrapeXPath
    url:
      - example.test/video/
    scraper: sceneScraper

sceneByFragment:
  action: scrapeXPath
  queryURL: "https://example.test/search?q={url}"
  scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    scene: &scene_selectors
      Title: "//h1/text()"
      Date: "//span[@class='date']/text()"
```

## Studio map

Use `map` inside `Name.postProcess` to normalize site names to canonical studio names.

```yaml
name: ExampleStudio
sceneByURL:
  - action: scrapeXPath
    url:
      - example.test/video/
    scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    scene:
      Studio:
        Name:
          selector: "//span[@class='studio']/text()"
          postProcess:
            - map:
                "Old Name": "Canonical Name"
                "Alternate Name": "Canonical Name"
```

## subScraper

`subScraper` is a legacy pattern that chains a second scraper call to enrich initial results. It is no longer recommended for new scrapers because it adds maintenance complexity.

If you encounter an existing scraper that uses `subScraper`, prefer rewriting it as a script action or a single consolidated XPath/JSON scraper unless the chained lookup is genuinely unavoidable.
