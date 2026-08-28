# System Architecture

## Overview

This document describes the architecture of the Scraper Quality Gate system.

## Components

### 1. Scraper Definitions

Location: `scrapers/*.yml`

Each scraper is defined in YAML format with:
- `name`: Scraper name (must match filename)
- `sceneByURL`: URL-based scraping
- `sceneByFragment`: Fragment-based scraping
- `driver`: CDP configuration

### 2. Validator

Location: `validator/index-zh-TW.mjs`

- **Technology**: Deno + Ajv
- **Purpose**: Schema validation
- **Input**: Scraper YAML files
- **Output**: Validation pass/fail with errors

### 3. Quality Gate Script

Location: `scripts/scraper-quality-gate.sh`

- **Purpose**: Enforce 5 rules + schema validation
- **Execution**: Local or CI/CD
- **Output**: Pass/fail with detailed errors

### 4. CI/CD Workflows

Location: `.github/workflows/`

- **quality-gate.yml**: Per-file validation
- **validate.yml**: Batch validation
- **link-check.yml**: Link validation
- **eval.yml**: Optional testing

## Architecture Diagram

```
Developer → Scraper YAML → Quality Gate Script → Validator → Pass/Fail
                              ↓
                         CI/CD (GitHub Actions)
                              ↓
                         Merge to main
```

## Data Flow

1. Developer creates/updates scraper YAML
2. Local quality gate script validates
3. Push to GitHub triggers CI/CD
4. Workflows run validation
5. All must pass to merge

## Related Files

- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) - 5 rules details
- [05_CI_Workflows.md](05_CI_Workflows.md) - CI/CD workflows
- [06_Testing_Guide.md](06_Testing_Guide.md) - Testing guide

---

**Last Updated**: 2026-08-28
**Status**: ✅ Active
