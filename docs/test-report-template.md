# Test Report Template

## CI Test Summary Boundary / CI 測試摘要邊界

The GitHub Actions Test Summary is a concise, per-run status view using 🟢 通過 (Pass), 🔴 失敗 (Fail), and 🟡 未執行 (Not Run). It does not replace this detailed test-report template.

GitHub Actions Test Summary 是每次執行的簡明狀態視圖，使用 🟢 通過 (Pass)、🔴 失敗 (Fail) 與 🟡 未執行 (Not Run) 三種狀態。它不能取代本詳細測試報告模板。

Use this template when a durable evidence record is required. Record commands, scope, totals, passed/failed/skipped counts, duration, fixtures, provenance, limitations, and findings here as applicable.

需要保存可追溯的證據紀錄時，應使用本模板。視情況記錄命令、範圍、總數、通過/失敗/略過數、耗時、fixtures、來源、限制與發現。

## Report metadata

| Field | Value |
| --- | --- |
| Report ID | `<REPORT-ID>` |
| Date | `<YYYY-MM-DD>` |
| Author | `<name or role>` |
| Commit / revision | `<commit SHA or revision>` |
| Scope | `<scrapers, documents, tools, or workflow scope>` |
| Environment | `<local, CI runner, operating system, runtime versions>` |

## Objective

State the verification objective, the affected repository paths, and the decision this report supports.

## Commands and results

| Test Suite / Layer | Command / Tool | Total | Passed | Failed | Skipped | Duration | Status | Notes / Key Findings |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| Schema Validation | `node validator/index.mjs -a --ci` | `<n>` | `<n>` | `<n>` | `<n>` | `<duration>` | `<PASS/FAIL>` | `<findings>` |
| URL Sorting Check | `node validator/index.mjs -a -s --ci` | `<n>` | `<n>` | `<n>` | `<n>` | `<duration>` | `<PASS/FAIL>` | `<findings>` |
| Repository Quality Gate | `bash tools/validate-all.sh` | `<n>` | `<n>` | `<n>` | `<n>` | `<duration>` | `<PASS/FAIL>` | `<findings>` |
| Python Test Suite | `python -m pytest tools/tests/ -v` | `<n>` | `<n>` | `<n>` | `<n>` | `<duration>` | `<PASS/FAIL>` | `<findings>` |
| Documentation Check | `python tools/check_scraper_docs.py` | `<n>` | `<n>` | `<n>` | `<n>` | `<duration>` | `<PASS/FAIL>` | `<findings>` |
| Documentation Index | `python tools/check_docs_index.py` | `<n>` | `<n>` | `<n>` | `<n>` | `<duration>` | `<PASS/FAIL>` | `<findings>` |
| Live Scrutiny | `node tools/scrutiny.js scrapers/<Scraper>.yml --search` | `<n>` | `<n>` | `<n>` | `<n>` | `<duration>` | `<PASS/FAIL/NOT RUN>` | `<record evidence type and constraints>` |

## Evidence and provenance

Record the relevant evidence for each claimed result:

- Command output or CI run identifier.
- Repository commit or revision tested.
- Fixtures, snapshots, source URLs, and capture dates when applicable.
- Whether evidence was static, unrendered HTTP, rendered DOM, rendered snapshot, or live interaction.
- Authentication, CDP, age-gate, rate-limit, or availability constraints without recording credentials, cookie values, session tokens, API keys, or browser-profile data.

## Limitations and unresolved items

List unverified selectors, unavailable sites, skipped tests, assumptions, known policy exceptions, and follow-up work. Do not represent schema validation, a policy-gate pass, or a test-suite pass as live verification or production readiness.

## Decision

State the decision supported by this report and distinguish it from production promotion. Record what remains unverified.