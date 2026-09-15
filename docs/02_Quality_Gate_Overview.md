# Quality Gate Overview

## Purpose

The quality gate provides repository-local validation layers for scraper configuration, policy conformance, tooling regressions, and documentation integrity. It does not prove live-site behavior or production readiness.

## Verification layers

| Layer | Command | What it establishes |
| --- | --- | --- |
| Schema | `node validator/index.mjs -a --ci` | Scraper YAML conforms to the validator's schema and mapping requirements |
| URL ordering | `node validator/index.mjs -a -s --ci` | URL arrays meet deterministic ordering requirements |
| Repository policy | `bash tools/validate-all.sh` | Selected scraper files pass repository quality-gate policies |
| Python regression | `python -m pytest tools/tests/ -v` | Covered Python tool and regression behavior passes |
| Documentation | `python tools/check_scraper_docs.py` | Embedded full-document YAML examples and implemented contradiction rules pass |
| Documentation index | `python tools/check_docs_index.py` | Documentation IDs, paths, and expected index coverage pass |
| Live scrutiny | `node tools/scrutiny.js scrapers/<Scraper>.yml --search` | A deliberately tested live site response supports the recorded selector evidence |

## Validation result separation / 驗證結果分離

Each result reports only its own verification layer. A pass in one layer does not imply a pass in another layer and cannot substitute for missing evidence.

每一項結果僅報告其自身驗證層。某一層通過不代表其他層亦通過，也不能取代缺少的證據。

The Validation workflow reports these six repository-automation layers in this order:

1. 擷取器欄位驗證 / Scraper Schema Validation
2. 網址陣列排序驗證 / URL Array Sorting Validation
3. 擷取器品質檢查 / Scraper Quality Gates
4. Python 回歸測試 / Python Regression Tests
5. 文件矛盾檢查 / Doc Examples and Contradictions
6. 文件索引驗證 / Doc Index Validation

The GitHub Actions Test Summary uses three states:

- 🟢 通過 (Pass): the layer ran and passed.
- 🔴 失敗 (Fail): the layer ran and failed.
- 🟡 未執行 (Not Run): the layer produced no result in that workflow run; it is neither a pass nor a test failure.

GitHub Actions Test Summary 使用三種狀態：

- 🟢 通過 (Pass)：該層已執行並通過。
- 🔴 失敗 (Fail)：該層已執行但失敗。
- 🟡 未執行 (Not Run)：該 workflow run 未產生該層結果；它不是通過，也不是測試本身的失敗。

Do not infer these equivalences:

- A schema pass is not a quality-gate pass.
- A quality-gate pass is not Python regression-test success.
- A documentation or index pass is not snapshot verification.
- Any repository-automation pass is not live-search verification, live-detail verification, authenticated/CDP validation, or production readiness.

不得推論下列等價關係：

- Schema 通過不等於品質閘門通過。
- 品質閘門通過不等於 Python 回歸測試成功。
- 文件或索引通過不等於快照驗證。
- 任何儲存庫自動化通過都不等於即時搜尋驗證、即時詳情頁驗證、登入/CDP 驗證或生產就緒。

## Gate usage

Run the complete local sequence before submitting a scraper change:

```bash
node validator/index.mjs -a --ci
node validator/index.mjs -a -s --ci
bash tools/validate-all.sh
python -m pytest tools/tests/ -v
python tools/check_scraper_docs.py
python tools/check_docs_index.py
```

Use live scrutiny separately when the target site is accessible and the task requires live evidence.
