# Template — Scraper Scaffolding Templates

> **概要（zh-TW）：** 本目錄收錄六種 Stash 物件的刮削器範本（Scene、WordPress Scene、Performer、Group、Gallery、Image），複製自 stashapp/CommunityScrapers 範本集，用於快速起稿。複製範本、改檔名、填入 `name` 與選擇器後，務必先跑驗證器與品質閘門再提交。

Scaffolding templates copied from the [stashapp/CommunityScrapers](https://github.com/stashapp/CommunityScrapers) template set to speed up scraper build-up. Filenames were normalized (attachment numbering suffixes removed); file content is preserved as-is from upstream.

## Files

| File | Object | Entry point |
| --- | --- | --- |
| `SceneScraperTemplate.yml` | Scene | `sceneByURL` |
| `WordpressSceneScraper.yml` | Scene (WordPress `og:` meta) | `sceneByURL` |
| `PerformerScraperTemplate.yml` | Performer | `performerByURL` |
| `GroupScraperTemplate.yml` | Group | `groupByURL` |
| `GalleryScraperTemplate.yml` | Gallery | `galleryByURL` |
| `ImageScraperTemplate.yml` | Image | `imageByURL` |

## How to use

1. Copy the matching template into `scrapers/` and rename it to the site's CamelCase name (for example `ExampleSite.yml`).
2. Root `name:` is **required** by the official schema — keep it and make it match the filename.
3. Replace the `example.com` placeholder in the `url:` array with the site's real detail-page domain(s).
4. Fill in selectors under the object block; keep the Go `parseDate` layouts.
5. Replace the `# Last Updated February XX, 2025` placeholder with `# Last Updated: YYYY-MM-DD` (repo convention, ISO-8601).
6. Validate before committing — run the repository validator (`validator/index-zh-TW.mjs`, see `scripts/eval-run.sh`) and the quality gate (`scripts/scraper-quality-gate.sh`).

These templates are scaffolds, not working scrapers: they contain no real selectors and will not extract data until you fill them in.

## Provenance

- **Source:** stashapp/CommunityScrapers — upstream template set
- **Retrieved:** 2026-08-30
- **Local changes:** filenames normalized only; no content edits
- **Workflow:** see `skills/stash-scraper-builder/SKILL.md`; pre-emit checklist: `skills/stash-scraper-builder/references/schema-checklist.md`
