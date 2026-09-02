# Source Selection

Choose the simplest viable implementation path before writing any scraper.

## Decision Table

| Situation | Approach | Why | Avoid when |
|---|---|---|---|
| Static HTML, stable fields | `scrapeXPath` | Lowest maintenance declarative path | Content is JavaScript-only or requires browser login |
| JSON endpoint or embedded JSON | `scrapeJson` | Data is already structured | Response only appears after browser automation |
| Complex logic, helper packages, multi-step | `script` | Needed when declarative rules are insufficient | A simpler declarative scraper is enough |
| Login wall, Cloudflare, browser-only flow | CDP-assisted | Required for visible-browser interaction | Direct HTTP scraping already works |
| Stash-box or Stash GraphQL | Out of scope | Not implemented by this skill | Any task that assumes Stash API integration |

## Rules

- Start with the least complex path that reliably extracts the target metadata.
- Prefer declarative YAML over scripts when XPath or JSON selectors are sufficient.
- Use CDP only when direct requests are blocked by login, JavaScript rendering, or anti-bot interstitials.
- Do not route Stash GraphQL or stash-box work into this skill unless scope is intentionally expanded later.
