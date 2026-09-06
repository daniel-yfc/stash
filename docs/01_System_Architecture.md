# System Architecture

## Overview

This document describes the architecture of the scraper validation and policy-checking system.

## Components

### 1. Scraper Definitions

Location: `scrapers/**/*.yml` (including `scrapers/private/` for restricted scrapers).

Each scraper is defined in YAML format with supported mappings such as:

- `name`: Scraper name.
- `sceneByURL`: URL-based scraping.
- `sceneByFragment`: Fragment-based scraping.
- `driver`: Optional CDP/browser configuration.

### 2. Validators

The authoritative validator and schema are maintained by [stashapp/CommunityScrapers](https://github.com/stashapp/CommunityScrapers):

- CI fetches `validator/index.mjs` and `validator/scraper.schema.json` from upstream `master` at run time.
- The upstream validator runs against every scraper and returns a blocking pass/fail result.
- The repository's `validator/index.mjs` and `validator/scraper.schema.json` remain useful local copies, but upstream takes precedence when they differ.
- `validator/index-zh-TW.mjs` is retained for localized output only.

### 3. Local Policy Tools

Location: `tools/`.

- `tools/scraper-quality-gate.sh`: per-scraper policy checks; optionally invokes a prepared upstream validator through `CS_VALIDATOR_DIR`.
- `tools/validate-all.sh`: runs the policy gate over every `scrapers/**/*.yml` file.
- `tools/check_scraper_docs.py`: checks documentation examples and contradictions.
- `tools/tests/`: Python regression and smoke tests.

### 4. CI Workflows

Location: `.github/workflows/`.

- `validate.yml`: blocking upstream-schema validation and URL-order check.
- `pr-check.yml`: changed-scraper policy checks plus documentation checks and PR feedback.
- `link-check.yml`: scheduled Markdown-link reporting.
- `eval.yml`: manual pytest evaluation.
- `test-eval.yml`: manual single-scraper policy-gate smoke test.

## Architecture Diagram

```
Developer → Scraper YAML → Local Policy Gate → Upstream Validator → Pass/Fail
                              ↓
                         GitHub Actions CI
                              ↓
                         Merge to main
```

## Data Flow

1. Developer creates or updates scraper YAML.
2. Local tools run policy checks, tests, and documentation checks.
3. A push or pull request triggers the applicable GitHub Actions workflow.
4. `validate.yml` fetches the upstream validator/schema and validates the complete scraper set.
5. Required checks pass before merge.

## Related Files

- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) - policy rules.
- [05_CI_Workflows.md](05_CI_Workflows.md) - CI workflows.
- [06_Testing_Guide.md](06_Testing_Guide.md) - testing guide.

---

**Last Updated**: 2026-09-06
**Status**: ✅ Active
