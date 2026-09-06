# Testing Guide

## Overview

This guide covers local tools, the upstream validator workflow, policy checks, Python tests, and manual GitHub Actions checks.

## Test Types

### 1. Local Testing

#### Policy Gate

```bash
# Test one scraper
bash tools/scraper-quality-gate.sh scrapers/ACCEED.yml

# Test all scrapers, including scrapers/private/
bash tools/validate-all.sh
```

#### Local Validator

The local Node validator uses the repository copy of the schema. CI is authoritative because it fetches the upstream CommunityScrapers validator and schema.

```bash
bash tools/install.sh
node validator/index.mjs -a --ci
node validator/index.mjs -a -s --ci
```

#### Python Tests and Documentation Checks

```bash
python -m pytest tools/tests/ -v
python tools/check_scraper_docs.py
```

### 2. CI/CD Testing

#### GitHub Actions Workflows

- **validate.yml**: Fetches the upstream CommunityScrapers validator/schema and validates all scrapers; URL sorting is reported in advisory mode.
- **pr-check.yml**: Checks changed scrapers with the policy gate and runs documentation checks.
- **link-check.yml**: Reports Markdown-link status weekly or on demand.
- **eval.yml**: Runs the Python test suite manually; optionally accepts one test filename.
- **test-eval.yml**: Runs one selected scraper through the policy gate manually.

#### Manual Trigger

```text
Open the repository Actions page.
Select "Test Eval Workflow" or "Eval Pack".
Choose the optional scraper/test-file input when needed.
Run the workflow and inspect its result.
```

### 3. Test Layout

Tests live under `tools/tests/` and are selected by `pytest.ini`.

```bash
python -m pytest tools/tests/ -v
```

## Test Coverage

### Scraper Set

The full current scraper set is discovered dynamically under `scrapers/**/*.yml`, including private scrapers. Do not maintain a stale hardcoded scraper count in this document.

### Policy Coverage

- ✅ XPath scraper root `name:`.
- ✅ Direct query fragments preserve `queryURL: "{url}"`.
- ✅ Public/private cookie boundary.
- ✅ Go `parseDate` layout policy.
- ✅ Deterministic all-scraper traversal.

### Schema Validation

- ✅ Upstream CommunityScrapers validator/schema in `validate.yml`.
- ✅ Local Node validator smoke test when dependencies are installed.

## Troubleshooting

### Python Tests Fail

```bash
bash tools/install.sh
python -m pytest tools/tests/ -v
```

### Policy Gate Fails

```bash
bash tools/scraper-quality-gate.sh scrapers/ACCEED.yml
```

Check the reported rule, then inspect the relevant section of `tools/scraper-quality-gate.sh` and `docs/03_Quality_Gate_Rules.md`.

### Upstream Validator Fails

The CI run downloads the upstream validator and schema at run time. Review the failing scraper output in the workflow, then reproduce the local structural check with:

```bash
bash tools/install.sh
node validator/index.mjs -a --ci
```

If local and CI results differ, treat the upstream CI result as authoritative and report the upstream commit/source used by the run.

## Performance Metrics

Track timings from current GitHub Actions runs rather than preserving historical estimates here.

## Next Steps

1. Run the manual `Test Eval Workflow` for a representative scraper.
2. Run the manual `Eval Pack` workflow for the complete Python suite.
3. Monitor the scheduled link-check report.
4. Add focused regression tests when a new policy rule is introduced.

## Related Files

- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) - policy rules.
- [05_CI_Workflows.md](05_CI_Workflows.md) - CI workflows.
- [01_System_Architecture.md](01_System_Architecture.md) - system design.

---

**Last Updated**: 2026-09-06
**Status**: ✅ Active
