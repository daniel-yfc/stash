# Documentation Index

This directory contains repository-level workflow, architecture, testing, and maintenance documentation.

## Ownership

- Repository workflow and project
 operations belong here and in the root `README.md`.
- Agent-wide constraints belong in `AGENTS.md` and `CLAUDE.md`.
- Scraper authoring rules belong in `skills/stash-scraper-builder/SKILL.md`.
- Specialized scraper behavior belongs in `skills/stash-scraper-builder/references/`.

## Guides

- [`repository-documentation-architecture.md`](repository-documentation-architecture.md) — naming, format, ownership, and cross-level linking rules.
- [`template-workflow.md`](template-workflow.md) — how `templates/` scaffolds relate to `scrapers/`, the skill, and validation.
- [`01_System_Architecture.md`](01_System_Architecture.md) — repository architecture.
- [`02_Quality_Gate_Overview.md`](02_Quality_Gate_Overview.md) — quality gate overview.
- [`03_Quality_Gate_Rules.md`](03_Quality_Gate_Rules.md) — quality rules.
- [`04_Production_Gate.md`](04_Production_Gate.md) — production readiness.
- [`05_CI_Workflows.md`](05_CI_Workflows.md) — CI workflow details.
- [`06_Testing_Guide.md`](06_Testing_Guide.md) — testing guidance.

## Rule of thumb

Use `templates/` to start a file, `skills/stash-scraper-builder/` to decide how it should be authored, `validator/` and `tests/` to verify it, and `docs/` to understand repository workflow and maintenance.
