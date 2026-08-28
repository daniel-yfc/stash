# Testing Guide

## Overview

This guide covers all testing aspects for the scraper quality gate system.

## Test Types

### 1. Local Testing

#### Quality Gate Script
```bash
# Test single scraper
bash scripts/scraper-quality-gate.sh scrapers/ACCEED.yml

# Test all scrapers
for file in scrapers/*.yml; do
  bash scripts/scraper-quality-gate.sh "$file"
done
```

#### Validator
```bash
cd validator
deno run --allow-read --allow-write index-zh-TW.mjs ../scrapers/ACCEED.yml
```

### 2. CI/CD Testing

#### GitHub Actions Workflows
- **quality-gate.yml**: Tests changed scrapers on every PR
- **validate.yml**: Batch validates all scrapers
- **link-check.yml**: Validates Markdown links
- **eval.yml**: Optional evaluation tests

#### Manual Trigger
```bash
# Go to: https://github.com/daniel-yfc/stash/actions
# Select "Test Eval Workflow"
# Click "Run workflow"
# Choose scraper file (default: ACCEED.yml)
```

### 3. Python Tests

```bash
cd tests
python -m pytest . -v
```

## Test Coverage

### Scraper Updates
- ✅ ACCEED.yml
- ✅ Bravo-Japan.yml
- ✅ Justice01.yml
- ✅ Games-Video.yml
- ⏳ Remaining 7 scrapers (pending)

### Rules Coverage
- ✅ Rule 1: name matches filename (100%)
- ✅ Rule 2: useCDP position (100%)
- ✅ Rule 3: no driver.cookies (100%)
- ✅ Rule 4: sceneByFragment (100%)
- ✅ Rule 5: Last Updated (100%)

### Schema Validation
- ✅ Validator (Deno compatible)
- ✅ quality-gate.yml
- ✅ validate.yml

## Troubleshooting

### Common Issues

#### eval-run.sh Fails
**Causes**:
- Script not implemented
- Missing dependencies
- Path issues

**Solution**:
```bash
# Check script content
cat scripts/eval-run.sh

# Test locally
bash scripts/eval-run.sh
```

#### Python Tests Fail
**Causes**:
- Missing test data
- Assertion errors

**Solution**:
```bash
# Run with verbose output
python -m pytest tests/ -v

# Check test files
ls -la tests/
```

#### Validator Fails
**Causes**:
- Schema errors
- File not found

**Solution**:
```bash
# Test validator directly
cd validator
deno run --allow-read --allow-write index-zh-TW.mjs ../scrapers/ACCEED.yml
```

## Performance Metrics

### CI Execution Times
- quality-gate.yml: ~30 seconds
- validate.yml: ~2-3 minutes
- link-check.yml: ~1 minute
- eval.yml: ~5 minutes

### Coverage
- Scraper updates: 5/11 (45%)
- Rules coverage: 5/5 (100%)
- Schema validation: 100%

## Next Steps

1. Test remaining 7 scrapers
2. Run eval.yml manually
3. Monitor CI performance
4. Add more test cases

## Related Files

- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) - 5 rules details
- [05_CI_Workflows.md](05_CI_Workflows.md) - CI/CD workflows
- [01_System_Architecture.md](01_System_Architecture.md) - System design

---

**Last Updated**: 2026-08-28
**Status**: ✅ Active
