# Schema checklist

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/3.1-data-model
- https://deepwiki.com/stashapp/CommunityScrapers/8-configuration-reference

This checklist is a local summary. For the authoritative data model and validation rules, see the links above.

## Entity types & required fields

See: https://deepwiki.com/stashapp/CommunityScrapers/3.1-data-model

- Scene: no required fields
- Performer: `Name` only
- Movie / Group: `Name` only
- Gallery: `Title` only
- Image: no required fields
- Studio: `Name` only
- Tag: `Name` only

## Important field distinctions

- Use `URLs` (array) for scenes/performers/studios, not legacy `URL`.
- Use `Groups` for scene groups; `Movies` is legacy.
- Performer-only fields include: `Disambiguation`, `Birthdate`, `Height`, `Weight`, `Gender`, `Circumcised`, etc.
- Keep performer-specific fields (`Country`, `Ethnicity`, `Gender`) under `Performers`, not at scene root.

## Validator business rules

See: https://deepwiki.com/stashapp/CommunityScrapers/8-configuration-reference

- `sceneByName` requires `sceneByQueryFragment`.
- All referenced scrapers (e.g. in `sceneByURL` → `scene` → `scraper`) must exist.
- URLs must be unique within an entity type.
- `stash` action requires `stashServer`.
- Cookie/CDP rules:
  - `CookieURL` is required when `useCDP: false`.
  - `CookieURL` is forbidden when `useCDP: true`.

## Scene field order (recommended)

- `Title`, `Code`, `Details`, `Director`, `URLs`, `Date`, `Image`, `Studio`, `Tags`, `Performers`, `Groups`

## Group field order (recommended)

- `Name`, `Aliases`, `Duration`, `Date`, `Director`, `URLs`, `Synopsis`, `Studio`, `Tags`, `FrontImage`, `BackImage`
