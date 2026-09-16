[ Material Gaps and Risk ]

| # | Domain | Observation | Recommendations |
|---|---|---|---|
| 1 | Schema conformance — critical | SKILL.md says "Do not emit root keys name…The filename is the scraper name," repeated in schema-checklist.md, script-actions.md, json-patterns.md, examples.md. This is false. The official schema has "required": ["name"] with "additionalProperties": false. Stash's own manual: "name is mandatory." Every live scraper I pulled starts with name: AVMoo / name: Kink. Worse, the skill's own bundled stub also declares "required": ["name"] — so the skill instructs the agent to produce files that its own validator rejects. Every artifact this skill emits fails validation and will not load in Stash. | Invert the rule immediately: root name is mandatory, conventionally matching the CamelCase filename. Keep the $vars prohibition (correct — no such key exists). Drop documentHeader (not a Stash key; mentioning it invents a concept). Re-run the eval pack after the fix — all 5 tasks currently emit invalid files. |
| 2 | Invented runtime causality | The "Runtime Safety Rules" claim that adding sceneByFragment prevents nil pointer dereference, elevated to a mandatory rule in SKILL.md, scraping-failures.md, Definition of Done, and Anti-patterns. Stash issue #6921 shows the opposite: the panic occurs in mappedScraper.processSceneRelationships via jsonFragmentScraper.scrapeSceneByScene when a fragment scraper returns zero rows while the scene block defines relationships (Performers/Tags/Studio). Adding sceneByFragment with relationship mappings creates the trigger condition. It is an upstream Stash bug (v0.31.1), not a scraper-authoring defect. | Delete the rule from all four locations. Replace with an accurate note: fragment/Identify paths can panic upstream on empty results; mitigate by testing fragment modes against non-matching input, not by adding entry points. This is the clearest example of a fabricated causal claim hardening into a mandatory rule across files — treat it as a process failure, not just a content error. |
| 3 | Placeholder semantics | Four files assert {title} is "not an official queryURL placeholder" (SKILL.md, json-patterns.md, examples.md, schema-checklist.md). Stash's manual explicitly lists, for sceneByFragment: {checksum}, {oshash}, {phash}, {filename}, {title}, {url}. {title} is official. | Correct all four. Keep the useful underlying guidance — don't point a query-fragment queryURL at a search endpoint — but stop justifying it with a false factual claim. Repeating an error across four files is exactly the drift amplification you asked me to look for. |
| 4 | Non-functional template | scraping-failures.md gives a "Solution" example: sceneByFragment: {action: scrapeXPath, scraper: sceneScraper} with no queryURL. Stash's manual: "For sceneByFragment and sceneByQueryFragment, the queryURL field must also be present." json-patterns.md §4 compounds this by listing fragment queryURL as merely "Optional." A copied example silently fetches nothing. | Add mandatory queryURL to every XPath/JSON fragment example (see Kink.yml, which builds https://www.kink.com/shoot/{filename} with queryURLReplace). Note the exception: action: script needs no queryURL. |
| 5 | Bundled stub is actively misleading | references/scraper.schema.json models driver.cookies flat (Name/Value/Domain/Path/CookieURL on one object). The official schema is nested: array items require Cookies, with CookieURL at the outer level, inner items requiring Domain+Path+Name and a oneOf on Value/ValueRandom. The stub also types every entry point as bare array/object, validating nothing, while additionalProperties: false produces false rejections. SKILL.md says "Schema wins over docs" without naming which schema — a same-sentence ambiguity that guarantees run-to-run variance. | Either delete the stub or regenerate it from upstream. Given schema-checklist.md already says the official validator is authoritative, deleting is simpler and removes a whole contradiction class. Rewrite the precedence line as: "Official CommunityScrapers schema + validate.js win over all prose in this skill." |
| 6 | Contradiction with official setup docs | cdp-workflow.md step 3 instructs Chrome CDP path = ws://localhost:9222 and explicitly says "do not use the old http://localhost:9222/json/version." The current official guide (guides/scraping-metadata-behind-login/) says to set it to http://localhost:9222/json/version. It also relocates the setting (Settings → System → Application Paths vs the official Settings → Metadata Providers → Scraping). | Verify against your actual Stash version and pin it. Both forms may work across versions, but asserting the official value is "old" without evidence is the kind of confident deviation that costs users an hour. Cite the version where the change applies, or defer to the official path. |
| 7 | Same behavior, three descriptions | Unmatched map key is documented as "misses fail silently — cover every real variant" (advanced-patterns.md), "missed keys pass through unchanged" (best-practices.md), and "Unmatched key → original usually passes through" (post-processing.md). These are three different contracts, and "usually" is unfalsifiable. | Test one case, write one sentence, reference it from the other two files. Hedge words like "usually" in a rules document are drift seeds — the agent resolves them differently each run. |
| 8 | Broken YAML in a copy-target | script-actions.md "Full mode skeleton" — the performerByFragment block indents - ../SomeDependency/script.py under - python, which is malformed YAML and will fail to parse. | Fix the indentation. Add a CI step that YAML-parses every fenced block in references/** — this class of error is fully mechanical and should never reach review. |
| 9 | Undocumented required fields | Cookie inner items require Domain, Path, Name plus exactly one of Value/ValueRandom. xPathScrapers/jsonScrapers keys must match ^\w+$ (no hyphens/dots in scraper names). Neither appears anywhere in the skill. | Add both to schema-checklist.md. The ^\w+$ constraint in particular is easy to violate with names like scene-scraper. |
| 10 | Header/footer contradiction | best-practices.md (G4): "Add # Last Updated YYYY-MM-DD at the end of the file (EOF)." SKILL.md's mandatory skeleton, examples.md, and json-examples.md all put # Last Updated: YYYY-MM-DD on line 1. Upstream AVMoo.yml places it at EOF. | Pick EOF to match upstream convention, and correct the skeleton. Minor in isolation, but it's a mandatory-shape rule contradicting itself, which undermines trust in the whole skeleton. |

[ Operational Optimization ]

| # | Domain | Observation | Recommendations |
|---|---|---|---|
| 11 | Error propagation into tests | eval-pack.md Task 1 and Task 3 mandate sceneByURL + sceneByFragment, and the pass criteria enforce the finding-#2 rule. The eval pack therefore certifies the defect — 5/5 is reachable while every output is invalid. | Rebuild the eval pack after fixes #1–#4. Add one adversarial task whose correct answer is "this rule doesn't apply here," so the pack can detect over-application rather than only under-application. |
| 12 | Duplication — network guidance | advanced-patterns.md §"Multi-site / network (G7)" and the standalone multi-site network file cover the same merge criteria, anchors-same-file-only, and domain-map guidance, with near-identical wording. | Merge into advanced-patterns.md; keep the network file only if it grows site-specific detail. Two files with one truth means one will rot. |
| 13 | Duplication — evaluation order | Field evaluation order (selector → concat → postProcess[] → split) appears in xpath-patterns.md §5 and post-processing.md §"Order of operations." They currently agree — which is precisely when to consolidate, before they drift. | Keep the canonical copy in post-processing.md; replace the other with a one-line cross-reference. |
| 14 | Duplication — verification checklists | Three overlapping, non-identical checklists: eval-pack.md "Verification checklist," schema-checklist.md "Final runtime check," scraping-failures.md "Verification Checklist." | Collapse to one canonical pre-emit checklist in schema-checklist.md. The others link to it. |
| 15 | Duplication — templates | best-practices.md ships a "Minimal Nubiles-style template" that overlaps examples.md §1; note its # @meta / # requires: header appears in no other template and in no upstream scraper I checked. | Remove the template from best-practices.md (a guidance file shouldn't carry a competing canonical shape), or verify and standardize the # @meta convention. |
| 16 | Over-broad regex | title-patterns.md CJK pass \\s[\u3000-\u303f].?\\s*$ matches from the first CJK punctuation mark to end-of-string. On a title like 作品名・第二章 this deletes half the real title. The file does say "Tune per site; do not apply blindly" — insufficient guardrail for a copy-paste block. | Anchor it to specific bracket pairs (【】, （）) rather than the whole \u3000-\u303f block, consistent with step 1 above it. |
| 17 | Unstated engine limits | performer-cleaning.md mandates a goja JavaScript block as "the only authorized implementation," but nothing states goja's constraints (ES5.1-era; no named capture groups; missing some built-ins). Silent failure mode: on error goja returns the original value, so you get wrong data, not an exception. | Add a goja constraints note. The shipped regexes look compatible, but the next author modifying that block has no warning. |
| 18 | Unverified assertions | Three claims I could not confirm: parseDate accepts Today/Yesterday case-insensitively; validator flag -s for sort checking; "attribute-level parseDate is deprecated." | Verify or mark. Per your own rule — never present unverified behavior as fact. |
| 19 | Scope leakage | Frontmatter claims galleryByURL support and the stub lists galleryByFragment/imageByURL/imageByFragment, but no reference file gives gallery or image guidance (Title for gallery is the only mention). Data model reminders also omit fields visible in real scrapers: Code, Director, Measurements, Duration, FrontImage. | Either add minimal gallery/image guidance or narrow the frontmatter. Add the missing field names to the data model section. |
| 20 | Missing provenance | No reference file records source URL, fetch date, or upstream commit. DeepWiki content is pinned to 9ad6f176; Stash docs are unversioned and live. | Add frontmatter (source_url, fetched_at, upstream_commit) per file, plus a quarterly refresh checkpoint. Findings #1, #3 and #6 would all have surfaced sooner with dated provenance. |

## Recommendation

Stop using the skill until #1 is fixed. It is not a quality issue — it is a total-output-failure issue, and it's trivially verifiable: paste any emitted file into the official validator.

Priority order: #1 → #2 → #3 → #4 (correctness; all four make outputs invalid or non-functional), then #5 → #6 → #7 → #8 (authority and consistency), then #11 (rebuild evals, since the current pack certifies the defects), then the consolidation items.

Challenging your framing. You asked me to look for duplication, vagueness and drift — and those exist (#12–#15). But they are not your problem. Your docs are unusually well-structured and internally cross-consistent. That consistency is exactly what let three fabricated rules propagate into four files each and reach mandatory status. The failure mode here isn't ambiguity; it's confident, well-organized wrongness, which no amount of merging or rewriting will catch. Consolidation without verification would have made this worse by canonizing the errors faster.

On coverage. Your nine sources are adequately reflected. But the highest-authority artifacts aren't in the list: validator/scraper.schema.json, validate.js, py_common/types.py, and the templates/ directory. Note also that the docs page you cited is a transclusion stub — the real spec lives in the stashapp/stash repo, which is why the fetchable page can drift from ground truth.

5. Concrete next steps

Fix name first and re-run one known-good scraper end-to-end to confirm it loads in Stash — that single test validates the fix and detects any other blocker in one pass. Then delete the nil-pointer rule from all four locations (grep sceneByFragment to find them). Then grep {title} and correct the four false assertions. Then add queryURL to fragment examples. Then delete the stub schema and rewrite the precedence line naming the official validator. Finally, add a CI job that (a) YAML-parses every fenced block in references/** and (b) runs the official validator against a golden output — this converts findings #1, #4 and #8 into permanently mechanically-caught failures.

Verification for each: official validator exit code, plus a live scrape returning non-empty Title/Date/Studio/Image.

6. Risks, blind spots, checkpoints

Weakest assumption in my analysis: that the official schema on master matches your target Stash version. If you're pinned to an older release, #1 still holds (name has been required for many versions) but #6 may resolve differently.

Your blind spot: the skill has extensive machinery for verifying selectors against live pages, and none for verifying its own rules against upstream. Every error I found is in the rules layer, which the workflow treats as ground truth. Add a rule-provenance requirement: every MUST/MUST NOT cites a source URL and a check date.

Bias worth naming: several defects look like post-incident overcorrection — someone hit a nil-pointer panic, inferred a cause, and hardened the guess into a mandatory rule across four files plus the eval pack, with no upstream confirmation. Watch for that pattern specifically; it's how #2 became load-bearing.

Exit criteria: official validator passes on all eval outputs; no rule contradicts an upstream source; each behavioral claim has a dated citation; two independent runs produce structurally identical YAML.

7. Questions

1. Which Stash version and branch (stable/develop) is the skill targeting? #6 and parts of #18 can't be resolved without it.
2. Do you want me to produce a corrected SKILL.md and schema-checklist.md now, given I have the current text?
3. Can you paste AGENT.md and /doc/*.md? Cross-layer precedence conflicts are still entirely unexamined — and given what surfaced in one layer, that's where I'd look next.

zh-TW 快速摘要

先講結論：這個 skill 目前產出的每一個檔案都無法通過驗證，也無法在 Stash 載入。建議先停用，修好第 1 項再說。

覆蓋度其實沒問題，九個來源大致都反映到了，文件結構也算清楚。真正的問題在正確性——有三條規則被寫得很有自信、跨四個檔案重複、還升級成強制規則，但對照 skill 自己指定的權威來源，它們是錯的。

最嚴重（會讓輸出全毀）

第一，禁止 root name 是錯的。官方 schema 明寫 "required": ["name"] 且 additionalProperties: false，Stash 手冊也說「name is mandatory」，我實際抓的 AVMoo.yml、Kink.yml 開頭都是 name:。更諷刺的是——skill 自己附的 stub schema 也要求 name，等於指示 agent 產出連自家 validator 都會拒絕的檔案。這是全面性失效，不是品質瑕疵。

第二，nil pointer 的因果關係被寫反了。skill 說「加 sceneByFragment 可以預防 nil pointer」。但 Stash issue #6921 顯示相反：crash 發生在 processSceneRelationships，觸發條件正是fragment 模式回傳零筆結果、而 scene 區塊又定義了 Performers/Tags/Studio 關聯。加上 sceneByFragment 是在製造觸發條件。這是 Stash 上游的 bug（v0.31.1），不是 scraper 寫法問題。這條假規則目前橫跨 SKILL.md、scraping-failures.md、Definition of Done、Anti-patterns 四處。

第三，{title} 被誤判為非官方 placeholder。四個檔案都這樣宣稱，但 Stash 手冊明確列出 sceneByFragment 支援 {checksum}、{oshash}、{phash}、{filename}、{title}、{url}。底層建議（別把 fragment 的 queryURL 指向搜尋端點）是對的，但拿錯誤事實當理由不行。

第四，scraping-failures.md 的「解法」範例是不能動的。它示範的 sceneByFragment 沒有 queryURL，但官方規定 XPath/JSON 的 fragment 模式必須有 queryURL（script 除外）。照抄的人會得到一個靜默抓不到任何東西的 scraper。

其他實質風險：附帶的 stub schema 把 driver.cookies 結構寫成扁平，官方其實是巢狀（外層 Cookies 必填、內層需 Domain+Path+Name 加 Value/ValueRandom 二選一）；CDP path 寫 ws://localhost:9222 並稱官方的 http://localhost:9222/json/version 是「舊的」，與現行官方指南矛盾；map 未命中的行為在三個檔案有三種說法（silently fail / pass through / usually pass through）；script-actions.md 的 performerByFragment 區塊縮排錯誤，是不合法 YAML。

要提醒你的一個判斷：你要我找重複、模糊、drift——這些確實有（#12–#15）。但那不是你的問題所在。你的文件結構其實相當好、彼此高度一致。正是這份一致性，讓三條捏造的規則各自擴散到四個檔案並升格為強制規則。這裡的失效模式不是「模糊」，而是「有條理、有自信的錯誤」，靠合併重寫抓不出來。如果先做整併而不先做查證，只會讓錯誤更快被正典化。

還有一點值得注意：docs.stashapp.cc/in-app-manual/scraping/scraperdevelopment/ 其實只是個轉載殼，真正的規格在 stashapp/stash repo 裡——這也是為什麼可抓取的文件頁會和真實 ground truth 產生落差。而最高權威的幾份素材（scraper.schema.json、validate.js、py_common/types.py、templates/）根本不在你列的九個來源裡。

修復順序：#1 → #2 → #3 → #4（正確性）→ #5–#8（權威與一致性）→ #11（重建 eval pack，因為現行版本會把這些缺陷「認證為通過」）→ 其餘整併。修完 #1 後，先拿一個已知可用的 scraper 跑完整流程確認能載入，一次驗證就能揪出其他阻斷性問題。

要的話我可以直接依現有內容產出修正版的 SKILL.md 與 schema-checklist.md。另外建議把 AGENT.md 和 /doc/*.md 也貼上——跨層級的優先權衝突完全還沒檢查過，而以單一層級就出現這種狀況來看，那裡值得優先看。