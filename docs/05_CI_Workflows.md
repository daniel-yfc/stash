# CI Workflows

## Overview

This document describes all CI/CD workflows in the repository, their purposes, and how they work together.

## Active Workflows (4)

### 1. quality-gate.yml ⭐ Primary Quality Gate

**Purpose**: Fast feedback on changed files, block problematic code from merging

**Triggers**:
- Push to `scrapers/*.yml`
- Pull Request to `scrapers/*.yml`

**Execution**:
- Only checks **changed files** (incremental)
- Runs `scripts/scraper-quality-gate.sh` on each changed scraper

**Checks**:
1. ✅ Rule 1: `name` matches filename
2. ✅ Rule 2: `useCDP` at top-level only
3. ✅ Rule 3: No `driver.cookies`
4. ✅ Rule 4: `sceneByFragment` present
5. ✅ Rule 5: `# Last Updated` header
6. ✅ Schema validation (per changed file)

**Speed**: Fast (~30 seconds)

**Failure Impact**: Blocks merge immediately

---

### 2. validate.yml 🛡️ Batch Safety Net

**Purpose**: Comprehensive batch validation, catch regressions across all scrapers

**Triggers**:
- Push to `scrapers/*.yml`
- Pull Request to `scrapers/*.yml`

**Execution**:
- Checks **ALL scrapers** (batch mode)
- Runs validator on entire `scrapers/` directory

**Checks**:
- ✅ Schema validation (all scrapers, batch)

**Speed**: Slower (~2-3 minutes)

**Failure Impact**: Catches issues that quality-gate might miss

---

### 3. link-check.yml 🔗 Content Quality

**Purpose**: Ensure Markdown links are valid

**Triggers**:
- Push to `**/*.md`
- Pull Request to `**/*.md`

**Checks**:
- ✅ Broken links in Markdown files
- ✅ External URL validity

**Speed**: ~1 minute

---

### 4. eval.yml 🧪 Optional Testing

**Purpose**: Run scraper evaluation tests

**Triggers**:
- Manual trigger (workflow_dispatch)

**Checks**:
- ✅ Scraper evaluation tests

**Speed**: ~5 minutes

**Status**: Optional - does not block merges

---

## Workflow Analysis

### Overlap Check

| Workflow | 5 Rules | Schema | Scope | Speed | Purpose |
|----------|---------|--------|-------|-------|---------|
| quality-gate.yml | ✅ | ✅ | Changed files | Fast | Block bad code |
| validate.yml | ❌ | ✅ | All files | Slow | Catch regressions |
| link-check.yml | ❌ | ❌ | .md files | Medium | Content quality |
| eval.yml | ❌ | ❌ | Optional | Variable | Testing |

**Conclusion**: Minimal overlap, different scopes and purposes. Defense in depth.

---

## Removed Workflows

### lint-rules.yml ❌
- **Removed**: 2026-08-28
- **Reason**: Duplicate with quality-gate.yml

### site.yml ❌
- **Removed**: 2026-08-28
- **Reason**: User requested removal

---

## Related Files

- [03_Quality_Gate_Rules.md](03_Quality_Gate_Rules.md) - Detailed 5 rules
- [06_Testing_Guide.md](06_Testing_Guide.md) - How to test
- [01_System_Architecture.md](01_System_Architecture.md) - System design

---

**Last Updated**: 2026-08-28
**Status**: ✅ Active
