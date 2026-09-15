# CI Workflows

## Overview

The repository uses GitHub Actions to validate scraper YAML, URL ordering, repository quality rules, Python regression behavior, and documentation integrity. The workflows are automation evidence only: a successful workflow is not live-search verification, live-detail verification, authenticated/CDP verification, snapshot verification, or production readiness.

## Validation workflow

The `Validate` workflow runs on pushes and pull requests targeting `main`.

```bash
# Scraper schema validation
node validator/index.mjs -a --ci

# Deterministic URL-array ordering
node validator/index.mjs -a -s --ci

# Quality gate
bash tools/validate-all.sh

# Python test suite and documentation checks
python -m pytest tools/tests/ -v
python tools/check_scraper_docs.py
python tools/check_docs_index.py
```

## Test Summary / 測試摘要

The Validation workflow publishes a bilingual Test Summary in the GitHub Actions job summary. Each summary row maps to a workflow section with the same number, so detailed command output and failure diagnostics remain available in that section.

Validation workflow 會在 GitHub Actions job summary 發布雙語 Test Summary。每一列對應一個具有相同序號的 workflow section；詳細命令輸出與失敗診斷保留在該 section 中。

| 序號 | 驗證層 | English name |
| ---: | --- | --- |
| 1 | 擷取器欄位驗證 | Scraper Schema Validation |
| 2 | 網址陣列排序驗證 | URL Array Sorting Validation |
| 3 | 擷取器品質檢查 | Scraper Quality Gates |
| 4 | Python 回歸測試 | Python Regression Tests |
| 5 | 文件矛盾檢查 | Doc Examples and Contradictions |
| 6 | 文件索引驗證 | Doc Index Validation |

The Result column uses these fixed states:

- 🟢 通過 (Pass): the verification layer ran and passed.
- 🔴 失敗 (Fail): the verification layer ran and failed.
- 🟡 未執行 (Not Run): the workflow run produced no result for that layer; it is neither a pass nor a test failure.

結果欄採用以下固定狀態：

- 🟢 通過 (Pass)：該驗證層已實際執行且成功完成。
- 🔴 失敗 (Fail)：該驗證層已實際執行，但驗證結果失敗。
- 🟡 未執行 (Not Run)：該 workflow run 未產生該驗證層的結果；它不是通過，也不是測試本身的失敗。

The summary is a concise execution-status view. It does not replace detailed logs, artifact evidence, or a durable test report. A workflow run is successful only when all six required verification layers pass; a Not Run layer leaves required verification incomplete.

摘要是簡明的執行狀態視圖，不會取代詳細日誌、artifact 證據或可保存的測試報告。只有六個必要驗證層全部通過時，workflow run 才會成功；出現未執行層表示必要驗證尚未完成。

## Pull-request checks

The pull-request workflow validates changed scrapers and documentation-related checks. Review its individual workflow sections for the command scope and detailed output.

## Live scrutiny

Live scrutiny is intentionally separate from repository validation because it accesses target websites and can be affected by availability, rendering, authentication, rate limits, and site changes. Run it deliberately:

```bash
node tools/scrutiny.js scrapers/<Scraper>.yml --search
```

Record the evidence type, date, source URL, constraints, and result in the repository's live-test records. Do not infer live verification from schema, quality-gate, test, or documentation-check success.
