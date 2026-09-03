# Best practices

## Studio naming and mapping

Build a small matrix: domain → display name, handling:

- Parent / child studio relationships

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
                "SiteA": "Site A"
                "SiteB HD": "Site B"
                "SiteC POV": "Site C"
```

## Selector stability

## Minimal Nubiles-style template (G1)

```yaml
name: Nubiles
# @meta
# Last Updated: 2026-08-26
# requires: py_common (if using script)
