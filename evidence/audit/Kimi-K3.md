# Review Notes — stash-scraper-builder references audit

Audit of `skills/stash-scraper-builder/references/` (21 files) against 9 official documentation sources. Rechecked 2026-08-30; all file SHAs unchanged since prior pass, so previously flagged defects remain live. Ordered by materiality and risk.

## Part 1: Material Gaps and Risk

| Serial | Domain | Observation | Recommendations |
|---|---|---|---|
| 1 | Driver / CDP config | `cdp-workflow.md` and `scraping-failures.md` instruct `ws://localhost:9222` as the Chrome CDP path; both official sources specify `http://localhost:9222/json/version`. Users following this will likely fail the visible-CDP login flow — the exact scenario these files exist for. | Change both files to `http://localhost:9222/json/version`. If `ws://` works in your build, annotate it as a verified alternative with the Stash version tested. |
| 2 | queryURL placeholders | `schema-checklist.md` and `validator-errors-zh-TW.md` state "`{title}` is not a queryURL placeholder"; the spec explicitly lists `{title}` among `sceneByFragment` placeholders (`{checksum}`, `{oshash}`, `{phash}`, `{filename}`, `{title}`, `{url}`). | Either fix to match the spec, or — if live validator testing contradicts the docs — rewrite as a documented deviation with evidence, not a blanket claim. |
| 3 | queryURLReplace | `schema-checklist.md` says `queryURLReplace` keys are "custom capture names such as `id`/`slug`, not official placeholders"; official examples key it on the placeholder names themselves (`filename:`, `url:`). | Verify against the community validator and a live Stash instance; correct the checklist or annotate the deviation. |
| 4 | Script auth (deepwiki 5.2) | Token-based API auth is absent: zero hits for `access_token` and `Authorization` in references, though deepwiki 5.2 (a listed source) centers on bearer-token headers, key extraction from site JS, and INI caching (Teamskeet, ModelCentro, Algolia). Only dependency layout (`algoliasearch`, `py_common`) is covered. | Add a short "API auth in scripts" section to `script-actions.md`: token constant + `Authorization: Bearer` header, key extraction, local caching, 401 handling. |
| 5 | Stash GraphQL API | No coverage of the `/graphql` endpoint or `ApiKey` header. Material only if script scrapers should call back into Stash (real community scripts do). | Decide scope explicitly: either add a minimal section (endpoint, `ApiKey` header, 401) or state the exclusion in SKILL.md. |
| 6 | Required fields | `schema-checklist.md`: "Scene: no required fields" — the spec requires `Title` when the scene is fileless. Other required-field rows are correct. | Add the fileless qualifier; one-line fix. |
| 7 | Validation assets | Vendored `scraper.schema.json` (~5.3 KB) is a trimmed subset of the upstream ~957-line validator schema, with no pinned commit or date. It will silently drift and can contradict the real validator your quality gate depends on. | Add a header with upstream commit SHA + retrieval date; better, add a CI step diffing against upstream. |
| 8 | Source provenance | References blend latest-Stash docs with CommunityScrapers-stable DeepWiki pages without declaring the skew. `validator-errors-zh-TW.md` does cite its canonical DeepWiki page — good pattern, not applied consistently. | Note the tracked version per source; extend the "Canonical reference" footer to all files. |
| 9 | User-facing scope | stash-box explicitly excluded; Tagger view, Identify task (0 hits), fingerprint submission, and source-index (sha256) content absent. Reasonable for a builder skill — but then "references cover these 9 URLs" is overstated. | State exclusions in SKILL.md so the skill doesn't overclaim; no content work needed unless scope changes. |

## Part 2: Operational Optimization

| Serial | Domain | Observation | Recommendations |
|---|---|---|---|
| 1 | Coverage governance | No artifact maps the 9 source URLs to reference files; gaps were only discoverable by manual audit. | Add a coverage matrix (URL → file(s) → status) in SKILL.md or README; makes regressions and exclusions self-evident. |
| 2 | Rule duplication | The 5 core rules (name-matches-file, top-level `useCDP`, no cookies, `sceneByFragment`, Last Updated) appear in SKILL.md, AGENTS.md, README.md, docs/, and the gate script — same drift risk internally as Part 1 item 7 externally. | Single-source the rules (one canonical file, others reference it), or generate the gate script's greps from it. |
| 3 | CDP setup options | Only local visible Chrome covered; the `chromedp/headless-shell` docker option from the spec is absent (0 hits). | Add a short headless-server note to `cdp-workflow.md` if you ever run Stash in docker. |
| 4 | Header semantics | `scraping-failures.md` mentions User-Agent for 403s; the nuance that `driver.headers` Key `User-Agent` overrides only the scraper's default UA is missing. 401 handling is present. | One-line addition on the override semantics. |
| 5 | Verified strengths | Recheck confirmed: correct GJSON terminology (avoids DeepWiki's "JSONPath" mislabel); `groupByURL` replacing deprecated `movieByURL`; common-fragment no-recursion rule; "Reload scrapers" runtime check; "validator passing ≠ selector correctness"; `# UNVERIFIED` tagging; progressive "Load when" headers; bilingual summaries. | Keep these patterns; require them for any new reference file. |
| 6 | Guardrail transparency | "Don't write GJSON filter expressions" is a local simplification stricter than the engine's capability. Fine as policy, but unstated. | Label local-only rules as such ("stricter than upstream") so users don't misread engine limits. |

## zh-TW 快速總覽

- 複查結果：21 個檔案 SHA 未變，之前指出的問題全部仍在。
- 最優先修三件與官方文件矛盾之處：CDP path 應為 `http://localhost:9222/json/version`（非 `ws://`）；`{title}` 其實是合法 queryURL placeholder；`queryURLReplace` 的 key 應為官方 placeholder 名稱（如 `url`、`filename`）。
- 主要缺口：GraphQL `ApiKey` 完全未涵蓋；腳本 API 認證模式（bearer token、金鑰擷取與快取、401）未涵蓋；stash-box 與 Tagger/Identify 屬刻意排除，但應在 SKILL.md 明確聲明。
- 本次新增確認的優點：GJSON 用語正確、`groupByURL` 已取代 `movieByURL`、common fragments 不可遞迴規則正確、有 Reload 與 `# UNVERIFIED` 檢查。
- 營運建議：vendored schema 加註上游 commit 與日期；建立「文件 URL → 參考檔」覆蓋矩陣；五條核心規則單一來源化避免內部漂移。

## Method note

`get_file_contents` does not return file bodies for this private repo, so findings rest on code-search fragments — high confidence on presence/absence of specific terms, but files were not read end-to-end.

## Sources audited

- https://docs.stashapp.cc/in-app-manual/scraping/
- https://docs.stashapp.cc/in-app-manual/scraping/scraperdevelopment/
- https://docs.stashapp.cc/metadata-sources/
- https://docs.stashapp.cc/api/
- https://docs.stashapp.cc/guides/scraping-metadata-behind-login/
- https://docs.stashapp.cc/metadata-sources/scrapers/
- https://deepwiki.com/stashapp/CommunityScrapers/8.4-driver-configuration
- https://deepwiki.com/stashapp/CommunityScrapers/5.2-api-authentication
- https://deepwiki.com/stashapp/CommunityScrapers/1.1-system-architecture
