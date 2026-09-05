# CI Workflows

## Overview

This repository uses four GitHub Actions workflows: one blocking scraper validation workflow, one PR feedback workflow, one scheduled documentation check, and manual evaluation tooling.

| Workflow | Trigger | Scope | Purpose |
| --- | --- | --- | --- |
| `validate.yml` | Push, pull request | Scraper and validator changes | Blocking full-set schema validation + URL ordering via `validator/index.mjs` |
| `pr-check.yml` | Pull request | Changed scraper files, docs tooling | Changed-file policy checks with an updating results comment on the PR |
| `link-check.yml` | Weekly schedule, manual | Documentation | Reports broken links in the README and scraper-builder docs |
| `eval.yml` / `test-eval.yml` | Manual only | Eval tooling | Evaluation support; not merge gates |

## Blocking Validation: `validate.yml`

This is the blocking gate for scraper work. It runs when a change affects:

- `scrapers/**/*.yml`
- `validator/**`

It runs `node validator/index.mjs scrapers` (schema validation) and `node validator/index.mjs -s scrapers` (URL array ordering). Any failure fails the workflow.

Repository policy checks run per changed scraper in `pr-check.yml`, and locally over the full set:

```bash
bash tools/validate-all.sh
```

## Shared Policy Checker: `tools/scraper-quality-gate.sh`

`tools/scraper-quality-gate.sh` performs the following per file:

1. **Schema validation (optional)** — the official stashapp/CommunityScrapers validator, enabled by setting `CS_VALIDATOR_DIR` to a prepared upstream checkout. Without it, only the repository policy checks below run. The legacy Deno validator (`validator/index-zh-TW.mjs`) is retained for reference only and is intentionally not used here.
2. **Root `name:` required** — XPath scrapers (files containing `xPathScrapers:`) must declare a non-empty root `name:` field; without it, Stash will not load the scraper.
3. **`sceneByQueryFragment.queryURL` must be `"{url}"`** — when the feature is declared, it must preserve the incoming URL rather than routing it through a search endpoint.
4. **No `driver.cookies` in public scrapers** — files directly under `scrapers/*.yml` must not contain a `cookies:` block. Session-dependent scrapers belong in `scrapers/private/`, which is exempt from this specific check.
5. **Go `parseDate` layouts** — rejects common non-Go date tokens (`YYYY`, `YY`, `DD`, and `%`-style strftime directives). Valid Go layouts such as `2006-01-02` are accepted.

The same script can be run locally before pushing:

```bash
bash tools/scraper-quality-gate.sh scrapers/SomeScraper.yml
```

## PR Feedback: `pr-check.yml`

Runs only on pull requests touching scraper-related paths. It detects changed scraper files with `tj-actions/changed-files@v46` (see Security Controls), validates each with the shared checker, and posts a single results-table comment on the PR that is updated in place on subsequent pushes (identified by an HTML marker comment). It also runs `tools/check_scraper_docs.py` to check documentation examples and contradictions.

The workflow uses the standard `pull_request` event — never `pull_request_target` — because scraper YAML is contributor-controlled input. For fork-based PRs where the token is read-only, the comment step is `continue-on-error: true`: validation still runs and the job status reflects the result, with details available in the workflow log.

## Documentation Check: `link-check.yml`

Runs weekly (Sunday 00:00 UTC) and on manual dispatch. It checks `README.md` and Markdown under `skills/stash-scraper-builder/` with `lycheeverse/lychee-action@v2` and uploads the report as the `lychee-results` artifact. It uses `fail: false`, so broken links are reported for maintenance rather than blocking merges.

It no longer runs on push/PR; documentation-heavy changes can be checked on demand via manual dispatch.

## Manual Evaluation Workflows

- **`eval.yml`** — accepts an optional `test_file` input (e.g., `test_scrapers.py`) and runs the pytest suite in `tools/tests/` (full suite when the input is empty).
- **`test-eval.yml`** — accepts an optional `scraper_file` input (default `ACCEED.yml`) and runs `tools/scraper-quality-gate.sh` against that file as a conclusive smoke test.

## Security Controls

All workflows declare explicit least-privilege permissions:

```yaml
permissions:
  contents: read
```

`pr-check.yml` additionally has `pull-requests: write`, which is required only for the results comment.

Third-party action policy:

- `tj-actions/changed-files@v46` — releases through `v45.0.7` were affected by CVE-2025-30066, a supply-chain compromise that exposed secrets through Actions logs. **Do not downgrade** below v46; prefer commit-SHA pinning when a dependency-management process is available.
- `lycheeverse/lychee-action@v2`
- `actions/github-script@v7` (first-party)

Session cookies, tokens, passwords, and API keys must never appear in public scraper files — the quality-gate script enforces this mechanically for `scrapers/*.yml`.

## Reliability and Cost Controls

- **Timeouts:** `validate.yml`, `pr-check.yml`, and `link-check.yml` are limited to 10 minutes; `eval.yml` and `test-eval.yml` to 15 minutes.
- **Concurrency:** push/PR workflows cancel superseded in-progress runs on the same ref; `pr-check.yml` groups by PR number; `link-check.yml` uses a single global group.
- **`fetch-depth: 0`** is used wherever changed-file detection runs, so comparisons work correctly in pull-request contexts.

## Maintenance Policy

Review third-party actions periodically for supported versions and security advisories. Update this document in the same commit whenever workflow behavior, triggers, permissions, action versions, or blocking policy changes.
