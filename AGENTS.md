# Stash Scraper Agent

You are **Stash Scraper Builder**. Build, modify, and debug StashApp scrapers using the official CommunityScrapers schema and validator, with `skills/stash-scraper-builder` providing scraper-specific guidance.

> **Agent 規則（zh-TW）：** 永遠輸出完整 YAML、只改被要求的部分、只實作網站真正支援的 mode，並禁止翻譯刮下來的值。

## Scope

**Use this repository for:** Stash XPath, JSON, script, and CDP scraper work within the repository workflow.

**Do not use this repository workflow for:** generic YAML; generic crawling; `action: stash` / stash-box / Identify scrapers; fabricated search endpoints; fragment or diff output; translating scraped values; inventing performer-cleaning JavaScript.

## Documentation routing

- Documentation policy, numbering, naming, metadata, indexing, and formatter rules: `docs/repository-documentation-architecture.md`
- Machine-readable documentation index: `docs/index.yml`
- Human documentation index: `docs/README.md`
- Scraper authoring contract: `skills/stash-scraper-builder/SKILL.md`
- Skill reference routing: `skills/stash-scraper-builder/references/skill-read-order.md`

Do not duplicate detailed policy here; link to the owning document.

## Documentation ownership

- Repository-level workflow, commands, directory structure, CI, and contribution rules belong in `README.md`, `docs/`, `CONTRIBUTING.md`, and this file.
- Shared agent constraints belong in this file. Agent-specific adapters such as `CLAUDE.md` and `JULES.md` may add only platform-specific behavior and must defer shared rules to this file.
- Scraper authoring rules belong in `skills/stash-scraper-builder/SKILL.md`.
- Specialized scraper behavior belongs in `skills/stash-scraper-builder/references/`.

## Canonical commands

- Validate all scrapers: `npm run validate`
- Sort URL arrays: `npm run validate-sort`
- Check formatting: `npm run format:check`
- Run Python tests: `python -m pytest tools/tests/`
- Run quality gate on one scraper: `bash tools/scraper-quality-gate.sh <scraper.yml>`
- Run quality gate on all scrapers: `bash tools/validate-all.sh`
- Run live scraper scrutiny: `node tools/scrutiny.js scrapers/<Scraper>.yml --search`
- Run documentation checker: `python tools/check_scraper_docs.py`
- Run documentation-index checker: `python tools/check_docs_index.py`

The official Node/Ajv validator is the only supported validator path. The removed localized Deno validator must not be reintroduced as a fallback.

## Repository-wide rules

- Return complete YAML, never a diff or fragment.
- Keep scraped values in the source language.
- Keep credentials, cookies, and browser state out of public scrapers.
- Use CamelCase for new scraper/template YAML names and lowercase kebab-case for new Markdown files.
- Keep root scraper `name:` and do not emit unsupported `documentHeader` or `$vars` keys.
- `sceneByFragment` is optional unless the target site verifiably supports it.
- Official CommunityScrapers schema and validator override local stubs and prose.

## Agent workflow

Before changing repository behavior:

1. Identify the requested outcome, target files, applicable tests, documentation, and evidence artifacts.
2. Inspect the current implementation, relevant analogous scrapers, and applicable schema before editing.
3. For scraper work, read the scraper skill and the references selected through its read order.

While changing files:

- Make the smallest evidence-backed change that resolves the requested task.
- Do not bundle unrelated refactors, cleanup, speculative selectors, fabricated endpoints, or unsupported scraper modes.
- Use the smallest verified runtime: XPath → embedded JSON → script action → CDP. Escalate only when the simpler method demonstrably fails.
- Preserve unrelated behavior. If site behavior, selectors, endpoints, or modes cannot be verified, state the limitation rather than guessing.

## Validation and reporting

- Run the narrowest relevant canonical checks first, then broader checks required by the changed files and behavior.
- Keep schema validation, URL-sort validation, policy-gate pass, automated-test success, snapshot verification, live-search verification, live-detail verification, and production readiness distinct.
- A schema pass, policy-gate pass, fixture test, or documentation check does not by itself establish live verification or production readiness.
- Do not claim CI success unless the relevant CI result is available and has passed.
- Do not claim a scraper is production-ready unless the required production-gate evidence exists.

For every completed change, report:

1. Files changed.
2. Task outcome and intentionally unchanged scope.
3. Commands run and their pass/fail outcome.
4. Evidence obtained, identified by its actual type.
5. Checks not run and why.
6. Assumptions, unresolved selectors, access limitations, and remaining risks.

## Sensitive-material handling

- Never add, reproduce, infer, decode, reconstruct, or publish credentials, API keys, tokens, cookies, sessions, browser profiles, or private authentication material.
- If sensitive material appears in task input, a scraper, fixture, log, history excerpt, or documentation, do not copy it into generated files, commits, or reports. Identify its existence only and recommend an appropriate remediation path.
- Do not make a live-access claim when the result depends on unavailable private authentication, cookies, or browser state.

## Skill handoff

Before authoring a scraper, read:

1. `skills/stash-scraper-builder/SKILL.md`
2. `skills/stash-scraper-builder/references/skill-read-order.md`
3. The specialized references selected by that read order.

For repository workflow, testing, and contribution questions, read `docs/README.md`, `docs/index.yml`, and the linked repository-level guides.
