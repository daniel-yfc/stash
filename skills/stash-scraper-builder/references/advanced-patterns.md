# Advanced Patterns

## Anchors

Use YAML anchors to share selector blocks across entry points without duplication. Anchors live inside the **root-level** `xPathScrapers` block; entry points reference it via `scraper:` (entry points have `additionalProperties: false` and must not carry an inline `xPathScrapers:`).

```yaml
name: ExampleAnchors

sceneByURL:
  - action: scrapeXPath
    url:
      - https://example.test
    scraper: sceneScraper

sceneByFragment:
  action: scrapeXPath
  queryURL: https://example.test/search?q={url}
  scraper: sceneScraper

xPathScrapers:
  sceneScraper: &scene_selectors
    scene:
      Title: //h1/text()
      Date: //span[@class="date"]/text()
```

## Studio map

Normalize site names to canonical studio names with `map` inside `Name.postProcess` (the official `studioObject` allows only `Name` / `URL` / `URLs`, so `map` cannot be a sibling of `Name:`).

```yaml
Studio:
  Name:
    fixed: "Canonical Name"
    postProcess:
      - map:
          "Old Name": "Canonical Name"
          "Alternate Name": "Canonical Name"
```

## subScraper

`subScraper` is a legacy pattern that chains a second scraper call to enrich initial results. It is no longer recommended for new scrapers because it adds maintenance complexity.

If you encounter an existing scraper that uses `subScraper`, prefer rewriting it as a script action or a single consolidated XPath/JSON scraper unless the chained lookup is genuinely unavoidable.
