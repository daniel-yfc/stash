# 5 Rules Enforcement

> **Documentation and CI lint for 5 mandatory scraper rules.**

## Overview

This PR adds explicit documentation and CI enforcement for 5 critical rules that were previously only implied or partially documented in the skill.

## The 5 Rules

### 1. No Root `name:` Key

**Rule:** Do not emit root `name:` key in scraper YAML. The filename is the scraper name.

**Rationale:** Stash uses the filename as the scraper identifier. A root `name:` key is redundant and can cause confusion.

**Example (WRONG):**
```yaml
name: COAT

sceneByURL:
  - action: scrapeXPath
```

**Example (RIGHT):**
```yaml
# Filename: COAT.yml

sceneByURL:
  - action: scrapeXPath
```

---

### 2. No Root `documentHeader:` Key

**Rule:** Do not emit root `documentHeader:` key.

**Rationale:** This is a legacy pattern that is not part of the current schema. Use `#` comments for metadata.

---

### 3. No Root `$vars:` Key

**Rule:** Do not emit root `$vars:` key.

**Rationale:** `$vars` is not a valid root-level key in the current schema. Use `$`-prefixed keys only inside `xPathScrapers.*.common` blocks.

---

### 4. No `driver.cookies` in Public Scrapers

**Rule:** Public scrapers (`scrapers/*.yml`) must not contain `driver.cookies`. Session cookies belong only in `scrapers/private/*.yml`.

**Rationale:** Session cookies are equivalent to passwords. Committing them to public repositories exposes user credentials.

**Example (WRONG for public):**
```yaml
driver:
  useCDP: false
  cookies:
    - CookieURL: "https://example.com"
      Cookies:
        - Name: SESSIONID
          Value: "abc123..."
```

**Example (RIGHT for public):**
```yaml
driver:
  useCDP: true
  # No cookies section - user logs in via visible Chrome
```

**See:** [`scrapers/README.md`](../scrapers/README.md) for public vs private deployment guidance.

---

### 5. `useCDP` Only in Top-Level `driver` Block

**Rule:** `driver.useCDP` is allowed only in the top-level `driver` block, never inside any entry point (`sceneByURL`, `sceneByName`, etc.).

**Rationale:** CDP configuration is a global driver setting, not a per-entry-point setting. Placing it inside entry points is invalid YAML structure.

**Example (WRONG):**
```yaml
sceneByURL:
  - action: scrapeXPath
    url:
      - "example.com/"
    useCDP: true  # ❌ Wrong location
    scraper: sceneScraper
```

**Example (RIGHT):**
```yaml
driver:
  useCDP: true  # ✅ Correct location

sceneByURL:
  - action: scrapeXPath
    url:
      - "example.com/"
    scraper: sceneScraper
```

---

## Additional Runtime Safety Rule

### Add `sceneByFragment` When Supported

**Rule:** Add `sceneByFragment` entry point when the site supports fragment-based scraping. This prevents nil pointer dereference at runtime.

**Rationale:** Stash processes scene metadata through multiple entry points. Missing `sceneByFragment` when the site expects it can cause runtime crashes.

**Example:**
```yaml
sceneByURL:
  - action: scrapeXPath
    url:
      - "example.com/video/"
    scraper: sceneScraper

sceneByFragment:
  action: scrapeXPath
  scraper: sceneScraper
```

**See:** [`skills/stash-scraper-builder/references/scraping-failures.md`](../skills/stash-scraper-builder/references/scraping-failures.md) for troubleshooting.

---

## Documentation Changes

### Updated Files

1. **[`AGENTS.md`](../AGENTS.md)**
   - Added "Driver Configuration Rules (Mandatory)" section
   - Added "Runtime Safety Rules" section
   - Updated workflow steps to reference these rules
   - Updated troubleshooting with nil pointer guidance
   - Updated quality bar checklist

2. **[`skills/stash-scraper-builder/SKILL.md`](../skills/stash-scraper-builder/SKILL.md)**
   - Added "Driver Configuration Rules (Mandatory)" subsection
   - Added "Runtime Safety Rules" subsection
   - Updated "Choose modes" to mention `sceneByFragment`
   - Updated "Output skeleton" to mention `sceneByFragment`
   - Updated "Workflow" steps 3 and 5
   - Updated "Definition of done" with driver config and sceneByFragment checks
   - Updated "Troubleshooting" with nil pointer guidance
   - Updated "Anti-patterns" with driver config violations
   - Added Driver configuration DeepWiki link

3. **[`skills/stash-scraper-builder/references/scraping-failures.md`](../skills/stash-scraper-builder/references/scraping-failures.md)**
   - Added "Nil Pointer Dereference" section with symptoms, cause, solution, and prevention
   - Added example YAML showing `sceneByFragment` alongside `sceneByURL`
   - Linked to `SKILL.md` Runtime Safety Rules
   - Updated Verification Checklist to include `sceneByFragment` check

---

## CI Lint Changes

### New Workflow: `.github/workflows/lint-rules.yml`

**Purpose:** Automatically validate the 5 rules on every push/PR to scraper YAML files.

**Triggers:**
- Push to `scrapers/*.yml` or `scrapers/**/*.yml`
- Pull request to `scrapers/*.yml` or `scrapers/**/*.yml`

**Checks:**
1. No root `name:` key
2. No root `documentHeader:` key
3. No root `$vars:` key
4. No `driver.cookies` in public scrapers
5. `useCDP` only in top-level `driver` block (not entry points)

**Output:**
- Clear error messages for each violation
- Summary with total error count
- Exit code 1 if any violations found (fails the CI check)

**Example Output:**
```
=== Linting 5 Rules ===

Checking public scrapers:
scrapers/Coat.yml
scrapers/CK-Download.yml

Checking scrapers/Coat.yml...
  ❌ ERROR: Root 'name:' key found (should use filename as scraper name)

Checking scrapers/CK-Download.yml...
  ✓ Passed

=== Lint Summary ===
❌ Found 1 error(s)

Rules checked:
  1. No root 'name:' key
  2. No root 'documentHeader:' key
  3. No root '$vars:' key
  4. No 'driver.cookies' in public scrapers
  5. 'useCDP' only in top-level driver block (not entry points)

See AGENTS.md and SKILL.md for full rule documentation.
```

---

## Migration Guide

### For Existing Scrapers

If you have existing scrapers that violate these rules:

1. **Root `name:` key:** Remove the `name:` line. The filename is sufficient.
2. **`driver.cookies` in public:** Move to `scrapers/private/` or convert to CDP mode.
3. **`useCDP` in entry points:** Move to top-level `driver:` block.

### For New Scrapers

Follow the updated `SKILL.md` workflow:
1. Read "Driver Configuration Rules" before building
2. Add `sceneByFragment` when the site supports fragment-based scraping
3. Run local lint before committing (see below)

---

## Local Testing

You can run the lint checks locally before committing:

```bash
# Navigate to repo root
cd /path/to/stash

# Run lint checks manually
bash .github/workflows/lint-rules.yml
```

Or use the validator directly:

```bash
# Validate a single scraper
deno run --allow-read validator/index-zh-TW.mjs scrapers/Coat.yml
```

---

## Related Issues

- nil pointer dereference when `sceneByFragment` is missing: [stashapp/stash#6921](https://github.com/stashapp/stash/issues/6921)
- Driver configuration best practices: [CommunityScrapers DeepWiki](https://deepwiki.com/stashapp/CommunityScrapers/8.4-driver-configuration)

---

## Checklist

- [x] `AGENTS.md` updated with 5 rules
- [x] `SKILL.md` updated with 5 rules
- [x] `scraping-failures.md` updated with nil pointer troubleshooting
- [x] CI lint workflow created
- [ ] Existing scrapers migrated (future work)
- [ ] PR opened to merge `feat/5-rule-enforcement` to `main`

---

## Next Steps

1. Review this PR for accuracy
2. Merge to `main` branch
3. Run CI lint on existing scrapers to identify violations
4. Fix violations in a follow-up PR
5. Consider adding `sceneByFragment` requirement to schema validator (future enhancement)
