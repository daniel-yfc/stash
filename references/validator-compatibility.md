# Validator compatibility workstream

## Phase 1 scope

Phase 1 addresses the unresolved audit findings around validator authority, `queryURLReplace`, and eval-pack evidence.

## Task 1: Pin schema provenance

- Identify the exact upstream CommunityScrapers schema commit SHA.
- Record retrieval date and target Stash validator/runtime version.
- Compare the upstream schema with `validator/scraper.schema.json`.
- Classify every difference as missing, stricter, looser, renamed, or equivalent.

## Task 2: Test queryURLReplace

Validate fixtures for:

- `sceneByURL` with `queryURLReplace.url`.
- `sceneByFragment` with `filename`.
- `sceneByFragment` with `title`.
- `sceneByFragment` with `checksum`, `oshash`, and `phash`.
- Invalid arbitrary keys such as `id` and `slug`.
- Existing repository patterns using `title`.

Do not change existing scraper patterns until schema results and target runtime behavior agree.

## Task 3: Execute eval pack

- Run all five tasks in `skills/stash-scraper-builder/references/eval-pack.md` against the pinned official validator.
- Add negative controls for missing root `name`, malformed entry points, invalid replacement keys, incorrect studio map placement, and invalid performer mode/action combinations.
- Record expected versus actual results for issue #26.

## Task 4: Choose schema strategy

After evidence collection, either:

- Replace the local stub with the complete pinned upstream schema, or
- Add a controlled upstream synchronization and drift check.

## Task 5: Resolve validator-errors reference

Either add a maintained `validator-errors-zh-TW.md` reference or remove the dangling reference from `SKILL.md` and `tests/test_skill.py`.

## Task 6: Refresh audit

- Update the audit’s unresolved findings.
- Refresh the document inventory.
- Link evidence commits for completed actions.

## Exit criteria

- The schema revision is traceable.
- `queryURLReplace` behavior has validator-backed fixtures.
- All five eval-pack tasks have recorded expected and actual results.
- CI uses the same authoritative schema for scraper and documentation validation.
