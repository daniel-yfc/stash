# Documentation Index

This directory contains repository-level workflow, architecture, testing, and maintenance documentation.

## Ownership

- Repository workflow and project operations belong here and in the root `README.md`.
- Agent-wide constraints belong in `AGENTS.md` and `CLAUDE.md`.
- Scraper authoring rules belong in `skills/stash-scraper-builder/SKILL.md`.
- Specialized scraper behavior belongs in `skills/stash-scraper-builder/references/`.

## Core System & Architecture Guides

- [`01_System_Architecture.md`](01_System_Architecture.md) — repository architecture and data flow.
- [`02_Quality_Gate_Overview.md`](02_Quality_Gate_Overview.md) — quality gate overview and workstream standards.
- [`03_Quality_Gate_Rules.md`](03_Quality_Gate_Rules.md) — the 5 core quality gate technical rules.
- [`04_Production_Gate.md`](04_Production_Gate.md) — business readiness checklist and A-H workstream.
- [`05_CI_Workflows.md`](05_CI_Workflows.md) — CI/CD workflow pipeline details.
- [`06_Testing_Guide.md`](06_Testing_Guide.md) — local and CI testing guide.
- [`repository-documentation-architecture.md`](repository-documentation-architecture.md) — naming, format, ownership, and cross-level linking rules.

## Scaffolding & Tooling Documentation

- [`template-workflow.md`](template-workflow.md) — how `templates/` scaffolds relate to `scrapers/`, the skill, and validation.
- [`../templates/README.md`](../templates/README.md) — scraper scaffolds and template relationships.
- [`../scrapers/README.md`](../scrapers/README.md) — public vs private scrapers deployment and migration guide.
- [`../tools/SRB-2.0-documentation.md`](../tools/SRB-2.0-documentation.md) — Scraper Request Builder (SRB V2.0) interactive form tool manual.

## Rule of Thumb

Use `templates/` to start a file, `skills/stash-scraper-builder/` to decide how it should be authored, `validator/` and `tests/` to verify it, `tools/` to generate or inspect request specs, and `docs/` to understand repository workflow and maintenance.
