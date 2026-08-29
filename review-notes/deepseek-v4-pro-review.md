Reviewer: DeepSeek V4 Pro  
Date: 2026-08-29  
Repo: daniel-yfc/stash → skills/stash-scraper-builder/  
Scope: Cross-reference local skill docs against 11 authoritative sources (Stash official docs, DeepWiki CommunityScrapers, upstream schema/validator)


4. Consolidated Review Table

PART A — Material Gaps and Risk

| # | Domain | Severity | Observation | Recommendation |
|---|--------|----------|-------------|----------------|
| A01 | CDP attach URL | H | S8 tells user to set Chrome CDP path to http://localhost:9222/json/version. S2 cdp-workflow.md says that value is wrong/old and the correct attach URL is ws://localhost:9222. A user following S8 verbatim will fail to attach visible Chrome. | Either file an upstream PR against Stash-Docs correcting S8, or add an explicit "Deprecated upstream guidance" callout in cdp-workflow.md. Do not silently keep the contradiction. |
| A02 | CDP settings menu path | H | S8 uses path Settings → Metadata Providers → Scraping → Chrome CDP Path; S2 and S10 use Settings → System → Application Paths. They are not the same menu. | Verify the correct menu in a running Stash build; centralize the exact path in one file (cdp-workflow.md) and have all other references link, never restate. |
| A03 | {title} queryURL placeholder | H | S4 lists {title} as a valid sceneByFragment queryURL placeholder. S2 schema-checklist.md explicitly bans it: "{title} is not a queryURL placeholder." If a site exposes only the title, following the skill disables a legal mode. | Decide which is authoritative. If validator rejects {title}, cite the line in validate.js. If legal, remove the prohibition; otherwise expand S2 to list every banned placeholder, not just one. |
| A04 | driver.headers upstream gap | H | S10 documents driver.headers as a property. S4 (official scraperdevelopment.md) does not document it at all. If the user's Stash build hasn't implemented it, headers are silently dropped. | Add a one-line note: "Available in scrapers consuming CommunityScrapers schema ≥ version X; verify with Reload Scrapers log." Cross-link to schema version constant. |
| A05 | ValueRandom cookie | M | S10 documents Cookies[].ValueRandom (random N-char string). No other source mentions it. Risk: author writes a scrape using it, official docs don't validate the assumption. | Either drop it from this skill's surface or add a single clarifying line in references/. |
| A06 | Authority of local schema stub | M | S2 schema-checklist.md says the local scraper.schema.json stub is deliberately incomplete and must not override the official schema — but the file is listed in the "Load when needed" table. An automated tool may naively prefer the local copy. | Rename to scraper.schema.LOCAL-STUB.md or move outside references/. Keep the deprecation note. |
| A07 | sceneByName ↔ sceneByQueryFragment coupling | M | S2 asserts "sceneByName requires sceneByQueryFragment." S4 only loosely couples them. New users may wonder if a name-only scraper can stand alone. | Tighten S4 wording OR document the validator rule in schema-checklist.md with a link to validate.js. |
| A08 | performerByFragment action surface | M | S2: "performerByFragment cannot use scrapeXPath or scrapeJson (script only)." S4 says the same restriction only for XPath but is silent about JSON. Inconsistent. | Make the prohibition explicit in both S2 and S4: "scrapeXPath and scrapeJson are not valid for performerByFragment." Confirm against scraper.schema.json oneOf block. |
| A09 | Common-fragment recursive reference | M | S4 gives a concrete example of bad recursion ($info in $models causes error). S2 fully bans common-to-common references but only states the abstract rule. | Add the S4 concrete example to S2. One illustrative YAML block is worth more than a paragraph. |
| A10 | Headers vs CDP limitations | M | S10 contrasts useCDP behavior but is silent about whether driver.headers applies to CDP-fetched subresources. S4 doesn't address this either. | Add one paragraph in cdp-workflow.md and xpath-patterns.md: "headers are sent on direct HTTP requests; CDP pages make their own requests through the browser session." |
| A11 | Sleep default/minimum drift | M | S10: default 2s, min 1s. S4: "defaults to 2 seconds." S2 cdp-workflow.md does not state the default at all. | State the default once in cdp-workflow.md and reference S4/S10. |
| A12 | sceneByQueryFragment.queryURL placeholder conflict | M | S2: "sceneByQueryFragment.queryURL uses {url} … {title} is not a queryURL placeholder." But {title} is a fragment-mode placeholder in S4. S2 needs scoping. | Rewrite as: "sceneByQueryFragment.queryURL must use {url}. Other fragment placeholders belong on sceneByFragment.queryURL, not here." |
| A13 | subScraper parsing anchor | M | S4: "executed after all other post-processes are complete and before parseDate." S2 post-processing.md does not restate. | Add: "subScraper runs between postProcess items and parseDate — keep parseDate after subScraper." |
| A14 | Ghost reference files | H | S1 advertises 17 references/.md files. At least json-patterns.md, json-examples.md, script-actions.md, title-patterns.md, advanced-patterns.md, examples.md, best-practices.md, eval-pack.md, api_reference.md are *not retrievable**. Skill advertises content an automated tool will try to load and fail. | Run git ls-files skills/stash-scraper-builder/references/ against the advertised list. Generate every missing file OR remove it from the load table. Add CI check. |
| A15 | No SCOPE.md / boundary doc | M | SKILL.md has a "Scope" section but conflates scope with warnings. A new contributor cannot tell which lines are normative. | Add SCOPE.md or expand current Scope to a table: In-scope / Out-of-scope / Anti-patterns / Style-only. |
| A16 | common.infoRow rejection not cited | L-M | S2 xpath-patterns.md says reject common.infoRow (without $) but never cites the validator line. Easy to dispute later. | Add citation footnote linking to schema line (pattern: "^\\$.+$"). |
| A17 | Performer-cleaning JS authority claim | M | S2 performer-cleaning.md: "the only authorized implementation." The authority is the repo itself. S4 doesn't say there is a canonical cleaner. | Soften to "the canonical block used by this skill" and link to a real working example inside CommunityScrapers. |
| A18 | Translator policy contradiction | M | S1: "Scraped values stay in the source language — do not translate." But S2 performer-cleaning.md aggressively rewrites CJK names. | Add clause: "Performer-name cleaning is intra-script normalization (kana removal, alias stripping) and is not translation." |
| A19 | CDP clicks.sleep — per-click or global? | L-M | S4 and S2 describe stacking behavior but no single document states the per-click default sleep. | One-line note in cdp-workflow.md: "Per-click sleep defaults to 2s. Page-level driver.sleep is separate and stacks." |
| A20 | No integrity check with upstream schema version | M | Skill references schema rules but never quotes the schema version it was last reconciled against. | Add at top of schema-checklist.md: "Reconciled against CommunityScrapers @ commit ` / schema version `." Re-run on every PR touching the table. |
| A21 | "Studio map" anti-pattern underspecified | L | S1 anti-patterns include "hard-coding matcher expected values." post-processing.md says "prefer map over a long replace list" but never says how many is too many. | Add rule of thumb: "If > 5 variants, write a map; if any variant can be missing, fall back to replace with javascript." |
| A22 | parseDate "Today/Yesterday" not restated | L | S2 date-formats.md confirms this behavior. post-processing.md never restates it. A reader using only one file misses this. | Cross-link from post-processing.md → date-formats.md. |

PART B — Operational Optimization

| # | Domain | Observation | Recommendation |
|---|--------|-------------|----------------|
| B01 | Duplication of post-processing rules | concat placement, postProcess[] operator order, and split-after-postProcess stated in three places: S4, S2 post-processing.md, S2 SKILL.md. | Pick one canonical owner (references/post-processing.md); have others simply link. |
| B02 | Duplication of parseDate rules | Same: S4, S2 date-formats.md, S2 post-processing.md, S2 SKILL.md. | Pick owner; reference only. |
| B03 | Duplication of CDP cookies/headers | S2 schema-checklist.md, cdp-workflow.md, S10, S4. | Single source in cdp-workflow.md; validator table belongs in schema-checklist.md referencing it. |
| B04 | Selector-syntax rules duplicated | "Always quote XPath," "no div[3]," "prefer semantic anchors" repeated across files. | Move all style rules to xpath-patterns.md ("Style guide"); reference once from SKILL.md. |
| B05 | Loader table large and ad-hoc | S1 table lists 17 files ordered by intuition rather than task grouping. | Regroup: ① Run on every output ② Run when writing XPath ③ Run when writing JSON ④ Run when fixing failures. |
| B06 | No decision flowchart for scrapeXPath vs scrapeJson vs script | S1 gives the 4-way decision in prose. LLM-driven skill benefits from a pseudo-code decision tree. | Replace prose with a fenced code block: Public HTML → scrapeXPath; JSON API → scrapeJson; … |
| B07 | Mixed zh-TW orientation implicit | Every S2 file has a zh-TW "概要" line. Style creep risk: future contributors may drop or expand. | Add "Bilingual policy" at top of SKILL.md. Decide: summaries for humans (preserved) or normative for LLM output? |
| B08 | Loading-on-demand vs always-on separation unclear | S1 has both "Always-on rules" and "Load when needed" table. Some conditional rules look always-on. | Mark each table row with (always) / (conditional). |
| B09 | No "When to reject the task" guidance | Skill says scraper-building tasks but never says "if user wants action: stash or stash-box, refuse." | Add explicit refusal template (1–2 lines). |
| B10 | Empty anti-patterns for JSON | Anti-patterns mostly target XPath. JSON-specific (key collisions, GJSON union limitations) absent. | Add 3–5 JSON anti-patterns entries. |
| B11 | URLs/Groups vs URL/Movies legacy note | Mentioned in S1 only. S4 readers won't know the legacy terms. | Add 2-line legacy note in schema-checklist.md linking S4's deprecation of movieByURL. |
| B12 | Last Updated date format unspecified | S1 skeleton shows # Last Updated: YYYY-MM-DD but doesn't define format or drift policy. | Specify ISO-8601 and explain drift policy (one re-emit = one refresh). |
| B13 | Definition-of-done lacks evidence requirement | DoD says "verified selectors" but doesn't require attaching verification evidence. | Add: emit # Verified on: URL1, URL2, URL3 (YYYY-MM-DD) line near each # UNVERIFIED. |
| B14 | No negative examples | Skill mostly shows correct YAML. Anti-examples would help contributors. | Add one annotated bad-vs-good YAML block in xpath-patterns.md and one for post-processing.md. |
| B15 | SKILL.md description block too long | Anthropic skills recommends tight description: line. S1's is three lines. | Tighten; move specifics to body. Lower risk of mis-trigger. |
| B16 | No README for references/ | Many files, no index. | Add references/README.md listing each file, its purpose, and authority level (canonical / derived / human-only). |
| B17 | GitHub tree widget broken in repo | Repo tree at S1 path renders as 10K-token nav chrome — humans and crawlers get nothing useful. | Document canonical read path: raw.githubusercontent.com/daniel-yfc/stash/main/skills/stash-scraper-builder/. |

5. Priority & Recommendations

Immediate (H-severity, fix first)

1. A01 + A02 — Fix CDP URL and menu path contradictions. Verify against running Stash build.
2. A03 — Resolve {title} queryURL placeholder conflict (validator vs official docs).
3. A04 — Document driver.headers availability and version dependency.
4. A14 — Resolve ghost reference files: generate or remove from load table.

Structural (one-time cleanup)

5. Establish "one canonical owner" per topic:
   - Post-processing → references/post-processing.md
   - Schema rules → references/schema-checklist.md
   - Dates → references/date-formats.md
   - CDP → references/cdp-workflow.md
   - XPath style → references/xpath-patterns.md
   - Delete or shorten duplicates in other files.

6. Add references/README.md (index of files + authority levels).

7. Reconcile skill against CommunityScrapers schema at a pinned commit. Stamp in schema-checklist.md.

8. Add SCOPE.md distinguishing normative vs anti-pattern vs style-only.

9. Reorganize "Load when needed" into 4 task groups (B05).

10. File upstream issue/PR for S8 (CDP path + menu location), citing A01+A02.

6. Risks, Blind Spots, and Checkpoints

Risks of Acting on These Recommendations

- Over-merging may lose "LLM-friendly pithiness." Decide by criterion: would a senior maintainer delete this duplicate?
- Skill is bilingual (en + zh-TW); unification may erase intentional bilingual redundancies. Verify intent with repo owner before aggressive de-dup.
- Stash's CDP/cookie behavior is implementation-side; an upstream Stash change could invalidate A01/A02 fixes. Pin a Stash version in schema-checklist.md.

Cognitive Biases to Flag

- Authority bias: I trusted DeepWiki > official docs > local code. When further judgment is needed, choose by empirical verification on a running Stash, not by source pedigree.
- Confirmation bias in skill review: I give S2 the benefit of doubt on stricter rules (e.g., {title}), but A03 contradicts S4 and should be empirically tested against the validator's actual output.

Exit Criteria (When to Stop Optimizing)

- Each references/*.md either (a) has one canonical topic owner, or (b) says "see X."
- Every advertised file in the load table resolves (B17 / A14).
- Validator runs clean on 3 randomly chosen scrapers from CommunityScrapers corpus.

7. Questions for the Repo Owner

1. Do you want a practical refactor PR that merges duplicates (B01–B03), or a policy doc only?
2. For A03 ({title} queryURL) — do you have access to a Stash build to run an actual scraper test?
3. A14 ghost files — generate stubs, delete from load table, or defer to follow-up issue?
4. Authority hierarchy — comfortable putting CommunityScrapers validator above official docs.stashapp.cc? (S2 already does; this is mildly contrarian.)
5. Repo name: I reviewed daniel-yfc/stash but you wrote yfc-daniel/stash for export. Same repo? If yfc-daniel/stash is new, it needs to be created first.

8. 繁體中文重點摘要 (zh-TW)

主要風險 (Material Risks)

1. CDP 路徑互相矛盾（高）：官方 Doc 要使用者把 Chrome CDP path 設成 http://localhost:9222/json/version，但 skill 說正解是 ws://localhost:9222。照官方走會 attach 不上。
2. CDP 選單路徑不一致（高）：官方寫「Settings → Metadata Providers → Scraping」，skill 寫「Settings → System → Application Paths」。使用者找不到欄位。
3. {title} queryURL placeholder 衝突（高）：官方列為合法，skill 明令禁止。當站點只能提供標題時，遵循 skill 會禁用合法模式。
4. driver.headers 上游未文檔化（高）：DeepWiki 有、官方 Doc 沒有。若 Stash build 尚未實作，headers 會被靜默丟掉。
5. 參考檔案幽靈連結（高）：SKILL.md 廣告的多個 references/*.md 檔案抓不到。自動化工具會 fail。

主要歧異與漂移

- sceneByName 必須配 sceneByQueryFragment：skill 像強規則，官方只是隱含。
- performerByFragment 禁用 XPath/JSON：官方僅說禁用 XPath，skill 擴張為全禁。
- cookie.ValueRandom：DeepWiki 有，官方 & skill 沒寫。
- local schema stub 優先級：skill 自承不完整，但檔名仍叫 scraper.schema.json，工具會誤用。

重複與最佳化

- post-processing.md / date-formats.md / xpath-patterns.md 三處規則互抄；應挑 canonical owner。
- 「Load when needed」表過長無分組；建議分四群：每次輸出／寫 XPath／寫 JSON／修失敗。
- 缺 references/README.md 與每個檔案的權威等級。

建議處置順序

1. 修 H 等級五項（CDP URL、CDP menu、{title}、headers、幽靈檔案）
2. 為每個主題指定唯一 owner，其他檔案只引用
3. 建立 references/README.md，驗證 17 個連結皆存在
4. 釘住 CommunityScrapers 對應 commit 作為漂移基準
5. 補 SCOPE.md 區分 in-scope / out-of-scope / anti-pattern / style-only

最弱假設 (Weakest Assumption)

我預設 DeepWiki CommunityScrapers 優先於 Stash 官網，但 A01/A02 已顯示官網是錯的——下一步應以「實際執行中的 Stash 驗證行為」為準，而非繼續靠文獻比較。

End of review.
Generated by DeepSeek V4 Pro, 2026-08-29

