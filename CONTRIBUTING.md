# Contributing

## Source hierarchy

Use this order when authoring or changing scraper guidance:

1. Official CommunityScrapers schema and validator.
2. Official Stash scraper-development documentation.
3. Upstream Stash issues or source for runtime behavior.
4. Project references and examples.
5. Heuristics, clearly labeled as `Heuristic`.

If project guidance conflicts with an authoritative source, stop and correct the project guidance before adding new examples.

## Documentation changes

- Every normative schema rule must include a nearby source citation or point to the relevant entry in `references/UPSTREAM_SOURCES.md`.
- Label experience-based advice as `Heuristic`; do not present it as schema behavior or runtime causality.
- Search all files under `skills/stash-scraper-builder/` for duplicated wording before editing a rule.
- Keep complete YAML examples copy-paste-valid and include root `name:`.
- Run `python tools/check_scraper_docs.py` after changing documentation examples or rules.
- Run `npm run validate` and `npm run validate-sort` after scraper changes.
- Run `pytest` before opening a pull request.

## Runtime claims

Do not claim a configuration prevents a runtime crash without a reproducible test or authoritative upstream evidence. For upstream bugs, cite the issue and document the triggering condition and mitigation separately.

## Pull requests

Describe the authoritative source for behavior changes, list validation commands run, and note any remaining unverified live-page selectors.
