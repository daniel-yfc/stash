# Best practices for maintainable scrapers

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/10.3-best-practices

## Structure & reuse

- Use YAML anchors (`&` / `*`) for shared scene/group selectors **only within the same file**, and only when a block is reused **3+ times**.
- Use `fixed:` studio for single-studio sites; use `map` for known variants (missed keys pass through unchanged).
- Add `# Last Updated YYYY-MM-DD` at the **end of the file** (EOF).
- Filename: CamelCase (site or network name).

## Studio normalization (G3)

Build a small matrix: domain → display name, handling:
- Apostrophe / hyphen variants (`Staggers'`, `Staggers-`)
- HD / POV casing (`HD`, `POV`)
- Parent / child studio relationships

```yaml
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

- Prefer `|` fallbacks for sites that churn: `//h1[@class='new']//text() | //h1[@class='old']//text()`
- Image upgrade: `trailer` > `poster` > `thumb`
- Avoid hardcoded expected values inside XPath.

## Anti-patterns

- Overly deep or fragile XPath (`/html/body/div[3]/...`)
- Assuming every field exists on every page
- Using `subScraper` by default (see `advanced-patterns.md`)
- Not testing with recent, old, and edge-case scenes

## Minimal Nubiles-style template (G1)

```yaml
# @meta
# Last Updated: 2026-08-26
# requires: py_common (if using script)

name: Nubiles

sceneByURL:
  - action: scrapeXPath
    url:
      - "nubiles.net/video/watch/"
    scraper: sceneScraper

xPathScrapers:
  sceneScraper:
    scene:
      Title:
        selector: "//h1[@itemprop='name']//text()"
      Date:
        selector: "//span[@itemprop='datePublished']//text()"
        postProcess:
          - parseDate: "2 Jan 2006"
      Image:
        selector: "//meta[@property='og:image']/@content"
      Studio:
        Name:
          fixed: "Nubiles"
      Performers:
        Name:
          selector: "//a[contains(@href,'/model/')]/text()"
      Tags:
        Name:
          selector: "//a[contains(@href,'/category/')]/text()"
```

## Header / Footer (G4)

- **Header** (top comment): list restrictions — UA, cookie, CDP, Python prerequisites.
- **Footer**: `# Last Updated YYYY-MM-DD`.
- Cookie scrapers: note that users must edit the YAML file to refresh cookies.
