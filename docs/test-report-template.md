# Full‑Suite Test Report Template (Markdown)

## Purpose

A single, human‑readable Markdown table that captures the result of running **every** automated verification layer in this repository (schema validator, quality gate, Python regression tests, documentation checker, and any future suites).  
The goal is to give a contributor or reviewer a one‑page health snapshot without needing to open CI logs.

---

## Template (copy‑paste ready)

```markdown
# Full‑Suite Test Report — <YYYY‑MM‑DD>

| Test Suite / Module | Total Tests | Passed | Failed | Skipped | Duration (s) | Notes / Failure Summary |
|---------------------|------------:|-------:|-------:|-------:|-------------:|:------------------------|
| **Schema Validator** (`npm run validate`) | 1 | 1 | 0 | 0 | — | Validation passed! |
| **Quality Gate** (`bash tools/validate-all.sh`) | 14 | 14 | 0 | 0 | — | All scrapers passed |
| **Python Tests** (`python3 -m pytest tools/tests/ -v`) | 13 | 13 | 0 | 0 | 1.67 | All passed |
| **Documentation Checker** (`python3 tools/check_scraper_docs.py`) | 1 | 1 | 0 | 0 | — | No contradictions |
| **URL Sorting Check** (`npm run validate-sort`) | 1 | 1 | 0 | 0 | — | (optional, run when URLs changed) |
| **TOTAL** | **30** | **30** | **0** | **0** | **1.67** | **100 % pass rate** |
```

---

## How to fill it in

1. **Run each suite locally** (or collect CI artifacts) and note the exact command used.
2. **Record one row per suite** with the counts you observed:
   - `Total Tests` – number of individual checks/items the suite reports (e.g., pytest items, scraper files validated).
   - `Passed`, `Failed`, `Skipped` – straight from the runner output.
   - `Duration (s)` – wall‑clock time reported by the runner (use `—` if the runner does not emit timing).
3. **Add a `TOTAL` row** that sums the numbers and computes the overall pass‑rate:
   ```
   Overall pass‑rate = (Σ Passed / Σ Total) × 100 %
   ```
4. **Notes / Failure Summary** – keep it concise:
   - For a clean run: a short phrase such as “All passed” or “No contradictions”.
   - For failures: list each failing test/scraper with a one‑line reason (e.g., `test_fragment_mapping – AssertionError: expected 3 got 2`).
   - For skipped items: give the skip reason (e.g., `requires‑docker`, `network‑only`).

---

## Where to store the report

- **CI artifacts** – the workflow can generate this file and upload it as a build artifact.
- **Local runs** – commit the file as `TEST-REPORT.md` in the repository root (or `docs/TEST-REPORT.md`) when you want to snapshot a known‑good state before a release or after a large refactor.
- **Historical tracking** – add a dated suffix (e.g., `TEST-REPORT-2026-09-08.md`) if you keep multiple reports.

---

## Integration with existing docs

- The **[Testing Guide](06_Testing_Guide.md)** lists the canonical commands; this template is the *output format* for those commands.
- The **[Production Gate](04_Production_Gate.md)** checklist can reference a completed test report as evidence that the gate criteria are met.
- Future CI jobs can auto‑populate the table by parsing JSON/JUnit output and appending a row per suite.

---

*Template version: 1.0 — created 2026‑09‑08*
