# stash

Personal stash of utilities, scripts, and tools.

## For maintainers / scraper authors

This repo includes a **Stash scraper-builder skill** and reference docs to help generate and maintain XPath-based YAML scrapers.

- Skill & workflow:
  - [`skills/stash-scraper-builder/SKILL.md`](skills/stash-scraper-builder/SKILL.md)
- Reference docs:
  - [`skills/stash-scraper-builder/references/`](skills/stash-scraper-builder/references/)
    - `schema-checklist.md` – data model, fields, validator rules
    - `xpath-patterns.md` – selector patterns & debugging
    - `date-formats.md` – date normalization & `parseDate`
    - `post-processing.md` – operators & pipeline order
    - `scraping-failures.md` – runtime failures & diagnostics
    - `eval-pack.md` – Stash test procedure & quality bar
    - `best-practices.md` – maintainable scraper patterns
    - `multi-site-network-scrapers.md` – network scraper patterns
- Canonical runtime reference:
  - https://deepwiki.com/stashapp/CommunityScrapers/

When adding or updating scrapers, follow the skill workflow and reference docs, and use the DeepWiki pages as the authoritative guide for the Stash/CommunityScrapers runtime model.
