# Eval pack

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/10.2-testing-scrapers

For the official testing workflow, see the link above.

## Stash test procedure

1. Configure Stash:
   - Set Scrapers Path to the `scrapers/` directory.
   - Set User Agent if the site blocks defaults.
   - Enable Chrome CDP for JS-heavy / age-gated sites.
   - Set Python path if using script scrapers.

2. Test `sceneByURL`:
   - In Stash, open a scene, paste the URL in the "Scrape from URL" box.
   - Run the scraper and inspect all fields.

3. Check debug logs for errors or empty selectors.

4. Field quality checklist:
   - No studio prefix in `Title`.
   - `Date` is ISO `YYYY-MM-DD`.
   - `Image` is HTTPS and high quality.
   - `Details` has no HTML tags.
   - `Studio.Name` matches expected studio.

5. Test multiple scenes:
   - Recent, old, missing performers, special characters.

6. Run `validator` before marking a scraper done.

## Expected vs actual table

After each live test, record:

- Expected Studio / scraped Studio
- Expected Date / scraped Date
- Expected Group / scraped Group
- Expected Details / scraped Details
- Expected Image / scraped Image

A scraper that returns the wrong studio is a fail, even if the YAML is valid.
