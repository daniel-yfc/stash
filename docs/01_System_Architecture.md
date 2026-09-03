# System Architecture

## Overview

This document describes the system architecture of the Stash Scraper Builder repository, including scraper definitions, canonical schema validation, policy checking, and CI/CD automation pipelines.

## Components

### 1. Scraper Definitions

Locations:
- `scrapers/*.yml` — Public scrapers (credential-free)
- `scrapers/private/*.yml` — Private scrapers (session cookies restricted to private deployments)

Key properties:
- `name`: Root scraper name (required; must match filename)
- `sceneByURL` / `performerByURL` / etc.: URL-based scraping entry points
- `sceneByFragment`: Fragment-based scraping entry points
- `driver`: Browser CDP and HTTP configuration

### 2. Validator

Location: `validator/index.mjs`

- **Technology**: Node.js + Ajv + YAML
- **Purpose**: Schema validation against official `validator/scraper.schema.json` and URL array sorting checks (`-s`)
- **Input**: Scraper YAML files (`scrapers/`)
- **Output**: Validation status with detailed schema error formatting
- **Localized Wrapper**: `validator/index-zh-TW.mjs` (Deno runtime wrapper for zh-TW output when explicitly needed)

### 3. Quality Gate Script

Location: `scripts/scraper-quality-gate.sh`

- **Purpose**: Enforces repository policy rules (root `name:` check, `driver.cookies` privacy rules, Go date format checks, `sceneByQueryFragment` preservation)
- **Execution**: Local execution and CI/CD workflow blocking gate
- **Output**: File-level pass/fail status and error annotations

### 4. CI/CD Workflows

Location: `.github/workflows/`

- **`validate.yml`**: Blocking full-set validation pipeline (schema + repository policy checks)
- **`pr-check.yml`**: Changed-file PR validation with inline results comment
- **`link-check.yml`**: Scheduled documentation link validity check
- **`eval.yml` / `test-eval.yml`**: Evaluation pack workflows and smoke tests

## Architecture Diagram

```
Developer → Scraper YAML → Quality Gate Script → Canonical Node Validator → Pass/Fail
                              ↓
                         CI/CD (GitHub Actions)
                              ↓
                         Merge to main
```

## Data Flow

1. Developer creates or updates scraper YAML using scaffolding templates in `templates/`.
2. Developer runs local validation (`node validator/index.mjs scrapers`) and quality gate (`bash scripts/scraper-quality-gate.sh <file>`).
3. Push to GitHub or PR creation triggers CI/CD workflows (`validate.yml` / `pr-check.yml`).
4. Workflows execute schema and policy checks.
5. All checks must pass before merging to main.

## Related Files

- [02_Quality_Gate_Overview.md](02_Quality_Gate_Overview.md) — Quality gate pipeline overview
- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) — 5 core technical rules details
- [04_Production_Gate.md](04_Production_Gate.md) — Business readiness checklist (A-H workstream)
- [05_CI_Workflows.md](05_CI_Workflows.md) — CI/CD workflow details
- [06_Testing_Guide.md](06_Testing_Guide.md) — Local and CI testing guide
