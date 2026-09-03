1. Problem restatement

The supplied files remove most of the earlier repository-access limitation. This is an updated scrutiny of the actual documentation corpus for:

- Technical errors against Stash/CommunityScrapers.
- Internal contradictions and ambiguous rules.
- Duplication likely to cause agent drift.
- Documents that should be consolidated or rewritten.
- Risks ordered by materiality.

2. Context and authority

For normative behavior, use this precedence:

1. Current Stash runtime behavior.
2. Current CommunityScrapers schema and validator.
3. Official Stash scraper-development documentation.
4. Validated current CommunityScrapers examples.
5. DeepWiki architecture explanations.
6. Local skill documentation and local schema stub.

DeepWiki is useful, but it should not be labelled “canonical” where a current official schema or manual exists.

3. Consolidated review

[Material Gaps and Risk]

| # Serial | Domain | Observation | Recommendations |
|---:|---|---|---|
| 1 | Critical — root name | SKILL.md, schema-checklist.md, examples.md, json-patterns.md, json-examples.md, and script-actions.md prohibit root name. The supplied local stub simultaneously declares "required": ["name"]. The official documentation says “name is mandatory”, and the current CommunityScrapers schema also requires it. This is the most direct and pervasive contradiction. | Require name in every runnable scraper YAML. Replace “filename is the scraper name” with “filename and name should be deliberately maintained; name is schema-required.” Dependency-only files that are not scraper configurations should not be validated as scraper YAML. |
| 2 | Critical — all canonical templates are invalid | The mandatory XPath skeleton, complete XPath examples, JSON examples, best-practice template, and script-action skeleton all omit name. Agents will reproduce invalid YAML even if another document says the schema is authoritative. | Add name: to every complete-file example. Run the official validator against every fenced block labelled “complete,” “full,” “mandatory shape,” or “template.” |
| 3 | Critical — queryURLReplace model is wrong | schema-checklist.md, json-patterns.md, and json-examples.md say keys are custom captures such as id or slug. Official Stash behavior says the keys are the supported input fields/placeholders being transformed. For ByURL, only url is available; for scene fragments, keys include filename, title, url, checksum, oshash, and phash. A custom {id} placeholder is not the documented model. | Rewrite examples as queryURL: ".../{url}" with queryURLReplace.url, or queryURL: ".../{filename}" with queryURLReplace.filename. Remove all {id}/{slug} examples unless an actual runtime test and current schema explicitly prove custom placeholders are supported. |
| 4 | Critical — script skeleton contains malformed YAML | In script-actions.md, the performerByFragment.script list has incorrect indentation: - ../SomeDependency/script.py is nested under - python. Copying the “Full mode skeleton” will produce invalid YAML. | Correct the list indentation and validate the whole skeleton as a fixture. Do not keep non-executable skeletons in normative documentation. |
| 5 | Critical — Python example likely contains invalid pattern syntax | The Python entry example uses mapping patterns such as {"url": url, *}. In Python structural pattern matching, ` is a wildcard, not a valid capture target for a double-star mapping remainder. This can produce a syntax error. | Use {"url": url, *rest} or, more simply, avoid structural pattern matching and dispatch on op` with direct dictionary access. Compile the example in CI with the minimum supported Python version. |
| 6 | High — CDP endpoint contradicts official documentation | cdp-workflow.md and scraping-failures.md require ws://localhost:9222 and call http://localhost:9222/json/version obsolete. Official Stash documentation currently says Chrome CDP Path may be a Chrome executable or an HTTP(S) remote endpoint such as http://localhost:9222/json/version. The official behind-login guide uses that HTTP endpoint. | Use http://localhost:9222/json/version as the documented remote-debugging endpoint. If direct WebSocket URLs are supported in a particular Stash version, document that as version-specific rather than calling the HTTP endpoint obsolete. |
| 7 | High — unsupported waitTillPresent | cdp-workflow.md says click entries may contain waitTillPresent. Official click documentation describes only xpath and optional sleep; the reviewed strict schema does not establish waitTillPresent. | Remove waitTillPresent. Add it back only if a pinned current schema and Stash runtime test confirm support. |
| 8 | High — fabricated nil-pointer prevention rule | SKILL.md, AGENTS.md, and scraping-failures.md assert that omitting sceneByFragment alongside sceneByURL may cause a nil-pointer dereference, and that adding it prevents the crash. No authoritative source supplied supports this general causal rule. Stash’s URL and fragment entry points are separate capabilities; many valid URL-only scrapers exist. | Remove the nil-pointer claim and all resulting “runtime safety” mandates. Add sceneByFragment only when a genuine fragment workflow exists and can construct a real queryURL or invoke a working script. Treat actual nil-pointer errors as Stash bugs requiring logs and reproduction, not as a reason to invent an entry point. |
| 9 | High — invalid JSON/GJSON syntax is taught | json-patterns.md lists items[0], items[*].name, and ..title as GJSON forms. Bracket indexing, JSONPath-style wildcard notation, and JSONPath recursive descent should not be presented as equivalent to documented GJSON paths. The reliable GJSON forms are dot indexing such as items.0 and projections such as items.#.name. | Remove unverified JSONPath-like alternatives. Link directly to the GJSON syntax reference. Maintain tested input/output fixtures for every selector form documented. |
| 10 | High — scrapeJson architecture is overstated | json-patterns.md recommends scrapeJson for an HTML shell containing JSON-LD or NEXT_DATA. scrapeJson parses the fetched response as JSON; it does not generally extract an embedded JSON script from an HTML document. | Say: use scrapeJson only when queryURL returns a JSON response. For JSON embedded in HTML, use XPath where practical, rewrite to the underlying JSON endpoint, or use a script. |
| 11 | High — CDP escalation conflates separate causes | Login, paywall, human verification, JS rendering, 401, 403, 503, and generic HTTP failure are repeatedly routed toward visible CDP. CDP does not fix a removed page, wrong URL, IP ban, rate limit, server outage, or invalid credentials. Headless CDP is sufficient for many ordinary JS-rendered pages. | Use a decision tree: validate URL/status → inspect raw response → identify JSON endpoint → try headers/public cookies if appropriate → use ordinary CDP for rendering → use visible remote Chrome only for authorized interactive login/human steps. |
| 12 | High — public-cookie prohibition conflicts with upstream practice | The skill says public scrapers must never contain driver.cookies, while official documentation and current CommunityScrapers configurations use non-secret cookies for age gates and configurable placeholder cookies. This may be a project policy, but it is not a schema or Stash restriction. | Distinguish secret session cookies, which must not be committed, from non-secret age/consent/default cookies, which may be appropriate in public scrapers. If the repository intentionally bans all cookies, label it “local repository policy,” not a Stash rule. |
| 13 | High — script error contract is internally inconsistent | script-actions.md says all non-ByName operations must return {}, errors must not contaminate stdout, and missing results should be {}. Later it says return None/{}/[]. Printing Python None is not valid JSON, and json.dumps(None) emits null, contradicting the earlier contract. | Standardize: ByName success/miss/error returns a JSON array; other operations return a JSON object, normally {} on recoverable miss/error. Never print Python repr, None, diagnostics, tracebacks, or installation output to stdout. |
| 14 | High — local schema stub is unsafe as a validator | The stub is described as a minimal offline checker but uses additionalProperties: false, requires name, omits many valid root properties and definitions, and does not connect most nested definitions to root fields. It can reject valid files while failing to inspect most nested errors. The docs nevertheless permit using it in evaluation. | Do not use the stub for pass/fail. Either vendor the complete pinned upstream schema or replace the stub with a warning-only editor aid. eval-pack.md must not accept “local stub passes” as evidence of validity. |
| 15 | High — XPath union priority is misstated | xpath-patterns.md says to put the preferred XPath first in a union. XPath union results are returned in document order, not reliably in expression order. If multiple alternatives match, placing one first does not guarantee it supplies the selected scalar value. | Require fallback alternatives to be mutually exclusive where possible. Test pages where both old and new hooks coexist. Do not claim that textual order in A \| B defines priority. |
| 16 | High — selector cardinality is ambiguous | The documents say multiple matches return only the first value unless concat is set, but also tell Performers/Tags and search results to return multiple matched nodes. Scalar fields, nested object arrays, and search-result arrays do not share one simple cardinality rule. | Document cardinality by destination field: scalar attribute, list of scalar values, nested object list, and search-result list. Add fixtures with three performers and three search results to verify alignment. |
| 17 | Medium-high — mode scope contradicts surgical-change policy | SKILL.md and AGENTS.md say both “change only what the user asked” and “cover every mode the site verifiably supports.” eval-pack.md also mandates modes in some tasks. This encourages unsolicited expansion. | Implement requested modes only, plus strictly required companion entry points such as sceneByQueryFragment for a requested sceneByName. Present other possible modes as recommendations, not automatic output. |
| 18 | Medium-high — sceneByURL is treated as universally mandatory | The skill says sites with stable detail URLs require sceneByURL; eval tasks also make it mandatory. A user may request only a fragment, performer, gallery, group, or search scraper. | Make sceneByURL mandatory only for a requested URL-scraping capability. Do not expand scope merely because detail URLs exist. |
| 19 | Medium-high — validation and verification statuses are conflated | A selector marked # UNVERIFIED can still satisfy several eval criteria, while “Definition of done” requires three real tests or marks the selector unverified. A complete scraper can therefore be called done even when every selector is unverified. | Define statuses: DRAFT, SCHEMA_VALID, SELECTOR_TESTED, STASH_RUNTIME_TESTED, and VERIFIED. Only the last should satisfy “done.” An unverified draft may be delivered, but must not receive a pass score. |
| 20 | Medium-high — post-processing order guidance is too universal | post-processing.md says run map or parseDate before trim/whitespace cleanup. Exact-key map and parseDate commonly require trimming or normalization first. This conflicts with the otherwise correct warning that operation order is data-dependent. | Replace the universal order with: normalize only what is necessary → extract → exact map/date conversion → final formatting. Include separate examples for dates, exact maps, titles, and URLs. |
| 21 | Medium-high — subScraper execution semantics are oversimplified | One document says all postProcess[] operations run strictly in array order. Official documentation describes special compatibility ordering around subScraper and parseDate, and legacy inline forms still exist. The current text may be correct for a specific schema version but is stated too broadly. | Pin behavior to a tested Stash version. Avoid relying on ambiguous combinations of subScraper and parseDate; split transformations or test the exact pipeline end-to-end. |
| 22 | Medium — over-destructive canonical cleaning | title-patterns.md canonically removes trailing square, corner, and full-width parenthetical content. Those strings may be legitimate title text. performer-cleaning.md mandates a single lossy Hanzi/English/Kana policy for all matching names. | Default to source preservation. Put destructive transformations behind site-specific evidence with before/after fixtures. Rename “canonical/only authorized implementation” to “optional recipe.” |
| 23 | Medium — network threshold is invented | multi-site-network.md says network scrapers are for 20–100+ domains. No technical threshold requires that count; two or five truly identical sites may justify reuse, while 100 variant sites may not. | Base merging on structural identity and maintenance ownership, not domain count. Treat domain count as an example, not a criterion. |
| 24 | Medium — unsupported performance targets | advanced-patterns.md states XPath subScrapers should take 1–3 seconds and CDP subScrapers 5–10 seconds per field. These figures are not connected to measured benchmarks or an upstream requirement and may normalize very poor performance. | Replace with request-budget guidance: minimize secondary requests, record actual timing, and avoid multiplicative fetches. Establish local benchmark thresholds only after measurement. |
| 25 | Medium — HTTP retry/rate-limit advice is fragile | scraping-failures.md recommends CDP for 503 and delays for rate limiting without defining backoff, retry caps, or stop conditions. CDP may increase resource usage and does not inherently solve rate limiting. | Treat 429/503 as stop/backoff signals. Use bounded exponential backoff only in scripts, obey Retry-After, and avoid automatic retries in YAML where behavior cannot be controlled safely. |
| 26 | Medium — API/authentication policy is incomplete | Script guidance discusses caching extracted API keys, configuration files, cookies, and installing packages but lacks a normative secrets policy. The official API documentation distinguishes Stash’s ApiKey authentication from target-site APIs. | Add a dedicated security reference covering secret storage, redaction, expiry, file permissions, personal cookies, target API keys, Stash GraphQL ApiKey, and repository contribution rules. |
| 27 | Medium — external package installation risk | script-actions.md tells agents to recommend broad pip install commands and says ensure_requirements may auto-install packages. This has supply-chain, reproducibility, and permission risks. | Pin only actually required packages and supported versions; prefer repository-managed requirements; explain that auto-install requires explicit user consent. Never install speculative packages such as cloudscraper merely because they might help. |
| 28 | Medium — “every key field needs a fallback” overfits | xpath-patterns.md requires a fallback for Title, Date, Image, and Studio whenever an alternative hook exists. This can introduce broad selectors that silently select incorrect metadata. | Prefer one strong semantic selector. Add a fallback only when multiple verified page layouts exist, and test each layout plus a page where both hooks appear. |
| 29 | Medium — fixed gender inference remains risky | The performer guide permits fixed gender when a site is described as single-gender. A site’s marketing category does not guarantee every performer’s metadata value, and the statement can become stale. | Default to omission unless the source explicitly provides gender or the user has approved a documented site-level invariant. Add a review date to any fixed inference. |
| 30 | Medium — Details HTML guidance is confused | XPath examples select //text() and then apply an HTML-tag regex. Text-node extraction normally removes tags already. Conversely, regex is not a reliable general-purpose HTML parser when raw markup is actually present. | Use //text() plus concat for XPath. For scripts, parse HTML with an HTML parser. Reserve regex cleanup for tightly constrained, tested strings. |

[Operational Optimization]

| # Serial | Domain | Observation | Recommendations |
|---:|---|---|---|
| 31 | Duplication — Advanced vs Best Practices | YAML anchors, studio normalization, multi-site merging, and subScraper avoidance are repeated in advanced-patterns.md, best-practices.md, post-processing.md, and multi-site-network.md. | Keep advanced-patterns.md as an index. Move G2 anchors and G7 networks to multi-site-network.md; G3 studio normalization to one normalization document; G6 subScraper to post-processing.md. |
| 32 | Duplication — AGENTS vs SKILL | AGENTS.md duplicates scope, workflow, CDP policy, runtime-safety claims, troubleshooting, and quality rules. The two already differ on name: SKILL prohibits it; AGENTS merely omits it and says the filename is used by default. | Reduce AGENTS.md to a short router that loads SKILL.md. Keep all normative rules in one location. |
| 33 | Duplication — schema rules | Root keys, mode relationships, URL arrays, cookies, fields, post-processing, and validation rules appear repeatedly across the skill and references. | Make schema-checklist.md the only human-maintained schema summary. Other documents should link to headings rather than restate rules. |
| 34 | Contradiction — Last Updated location/format | best-practices.md requires # Last Updated YYYY-MM-DD at EOF, while the same file’s template and all complete examples put # Last Updated: YYYY-MM-DD at the top. | Choose one upstream-compatible format and location. Current CommunityScrapers commonly places a # Last Updated ... comment at EOF; use that consistently if contribution compatibility is the goal. |
| 35 | Examples mixed with normative policy | Example documents contain mandatory rules such as banning name and custom query replacements. Errors in examples therefore become policy errors. | Keep examples as validated fixtures. Put policy only in normative documents. |
| 36 | “Canonical” is used too broadly | DeepWiki pages and local JavaScript recipes are repeatedly called canonical even when official documentation or schema differs. | Reserve “normative” for pinned upstream schema/manual behavior. Use “reference,” “recipe,” or “local convention” elsewhere. |
| 37 | Eval pack is not deterministic | Tasks say “use any real site.” Real sites change, block automation, require credentials, and may expose inappropriate test data. A five-task score cannot be reproduced reliably. | Use local static HTML/JSON fixtures, a mock HTTP server, and a controlled CDP page for core tests. Keep optional live-site smoke tests separate. |
| 38 | Eval scoring is too coarse | Each complex task scores only 0 or 1. A schema-invalid file and a minor metadata mismatch both receive the same score, hiding root causes. | Score separately: schema, mode selection, selector correctness, post-processing, runtime transport, security, and output contract. Keep schema validity as a hard gate. |
| 39 | Testing rules appear in several places | One live URL per mode, three pages per mode, five scenario categories, 3–5 network domains, and the “fails on 2+ pages” rule are spread across files. | Create one verification-policy.md with draft and release test levels. Remove all independent numeric thresholds from other files. |
| 40 | Comments can misrepresent verification | # UNVERIFIED is attached at field level, but the required explanation may be outside the YAML. Comments do not record URL, response date, transport, or reason. | Store a separate test record containing URL, test date, transport, expected value, actual value, and access limitations. |
| 41 | Reference load boundaries are unclear | schema-checklist.md is mandatory, but authentication, safety, and upstream-version policy are absent from the mandatory set. Optional documents also contain normative rules. | Separate files into normative/, recipes/, examples/, and human/. Only recipe files should be conditionally loaded. |
| 42 | Terminology — URL vs URLs | The docs describe singular URL as invalid legacy output while official examples and current data models still use it in some contexts. Entry-point url is also easily confused with output fields URL/URLs. | Use explicit terminology: entryPoint.url, scene.URL, scene.URLs, performer.URL, etc. State migration preference separately from schema validity. |
| 43 | Map failure wording | advanced-patterns.md says map misses “fail silently,” while best-practices.md and post-processing.md correctly say unmatched values pass through unchanged. | Use one precise rule: unmatched map keys pass through unchanged; this may silently leave an unnormalized value. |
| 44 | Script prerequisites are overgeneralized | Every script response is required to mention Python, pip packages, and dependency files even when the script has no external pip dependencies. | Report prerequisites actually evidenced by the referenced script. Always mention Python and file paths when applicable; list pip dependencies only when imported/declared. |
| 45 | Script exception policy is too broad | “Wrap every external request in try/except” and always return empty can hide programming errors and make a broken scraper look like a legitimate no-result response. | Catch expected network/parse exceptions narrowly. Log actionable context. Distinguish “no result” from “operation failed,” while keeping stdout valid JSON. |
| 46 | Filename convention stated as universal | CamelCase filenames may match CommunityScrapers convention but are not a Stash runtime requirement. | Label it as a CommunityScrapers repository convention and validate against the repository’s current naming checks. |
| 47 | Image upgrade heuristic is too site-specific | trailer > poster > thumb is presented as a general image-quality order. Those substrings are not universal and “trailer” may refer to video rather than the best image. | Require validation of dimensions/content type or a verified site-specific URL transformation. |
| 48 | Japanese metadata policy is too categorical | “Do not use メーカー as studio when レーベル/シリーズ is the label” assumes a universal model. Some sites may treat maker as the appropriate studio, while series should often map to Group rather than Studio. | Define mappings per target site and user intent. Do not globally force manufacturer, label, and series into one Stash field. |

4. Document consolidation recommendation

Do not merge everything into one large file. That would reduce discoverability and increase context load. Instead, consolidate by authority.

Proposed structure

skills/stash-scraper-builder/
├── SKILL.md
├── AGENTS.md
├── normative/
│   ├── upstream-and-precedence.md
│   ├── output-contract.md
│   ├── schema-checklist.md
│   ├── mode-selection.md
│   ├── verification-policy.md
│   └── security-and-authentication.md
├── recipes/
│   ├── xpath.md
│   ├── json.md
│   ├── script.md
│   ├── cdp.md
│   ├── post-processing.md
│   ├── dates.md
│   ├── networks.md
│   └── optional-cleaning.md
├── fixtures/
│   ├── xpath-minimal.yml
│   ├── json-minimal.yml
│   ├── script-minimal.yml
│   └── cdp-minimal.yml
└── human/
    ├── request-template.md
    └── zh-TW/

Merge map

| Current documents | Action |
|---|---|
| advanced-patterns.md + multi-site-network.md | Move anchors/network material into one networks.md; move subScraper to post-processing. |
| best-practices.md | Reduce to a short maintainability checklist linking to normative rules and recipes. |
| examples.md + json-examples.md + templates inside SKILL | Replace with validated fixture files. |
| date-formats.md + date portions of troubleshooting | Keep date mechanics in one file; troubleshooting links to it. |
| performer-cleaning.md + title-patterns.md | Keep separate but relabel as optional, site-specific recipes. |
| scraping-failures.md + SKILL troubleshooting + AGENTS troubleshooting | Consolidate into one diagnostic decision tree. |
| schema-checklist.md + local schema stub | Replace the stub with a pinned complete upstream schema; keep checklist as concise human guidance. |
| AGENTS.md | Reduce to approximately 10–20 lines delegating to SKILL.md. |

5. Recommended corrections by priority

P0 — correct before the skill is used again

1. Require root name.
2. Fix all complete examples.
3. Replace custom {id}/{slug} queryURLReplace examples with documented url or fragment-field replacement.
4. Fix script YAML indentation.
5. Fix or simplify the Python structural-pattern example.
6. Correct the CDP endpoint.
7. Remove waitTillPresent.
8. Remove the sceneByFragment nil-pointer claim.
9. Remove unsupported GJSON syntax.

P1 — prevent drift and unsafe architecture

1. Replace the local stub with a pinned upstream schema.
2. Define one verification/status policy.
3. Separate static HTTP, JSON API, headless CDP, visible CDP, and script decisions.
4. Add secrets/authentication rules.
5. Clarify output-field cardinality and URL/URLs terminology.
6. Make requested scope override “cover every supported mode.”

P2 — reduce duplication

1. Thin AGENTS.md.
2. Convert examples to validated fixtures.
3. Merge overlapping advanced/network/studio/subScraper guidance.
4. Standardize Last Updated format.
5. Make DeepWiki explanatory rather than canonical.

6. Concrete validation plan

1. Schema gate
   - Vendor or download a pinned current CommunityScrapers schema.
   - Validate every fixture and complete YAML code block.
   - Confirm that removing name fails.

2. Documentation consistency gate
   - Search all Markdown for:
     - no root name
     - filename is the scraper name
     - {id} / {slug}
     - ws://localhost:9222
     - waitTillPresent
     - nil pointer
   - After correction, none should remain unless explicitly documenting an old/invalid example.

3. Code gate
   - Parse every YAML block.
   - Compile every Python block with the minimum supported Python version.
   - Validate documented GJSON selectors against fixed JSON fixtures.

4. Behavior gate
   - Static local HTML test.
   - JSON endpoint fixture.
   - Script stdin/stdout contract test.
   - CDP fixture with one delayed element and one click.
   - Confirm scalar, list, and search-result cardinality independently.

5. Drift gate
   - Record upstream schema commit and Stash version.
   - Re-run checks periodically or whenever upstream schema changes.

Exit criteria

The skill should not be labelled “done” merely for reaching 5/5 in the current eval pack. A stronger exit criterion is:

- All normative fixtures pass the pinned upstream validator.
- All YAML parses.
- All Python examples compile.
- All JSON selectors pass controlled fixtures.
- No known contradiction remains across SKILL.md, AGENTS.md, and normative references.
- At least one XPath, JSON, script, and CDP path passes an end-to-end Stash test.

7. zh-TW 快速摘要

高風險問題

1. root name 問題仍是最高風險。  
   多份文件禁止 name，但官方 schema、官方文件，甚至 repo 自己的 stub 都要求 name。目前所有完整範例基本上都需要修正。

2. queryURLReplace 的 {id} / {slug} 模型錯誤。  
   官方模式是修改 url、filename、title 等既有欄位，不是自行建立任意 placeholder。

3. Script 範例本身有錯。  
   performerByFragment YAML 縮排錯誤；Python 的 **_ pattern 也可能直接造成 syntax error。

4. CDP 文件與官方說明矛盾。  
   應使用官方文件中的 HTTP(S) endpoint，例如 http://localhost:9222/json/version；waitTillPresent 也沒有目前 schema 支援證據。

5. sceneByFragment 防止 nil pointer 的說法缺乏證據。  
   不應為了避免假設性的 crash 而強制新增沒有真實功能的 mode。

6. JSON 文件混入 JSONPath 語法。  
   items[0]、items[*].name、..title 不應被當成可靠 GJSON 寫法；另外，HTML 裡面的 JSON-LD/NEXT_DATA 不能直接假設由 scrapeJson 解析。

7. 文件重複嚴重。  
   AGENTS.md、SKILL.md、schema checklist、examples、best practices 重複維護同一批規則，已經產生實際矛盾。

明確建議

- 先做 P0 技術修正，不要先做文字美化。
- AGENTS.md 改成極薄的入口文件。
- 完整 YAML 範例改成 validator 實際驗證過的 fixtures。
- 移除不完整 local stub，或改用完整、固定 commit 的 upstream schema。
- 把 title/performer cleaning 從「強制 canonical」改為「有證據才使用的 site-specific recipe」。
- 將驗證狀態拆成 SCHEMA_VALID、SELECTOR_TESTED、STASH_E2E_TESTED；有 # UNVERIFIED 的輸出不能稱為完成。