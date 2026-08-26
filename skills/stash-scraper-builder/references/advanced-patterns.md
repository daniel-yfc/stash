# Advanced Patterns

**Load when:** subScraper, YAML anchors, multi-site networks, or studio-name normalization. Optional; not required for a valid scraper.

> **概要（zh-TW）：** 僅在情況出現時使用。每個 subScraper 都是一次額外請求。

## subScraper (G6)

Use when a field needs a second fetch (performer detail URL, full-size image page). Verify the sub-page selector on the real sub-page. Weigh rate-limit cost.

**Default rule:** Forbid `subScraper` by default. Allow only when the value exists **solely on another page** (not just hidden behind JS).

**Performance targets:**
- XPath subScrapers: 1–3 seconds per field.
- CDP subScrapers: 5–10 seconds per field.
- Rate-limit risk → batch in `script` instead.

## YAML anchors (G2)

Use only for a block referenced **three or more times** (shared Performers/Studio across scene + gallery + image). Two uses: duplicate for readability.

**Important:** Anchors (`&` / `*`) work **only within a single YAML file**. Cross-file sharing must use a Python dependency package or copy the block.

## Multi-site / network (G7)

Same operator, identical templates:
- XPath/JSON: one YAML, multiple entries in `url:`
- Script: per-site YAML sharing one dependency package (see `script-actions.md`)

Merge only when templates match; use domain map + per-domain overrides when DOM / image host diverges.

## Studio normalization (G3)

When the scraped studio is a domain or marketing variant:
- `map` for known variants (misses fail **silently** — cover every real variant)
- `replace` TLD-strip when domain ≈ brand
- `fixed` for a single-site brand

Verify after mapping.
