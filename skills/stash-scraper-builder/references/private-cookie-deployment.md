# Private Cookie Deployment for Stash Scrapers

**Last Updated:** 2026-09-15

**Scope:** Authenticated/private scrapers that use `driver.cookies` (e.g. `scrapers/private/GV-Wiki.yml`).

This reference documents the authoritative Stash cookie schema, placeholder deployment, and Netscape cookie-file conversion. It also defines the rendered/unrendered evidence requirements for live verification.

## Authoritative Sources

The authoritative validation source is the official CommunityScrapers validator and schema:

- `validator/index.mjs`: https://github.com/stashapp/CommunityScrapers/blob/master/validator/index.mjs
- `validator/scraper.schema.json`: https://github.com/stashapp/CommunityScrapers/blob/master/validator/scraper.schema.json

Repository-local copies (e.g. `validator/` in this repo) may lag upstream. When in doubt, defer to the canonical `stashapp/CommunityScrapers` files.

## Cookie Shape and `CookieURL` / `useCDP` Rules

Cookie groups belong under `driver.cookies`. Each group is an object with:

- `CookieURL` (string, URI) — required when `useCDP` is `false` or omitted.
- `Cookies` (array) — each entry must have:
  - `Name` (string)
  - `Value` (string) or `ValueRandom` (integer)
  - `Domain` (string)
  - `Path` (string, optional)

Driver mode rules (validator-enforced):

- `useCDP: true` → omit `CookieURL` on all cookie groups; the attached browser session already carries the cookies.
- `useCDP: false` or omitted → include `CookieURL` on every cookie group that has `Cookies`.

Template example for GV-Wiki (CDP mode):

```yaml
driver:
  useCDP: true
  cookies:
    - Cookies:
        - Name: "csrftoken"
          Value: "<GVWIKI_CSRFTOKEN>"
          Domain: ".gvwiki.com"
          Path: "/"
        - Name: "gnn_sbbcda"
          Value: "<GVWIKI_GNN_SBBCDA>"
          Domain: ".gvwiki.com"
          Path: "/"
```

## Placeholder Deployment Workflow

Placeholder tokens in this repository use angle brackets, such as `<GVWIKI_GNN_SBBCDA>`. Stash does not expand shell or environment variables inside YAML. Before deployment, render the template locally with values supplied by a secrets manager, password vault, or environment variables.

Example local shell workflow:

```bash
export GVWIKI_CSRFTOKEN="..."
export GVWIKI_GCAYCNNIIK3="..."
export GVWIKI_GDAYDID="..."
export GVWIKI_GNN_SBBCDA="..."

python - <<'PY'
import os
from pathlib import Path
src = Path('scrapers/private/GV-Wiki.yml')
out = Path.home() / '.stash/scrapers/private/GV-Wiki.yml'
text = src.read_text()
for key in ['GVWIKI_CSRFTOKEN', 'GVWIKI_GCAYCNNIIK3', 'GVWIKI_GDAYDID', 'GVWIKI_GNN_SBBCDA']:
    text = text.replace('<' + key + '>', os.environ[key])
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(text)
print(out)
PY
```

The rendered file contains live credentials. Keep it outside source control and rotate cookies after testing or if exposure is suspected.

## Netscape Cookie-File Conversion

Repository review found Netscape cookie-file support in `tools/SPB-2.0.html` and a mention in `tools/SRB-2.0-documentation.md`, but no concrete Netscape-to-Stash `driver.cookies` conversion example. This section fills that gap.

A standard Netscape cookie line has seven tab-separated columns:

```text
domain  includeSubdomains  path  secure  expires  name  value
```

Mapping rule:

| Netscape column | Stash field | Action |
|---|---|---|
| `domain` | `Domain` | strip `#HttpOnly_`, preserve the leading dot if present |
| `path` | `Path` | preserve |
| `name` | `Name` | preserve |
| `value` | `Value` | substitute during local rendering only |
| `includeSubdomains`, `secure`, `expires` | not represented | do not place in YAML |

A value may itself contain spaces, but the seven columns remain tab-separated. Keep any `#HttpOnly_` metadata outside YAML; Stash cookie entries do not accept `HttpOnly`, `Secure`, or expiry fields.

Example from a masked GV-Wiki export:

```text
#HttpOnly_.gvwiki.com	FALSE	/	TRUE	0	gnn_sbbcda	<GVWIKI_GNN_SBBCDA>
.gvwiki.com	FALSE	/	FALSE	1820600514	csrftoken	<GVWIKI_CSRFTOKEN>
```

Converted private template:

```yaml
driver:
  useCDP: true
  cookies:
    - Cookies:
        - Name: "gnn_sbbcda"
          Value: "<GVWIKI_GNN_SBBCDA>"
          Domain: ".gvwiki.com"
          Path: "/"
        - Name: "csrftoken"
          Value: "<GVWIKI_CSRFTOKEN>"
          Domain: ".gvwiki.com"
          Path: "/"
```

## Rendered and Unrendered Evidence

For every authenticated private scraper, document which evidence was actually reviewed:

- `unrendered response`: raw HTTP HTML before JavaScript.
- `rendered DOM`: browser or CDP DOM after JavaScript.
- `rendered snapshot`: saved post-JS HTML fixture, including date and URL.
- `cookies provided`: cookie names, domains, expiry metadata, and whether values were omitted.

A selector is verified only against matching evidence. Do not mark a scraper live-verified from a saved rendered snapshot unless the corresponding fixture and review date are recorded.

## Validation and Live Gate

1. Validate structure with the official validator and schema.
2. Render cookie placeholders outside source control.
3. Test one search URL and one detail URL under the live Stash installation.
4. Update `docs/LIVE_TEST_STATUS.md` with evidence type, date, and result.
5. Rotate session cookies after a failed exposed-token scan or suspected leak.
