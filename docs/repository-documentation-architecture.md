# Repository Documentation Architecture

## Purpose

This document defines the boundary between repository-level documentation and the `stash-scraper-builder` skill. The goal is to keep both layers complete without copying conflicting rules into each other.

## Ownership model

| Layer | Owns | Must not own |
|---|---|---|
| Root `README.md` | Project purpose, quick start, canonical commands, directory map | Detailed scraper selector or runtime semantics |
| `AGENTS.md` | Repository-wide agent constraints, safety, handoff rules | Repeated domain-specific implementation guidance |
| `CLAUDE.md` | Claude-specific behavior that differs from repository-wide rules | A second copy of `AGENTS.md` or skill references |
| `CONTRIBUTING.md` | Human contribution and review workflow | Runtime implementation details |
| `Template/README.md` | Template inventory, pairing, provenance, naming, copy workflow | Full scraper authoring manual |
| `docs/` | Repository architecture, CI, testing, production gates, maintenance | Per-field scraper rules |
| `skills/stash-scraper-builder/SKILL.md` | Skill purpose, trigger conditions, output contract, authoring workflow | Repository administration and CI policy |
| `skills/.../references/` | Specialized XPath, JSON, script, CDP, date, failure, and validation guidance | Project-wide contribution policy |
| `validator/` | Executable validation behavior and schema | Prose-only source of truth |
| `tools/` | Inspection and lint utilities | Scraper runtime behavior unless explicitly implemented |
| `scripts/` | Repeatable workflows | Canonical schema definitions |

## Naming and format rules

- New Markdown files use lowercase kebab-case. Existing numbered files under `docs/` remain unchanged for compatibility.
- Scraper and template YAML files use CamelCase names with `.yml`.
- Python script files use CamelCase names with `.py` and match their paired YAML/dependency name where applicable.
- Root scraper YAML contains required `name:`; unsupported `documentHeader` and `$vars` are prohibited.
- Dates in metadata and `# Last Updated` markers use ISO `YYYY-MM-DD`.
- Use tables for inventories and ownership; use fenced code blocks for commands and YAML/Python examples.

## Canonical command policy

- `node validator/index.mjs scrapers` — validate all scrapers.
- `node validator/index.mjs -s scrapers` — check URL ordering.
- `python -m pytest tests/` — run Python tests.
- `bash scripts/scraper-quality-gate.sh` — run the quality gate.
- `bash scripts/eval-run.sh` — run the evaluation workflow.
- `python tools/check_scraper_docs.py` — run documentation checks.

If a command differs between local tooling and documentation, inspect the executable file first and update the documentation rather than inventing an alias.

## Cross-level linking rules

- Link to the owning document instead of restating detailed rules.
- Repository-level docs may summarize a skill rule, but should link to the skill reference for implementation details.
- Skill-level docs may link to repository commands and paths, but should not redefine repository governance.
- Every new documentation file must be listed in the appropriate index and, if operational, in `UPSTREAM_SOURCES.md`.
- Before a release, run link checking and search for stale command/path names.

## Review checklist

- [ ] Every referenced path exists.
- [ ] Commands match executable files.
- [ ] Naming and date formats are consistent.
- [ ] Public/private credential boundaries are clear.
- [ ] Official schema/validator precedence is explicit.
- [ ] Skill references do not contradict repository rules.
- [ ] New docs are indexed and cross-linked.
