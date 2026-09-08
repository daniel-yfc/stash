# System Architecture

The repository stores Stash scraper YAML under `scrapers/`, with authenticated variants under `scrapers/private/`.

## Validation

The authoritative validation path is the official CommunityScrapers Node/Ajv validator and schema:

```bash
node validator/index.mjs -a -s scrapers
```

Repository policy checks and documentation checks are separate from schema validation. The validator only confirms configuration structure and mapping consistency; it cannot confirm that a live website still exposes the expected DOM.

## Verification layers

1. **Schema:** official validator accepts the YAML.
2. **Policy:** public/private placement, credentials, naming, and date syntax are correct.
3. **Live:** selectors return expected values on current test pages.

Live results are tracked in [`LIVE_TEST_STATUS.md`](LIVE_TEST_STATUS.md).
