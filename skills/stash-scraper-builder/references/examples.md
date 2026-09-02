# Examples

## Minimal performer entry point

```yaml
name: ExamplePerformerScraper
performerByFragment:
  action: scrapeXPath
  queryURL: https://example.test/performers?q={url}
  queryURLReplace:
    title: ""
  xPathScrapers:
    performer:
      Name: //h1[@class="performer-name"]/text()
```

Use this as a starting template for performer scrapers. The root `name` key is required by the official schema. Fragment XPath/JSON examples should include the action-required `queryURL`; the exact placeholder depends on the entry point and target-site contract.

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
