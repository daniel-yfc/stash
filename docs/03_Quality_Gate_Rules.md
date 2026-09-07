# Quality Gate Rules

## Overview

The quality gate distinguishes schema validity, repository policy, and live-site behavior.

## Core rules

### Rule 1: Root name

Every XPath/JSON scraper must have a non-empty root `name:`. Matching the filename is recommended but is not an upstream schema requirement.

### Rule 2: Official validator

Use the official Node/Ajv validator and schema:

```bash
node validator/index.mjs -a -s scrapers
```

Do not use the removed Deno/localized validator.

### Rule 3: Credentials

Public files under `scrapers/*.yml` must not contain `driver.cookies`. Authenticated variants belong under `scrapers/private/`.

### Rule 4: Fragment scraping is optional

`sceneByFragment` is not required for every scraper. Omit it when the target site does not support reliable fragment/title lookup.

When `sceneByFragment` uses `scrapeXPath` or `scrapeJson`, it must include the action-required `queryURL`. If present, `sceneByQueryFragment` must preserve the selected URL with `queryURL: "{url}"`.

### Rule 5: Date syntax

`parseDate` must use Go reference layouts, such as `2006-01-02`.

### Rule 6: Live verification

Schema validation does not prove that selectors match current site HTML. Record live verification separately in `docs/LIVE_TEST_STATUS.md`.

## Commands

```bash
bash tools/scraper-quality-gate.sh scrapers/ACCEED.yml
bash tools/validate-all.sh
python tools/check_scraper_docs.py
```
