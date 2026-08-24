# Stash Scraper Builder Skill

This skill helps you generate XPath-based YAML scrapers for Stash.
It is a **builder checklist**, not a full runtime manual.

## Canonical reference

This skill is a builder checklist for generating XPath scrapers.
For the full Stash/CommunityScrapers runtime model, always refer to:

- https://deepwiki.com/stashapp/CommunityScrapers/

Key pages used by this skill:

- System architecture & entry points:
  https://deepwiki.com/stashapp/CommunityScrapers/1.1-system-architecture
- Core concepts & entity model:
  https://deepwiki.com/stashapp/CommunityScrapers/3-core-concepts
- Data model (Scene, Performer, Movie/Group, Gallery, Image, Studio, Tag):
  https://deepwiki.com/stashapp/CommunityScrapers/3.1-data-model
- Post-processing pipeline (replace, parseDate, map, subScraper, etc.):
  https://deepwiki.com/stashapp/CommunityScrapers/3.3-post-processing-pipeline
- XPath scrapers overview:
  https://deepwiki.com/stashapp/CommunityScrapers/4-xpath-scrapers
- Basic XPath scrapers:
  https://deepwiki.com/stashapp/CommunityScrapers/4.1-basic-xpath-scrapers
- Multi-site network scrapers:
  https://deepwiki.com/stashapp/CommunityScrapers/4.2-multi-site-network-scrapers
- Advanced XPath techniques:
  https://deepwiki.com/stashapp/CommunityScrapers/4.3-advanced-xpath-techniques
- Configuration reference:
  https://deepwiki.com/stashapp/CommunityScrapers/8-configuration-reference
- Selector syntax (XPath / JSONPath):
  https://deepwiki.com/stashapp/CommunityScrapers/8.2-selector-syntax
- Testing scrapers in Stash:
  https://deepwiki.com/stashapp/CommunityScrapers/10.2-testing-scrapers
- Best practices for maintainable scrapers:
  https://deepwiki.com/stashapp/CommunityScrapers/10.3-best-practices
- Runtime scraping failures & diagnostics:
  https://deepwiki.com/stashapp/CommunityScrapers/11.2-scraping-failures

## Hard rules (from runtime + recent scrapers)

- `sceneByURL` is mandatory for any site that has stable detail URLs.
- Do not mark a scraper `VERIFIED` until `sceneByURL` and at least one search mode each pass 3+ real pages.
- Age-gated sites must be tested from a rendered DOM snapshot, not a raw HTTP fetch.
- Never invent a `Groups` value from シリーズ / レーベル unless the user explicitly wants that mapping.
- Studio, Date, Details, and Image must be checked against expected values, not just "selector matched something."
- Keep `Country` / `Ethnicity` / `Gender` under `Performers`, never at scene root.
- Use `URLs` (array), not legacy `URL`.
- Use `Groups`, not legacy `Movies`.

## How to use this skill

1. **Ask the user for:**
   - Site URL(s)
   - Example scene URLs
   - Expected Title, Code, Date, Studio, Details, Image
2. **Inspect the site HTML / DOM:**
   - Identify patterns for Title, Code, Date, Studio, Details, Image, Performers, Tags
   - Note any age-gate / interstitial pages
3. **Generate a YAML scraper:**
   - Use `sceneByURL` as the primary entry point
   - Add search modes (`sceneByQueryFragment`, `sceneByName`) if needed
   - Use `common` and `$vars` for shared selectors
4. **Validate:**
   - Run the local `validator` tool
   - Fix any schema or reference errors
5. **Test in Stash:**
   - Test `sceneByURL` on 3+ real scene URLs
   - Test search modes on 3+ queries
   - Check all fields against expected values
6. **Iterate:**
   - Fix selectors, post-processing, and mappings
   - Re-validate and re-test until stable

## Definition of done

- Validator passes with no errors.
- `sceneByURL` works on ≥ 3 real URLs.
- At least one search mode works on ≥ 3 queries (if implemented).
- Key fields match expected values on all tested pages.
- No obvious anti-patterns (hardcoded values, overly fragile XPath).

## Troubleshooting

- **Validator fails**
  - Fix schema errors first (missing required fields, wrong types, invalid refs).
  - Re-run the validator after each change.

- **All fields empty**
  - Check selectors with browser `$x()`.
  - Verify you are not hitting an age-gate or interstitial.
  - Check `useCDP` / `CookieURL` configuration.

- **Only Date is nil**
  - Check the raw date string format.
  - Ensure it is normalized (e.g. `YYYY-MM-DD`) before `parseDate`.
  - See: `references/date-formats.md` and `references/post-processing.md`.

- **Studio or Details wrong**
  - Verify you are not using manufacturer (メーカー) as studio when シリーズ / レーベル is present.
  - Check for HTML tags or extra whitespace in Details.

- See also:
  - https://deepwiki.com/stashapp/CommunityScrapers/11.2-scraping-failures
  - `references/scraping-failures.md`

## Data model reminders

- Scene: no required fields
- Performer: `Name` only
- Movie / Group: `Name` only
- Gallery: `Title` only
- Image: no required fields
- Studio: `Name` only
- Tag: `Name` only

Field distinctions:

- Use `URLs` (array) for scenes/performers/studios, not legacy `URL`.
- Use `Groups` for scene groups; `Movies` is legacy.
- Performer-only fields include: `Disambiguation`, `Birthdate`, `Height`, `Weight`, `Gender`, `Circumcised`, etc.
- Keep performer-specific fields (`Country`, `Ethnicity`, `Gender`) under `Performers`, not at scene root.

## Anti-patterns

- Hardcoding expected values in XPath.
- Overfitting selectors to a single page.
- Using `subScraper` by default instead of simpler selectors.
- Assuming every field exists on every page.
- Using legacy `URL` / `Movies` instead of `URLs` / `Groups`.
- Putting performer-only fields (`Country`, `Ethnicity`, `Gender`) at scene root.
- Overly deep or fragile XPath.

See: `references/best-practices.md`

## Output format

Return a single YAML file, ready to save as `YourSite.yml` in `scrapers/`.
Include:

- `documentHeader` with `# @meta` block
- `sceneByURL` with `scene` block
- Optional: `sceneByQueryFragment`, `sceneByName`
- Optional: `movieByURL`, `performerByURL`, etc.

Keep the YAML clean, commented, and aligned with the [CommunityScrapers style](https://deepwiki.com/stashapp/CommunityScrapers/10.3-best-practices).
