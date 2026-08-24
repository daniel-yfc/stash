# Best practices for maintainable scrapers

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/10.3-best-practices

## Structure & reuse

- Use YAML anchors (`&` / `*`) for shared scene/group selectors.
- Use `fixed:` studio for single-studio sites.
- Add a `# Last Updated` comment at the top of the file.

## Studio & image handling

- Use `map` or a small dictionary to normalize studio names.
- Prefer high-quality images: `trailer` > `poster` > `thumb`.
- Avoid hardcoded expected values inside XPath.

## Anti-patterns

- Overly deep or fragile XPath.
- Assuming every field exists on every page.
- Using `subScraper` by default instead of simpler selectors.
- Not testing with recent, old, and edge-case scenes.
