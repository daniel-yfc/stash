# Visible-CDP Workflow

**Load when:** standard HTTP cannot retrieve the page (login, paywall, human check, or JS-only DOM).

> **概要（zh-TW）：** 預設不要開 CDP。需要登入時必須用「看得見的」Chrome，並把 Stash CDP Path 指到 9222。

Do not emit `driver:` / `useCDP` unless HTTP failed or the user already established that.

Headless CDP still fails on login gates. Use a **visible** debug Chrome, then let Stash attach.

1. YAML contains:

```yaml
driver:
  useCDP: true
```

2. Start Chrome with remote debugging:

```text
Windows:  chrome.exe --remote-debugging-port=9222
macOS:    /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --remote-debugging-port=9222
Linux:    google-chrome --remote-debugging-port=9222
```

3. Stash → **Settings → Metadata Providers → Scraping → Chrome CDP Path** = `http://localhost:9222/json/version`
4. In that visible Chrome, open the site and complete login / human check until the target content is visible.
5. Paste the item URL in Stash and scrape.

Without steps 2–4, a gated `useCDP: true` scraper can return nothing. Always emit these steps with the YAML.

If `driver.cookies` is also used, follow CookieURL coupling in `schema-checklist.md`.
