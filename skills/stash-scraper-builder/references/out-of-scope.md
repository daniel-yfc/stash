# Out of Scope

This skill covers CommunityScrapers-style YAML, JSON, and script scrapers only.

## Included

- Declarative XPath scraping (`scrapeXPath`)
- JSON endpoint scraping (`scrapeJson`)
- Script-based scraping (`script`)
- CDP-assisted login workflows for browser-gated targets
- Validation, quality-gate, and review practices for public and private scraper variants

## Excluded

- `action: stash` workflows
- Stash-box integration
- Stash GraphQL API usage and `ApiKey`-based authentication
- Generic third-party API-auth scraper patterns (unless added as a separate future expansion)

## Reading guidance for upstream docs

| Upstream doc | Treatment |
|---|---|
| `docs.stashapp.cc/api/` | Background context only — not implemented here |
| `docs.stashapp.cc/metadata-sources/` | Broader ecosystem view — this skill covers the scraper branch only |
| DeepWiki architecture and driver pages | Design context — not a claim that all integration paths are supported |
