# Script Actions

**Load when:** `action: script` (including dependency packages).

> **概要（zh-TW）：** `*ByName` 回傳陣列、其餘回傳物件。`# requires:` 在 `name:` 之前。每次輸出都要寫安裝前置。

## YAML shape

```yaml
# requires: DependencyName
name: SiteName
sceneByURL:
  - action: script
    url:
      - sitename.com/en/video/
    script:
      - python
      - ../DependencyName/DependencyName.py
      - sitename
      - scene-by-url
```

- `# requires:` before `name:`.
- Relative path `../DependencyName/script.py`.
- Typical extras: site id, then operation (`scene-by-url`). Keep that order on every action, including `groupByURL`.

Dependency-only package:

```yaml
# script used as a dependency only
# requires: py_common
name: AlgoliaAPI
```

No `*ByURL` / `*ByFragment` / `*ByName` on a pure package. `name` is still required.

## I/O contract

| Type | stdin | stdout |
| --- | --- | --- |
| `*ByName` | `{"name": "<query>"}` | `[{...}]` even for one hit |
| All others | object (`url` or fragment) | `{...}` not an array |

Empty: `[]` (ByName) or `{}`. Errors on **stderr**. `print(json.dumps(result))` on stdout.

`performerByFragment` is script-only (not XPath/JSON).

## Install prerequisites (every script-action response)

State all three:

- Python on `PATH` (Stash runs `python ...`).
- pip packages, e.g. `python -m pip install stashapp-tools requests beautifulsoup4 lxml` plus site clients (`algoliasearch`, `cloudscraper`, …).
- Every `../Dependency/...` path exists under `scrapers/` (`py_common/` at scrapers root; no `../` for `py_common` imports).

`ensure_requirements("requests", "beautifulsoup4")` may auto-install; still tell the user.

## Directory

```
scrapers/
├── py_common/
├── AlgoliaAPI/
│   ├── AlgoliaAPI.yml
│   └── AlgoliaAPI.py
└── ASGMax/
    └── ASGMax.yml          # script: ../AlgoliaAPI/AlgoliaAPI.py
```

## Full mode skeleton

Use only modes the site supports. `sceneByName` always pairs with `sceneByQueryFragment`. Prefer `group-by-url` for `groupByURL` (legacy scripts may still listen for `movie-by-url`).

```yaml
# requires: SomeDependency
name: FullExample
sceneByURL:
  - action: script
    url:
      - example.com/scene/
    script:
      - python
      - ../SomeDependency/script.py
      - example
      - scene-by-url
groupByURL:
  - action: script
    url:
      - example.com/movie/
    script:
      - python
      - ../SomeDependency/script.py
      - example
      - group-by-url
sceneByFragment:
  action: script
  script:
    - python
    - ../SomeDependency/script.py
    - example
    - scene-by-fragment
sceneByName:
  action: script
  script:
    - python
    - ../SomeDependency/script.py
    - example
    - scene-by-name
sceneByQueryFragment:
  action: script
  script:
    - python
    - ../SomeDependency/script.py
    - example
    - scene-by-query-fragment
performerByFragment:
  action: script
  script:
    - python
    - ../SomeDependency/script.py
    - example
    - performer-by-fragment
```

## Python entry (when writing a script)

```python
import json, sys
from py_common import log
from py_common.util import scraper_args
from py_common.deps import ensure_requirements
ensure_requirements("requests", "beautifulsoup4")

if __name__ == "__main__":
    op, args = scraper_args()
    match op, args:
        case "scene-by-url", {"url": url, **_}:
            result = scene_from_url(url)
        case "scene-by-name", {"name": name, **_}:
            result = scene_search(name)
        case "group-by-url", {"url": url, **_}:
            result = group_from_url(url)
        case _:
            log.error(f"Unknown operation: {op}")
            sys.exit(1)
    print(json.dumps(result))
```

ByName search returns `[]` on miss, never `None`. Log failures to stderr; return `None`/`{}`/`[]` rather than printing errors on stdout.

Config files: `Path(__file__).parent / "config.ini"`; create a default on first run if needed.
