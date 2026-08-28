# Quality Gate Rules

## Overview

This document describes the 5 core rules enforced by the scraper quality gate system.

---

## The 5 Rules

### Rule 1: name Must Match Filename

**Requirement**: The `name` field must match the filename.

**Example**:
```yaml
# File: scrapers/ACCEED.yml
name: ACCEED  # ✅ Correct
```

---

### Rule 2: useCDP at Top-Level Only

**Requirement**: `useCDP` must be in top-level `driver` block only.

**Example**:
```yaml
# ✅ Correct
driver:
  useCDP: true
  headers:
    - Key: User-Agent
      Value: Mozilla/5.0
```

---

### Rule 3: No driver.cookies

**Requirement**: The `driver.cookies` field is prohibited.

---

### Rule 4: sceneByFragment Required

**Requirement**: Every scraper must include `sceneByFragment`.

**Example**:
```yaml
# ✅ Correct
sceneByFragment:
  action: scrapeXPath
  scraper: sceneScraper
```

---

### Rule 5: Last Updated Header Required

**Requirement**: Every scraper must include `# Last Updated: YYYY-MM-DD`.

**Example**:
```yaml
# ✅ Correct
# Last Updated: 2026-08-28
# ACCEED (acceed.jp)

name: ACCEED
```

---

## Testing

```bash
# Test single scraper
bash scripts/scraper-quality-gate.sh scrapers/ACCEED.yml
```

---

## Related Files

- [01_System_Architecture.md](01_System_Architecture.md) - System design
- [02_Quality_Gate_Overview.md](02_Quality_Gate_Overview.md) - Chinese overview
- [04_Production_Gate.md](04_Production_Gate.md) - Business checklist
- [05_CI_Workflows.md](05_CI_Workflows.md) - CI/CD workflows
- [06_Testing_Guide.md](06_Testing_Guide.md) - Testing guide

---

**Last Updated**: 2026-08-28
**Status**: ✅ Active
