# XPath patterns

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/8.2-selector-syntax
- https://deepwiki.com/stashapp/CommunityScrapers/4.3-advanced-xpath-techniques
- https://deepwiki.com/stashapp/CommunityScrapers/4-xpath-scrapers

This file is a local pattern cheat-sheet. For the full selector syntax and advanced techniques, see the links above.

## Common patterns

- `//` for deep search
- `@attr` for attributes
- `$common` for shared selectors
- `|` for fallbacks
- `concat`, `postProcess`, `split`

## Selector evaluation order

See: https://deepwiki.com/stashapp/CommunityScrapers/3.3-post-processing-pipeline

1. Selector execution
2. `concat` (before `postProcess`)
3. `postProcess[]` in array order
4. `split` (after `postProcess`)

Notes:

- Multiple matches return only the first value unless `concat` is set.
- Each `postProcess` item may have exactly one operator.
- Failed `parseDate` or unmatched `map`/`replace` does not error; it leaves the field empty or unchanged.

## Debugging selectors

- Use browser console `$x("//your-xpath")` to test selectors directly.
- Prefer element selectors over `/text()` when possible.
- Use `concat(' ', normalize-space(@class), ' ')` for class checks.

## Japanese shop patterns

- `dl/dt/dd` pattern for metadata: メーカー，レーベル，シリーズ，発売日，商品コード
- Image hrefs may be `upload/save_image/` or flattened `uploadsaveimage...jpg`
- Details often live in mixed text + `<br>` blocks, not a single `<p>`
