# Examples

## Minimal XPath performer entry point

```yaml
name: ExamplePerformer
performerByURL:
  - action: scrapeXPath
    url:
      - example.test/performers/
    scraper: performerScraper

xPathScrapers:
  performerScraper:
    performer:
      Name: //h1[@class="performer-name"]/text()
```

Use `performerByURL` with `scrapeXPath` when the performer page itself contains the metadata. `performerByFragment` is reserved for `script` or `stash` workflows under the official schema; do not use `scrapeXPath` or `scrapeJson` there.

## parseDate — broken vs. fixed

```yaml
# Broken — not a Go layout, will silently fail or produce wrong dates
parseDate: "YYYY-MM-DD"

# Fixed — use Go-style reference time: Mon Jan 2 15:04:05 MST 2006
parseDate: "2006-01-02"
```

Common Go layout tokens: `2006` = year, `01` = month, `02` = day, `15` = 24h hour, `04` = minute, `05` = second.

## CJK / performer separator fixtures

When testing scrapers against Japanese or Chinese sites, include at least one fixture with:

- A CJK title (e.g., `魔法少女ほむら`)
- A bracketed title variant (e.g., `[ABC-123] タイトル`)
- A performer separator (e.g., `・` between co-performers)

These catch normalisation bugs in `replace`, `concat`, and post-processing rules early.
