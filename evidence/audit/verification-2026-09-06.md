# Verification Notes — 2026-09-06 (live Stash build)

## Build under test

- Stash **v0.31.1** (build 2026-04-13), Linux, at `http://192.168.101.47:9999` — confirmed via GraphQL
  `version { version build_time }`.
- This is the same version cited by the nil-pointer audit finding (Stash issue #6921).

## Findings resolved

### 1. `waitTillPresent` — fabricated; removed from guidance

- GitHub code search `waitTillPresent repo:stashapp/stash` (authenticated): **0 hits**.
- Upstream `validator/scraper.schema.json` (CommunityScrapers master): click items are
  `additionalProperties: false` with only `xpath` (required) and `sleep` (number, default 2, min 1).
- Action: `cdp-workflow.md` now states `waitTillPresent` does not exist and must not be emitted.

### 2. `queryURLReplace` key semantics — placeholder names only

- Source of truth: `pkg/scraper/query_url.go` at tag `v0.31.1`:
  - The parameter map only ever contains `checksum`, `oshash`, `filename`, `phash`, `title`, `url`
    (scene/gallery/image builders; the URL builder sets only `url`).
  - `applyReplacements` looks up `r[k]` only for keys present in that map — custom capture keys
    (`id`, `slug`, …) are **silently ignored** at runtime.
  - `replaceURL` (ByURL path) uses only the `url` parameter.
- Upstream schema enums agree: `anyByURL.queryURLReplace.propertyNames.enum = ["url"]`;
  `anyByFragment` = `["checksum","filename","oshash","title","url"]` (phash supported by the runtime map).
- Action: `json-patterns.md` now states the verified rule and its example was corrected
  (`queryURL: "{}"` is a string containing the placeholder — the previous block showed an
  empty YAML map and an invalid `search:`/`replace:` queryURLReplace shape).

### 3. CDP settings menu path — official docs correct for v0.31.1

- UI source at `v0.31.1`: `ui/v2.5/src/components/Settings/SettingsScrapingPanel.tsx` renders the
  `scraperCDPPath` field (headingID `config.general.chrome_cdp_path`) and is mounted in
  `Settings.tsx` under `Tab.Pane eventKey="metadata-providers"`.
- Menu path: **Settings → Metadata Providers → Scraping** — NOT "Settings → System → Application
  Paths". Endpoint baseline: `http://localhost:9222/json/version`.
- Action: `cdp-workflow.md` step 3 now pins the verified path and version.

## Remaining open items (unchanged)

- Eval pack execution still requires pytest (unavailable on the Windows working machine).
- `UPSTREAM_SOURCES.md` tracked issues #21/#22/#24/#25/#26 remain open.
