# Skill Read Order

Read repository-level guidance before skill-level guidance.

## Repository first

1. `README.md` — project purpose, canonical commands, and directory map
2. `AGENTS.md` — repository-wide agent and safety rules
3. `docs/repository-documentation-architecture.md` — ownership, naming, and cross-level linking
4. `Template/README.md` — when starting from a template
5. `CONTRIBUTING.md` — before committing or modifying shared repository files

## Skill second

6. `SKILL.md` — skill contract and authoring workflow
7. `references/out-of-scope.md` — confirm the task belongs to the skill
8. `references/source-selection.md` — select XPath, JSON, script, or CDP
9. `references/phase0-secrets-policy.md` — when authentication or private paths are involved

## Specialized references

| Task | Read |
|---|---|
| New XPath scraper | `xpath-patterns.md` → `schema-checklist.md` → `post-processing.md` |
| New JSON scraper | `json-patterns.md` → `schema-checklist.md` → `post-processing.md` |
| Script scraper | `script-actions.md` → `template-workflow.md` → `schema-checklist.md` |
| CDP/login scraper | `cdp-workflow.md` → `phase0-secrets-policy.md` → `schema-checklist.md` |
| Dates/post-processing | `date-formats.md` → `post-processing.md` |
| Advanced patterns | `advanced-patterns.md` |
| Regression/evaluation | `eval-pack.md` → repository `tests/` and `scripts/`

## Before editing

- Check `UPSTREAM_SOURCES.md` for the owning source.
- Confirm every referenced path exists.
- Use the canonical repository commands from `docs/repository-documentation-architecture.md`.
- Keep repository governance in repository-level docs and scraper semantics in skill-level docs.
