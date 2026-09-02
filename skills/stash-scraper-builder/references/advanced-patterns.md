# Advanced Patterns

## Anchors

Use YAML anchors to share selector blocks across entry points without duplication. Keep all scraper definitions at root level and reference them from entry points with `scraper:`.

```yaml
name: ExampleAnchors
sceneByURL:
  - action: scrapeXPath
    url:
      - example.test/video/
    scraper: sceneScraper

sceneByFragment:
  action: scrapeXPath
  queryURL: "https://example.test/video/{filename}"
  scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    scene: &scene_selectors
      Title: //h1/text()
      Date: //span[@class="date"]/text()
  fragmentScraper:
    scene: *scene_selectors
```

Anchors are YAML syntax; the referenced scraper name must still exist in the root-level `xPathScrapers` map.

## Studio map

Use `map` inside `Studio.Name.postProcess` to normalise site names to canonical studio names.

```yaml
name: ExampleStudioMap
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
