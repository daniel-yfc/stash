# Documentation Audit — 2026-09-03

## Scope

This audit uses the local project copies as the same-version working tree for the GitHub repository. GitHub directory/file metadata and code-search snippets were used only for remote cross-checking.

## Corrections applied in this patch

- Root `name` is documented as required by the official schema; `documentHeader` and `$vars` remain prohibited.
- Fragment XPath/JSON entry points are documented with action-required `queryURL` guidance.
- `{title}` is scoped as an official `sceneByFragment` placeholder; it is not globally banned.
- The `sceneByFragment` nil-pointer wording is replaced with upstream-bug mitigation guidance.
- Official schema/validator precedence is made explicit over the local offline stub.
- CDP guidance no longer labels an endpoint deprecated without version-specific evidence.
- Script examples include the required root `name`; the malformed performer script indentation is corrected.

## Findings not fully resolved

- `queryURLReplace` key semantics still require confirmation against the exact official validator version used by the target Stash build.
- The complete official schema should replace or supersede the local offline stub when available.
- The eval pack has not been executed against five generated outputs in this environment.
- `validator-errors-zh-TW.md` is referenced by `SKILL.md` but is not present in the current local document inventory.
- Live CDP behavior and settings-menu path remain version-dependent and require a running Stash build.

## Next actions

1. Run the five eval-pack tasks against the official validator.
2. Record expected-versus-actual results in issue #26.
3. Resolve `queryURLReplace` semantics with validator-backed examples.
4. Either add `validator-errors-zh-TW.md` or remove the dangling reference.
5. Refresh the inventory after the audit commit.
