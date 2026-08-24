# Multi-site network scrapers

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/4.2-multi-site-network-scrapers

## When to use

Use a network scraper when:

- 20–100+ domains share the same HTML structure.
- Studio name can be derived from the domain or a small mapping.
- You want a single YAML file instead of many near-duplicates.

## Patterns

- URL routing via domain substrings.
- Studio name normalization from domain or small map.
- YAML anchors for shared scene/group blocks.
- Network-specific edge cases (different image hosts, slight template variants).

Refer to GammaEntertainment, Nubiles, Andomark-style configs as examples.
