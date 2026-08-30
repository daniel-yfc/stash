# Stash Scraper Builder

> **概要（zh-TW）：** 本倉庫提供 StashApp 刮削器建立 Agent Skill、品質閘門腳本、驗證器、文件與自製刮削器集合。支援 YAML (XPath/JSON) 與 Python script 刮削器，並提供互動式需求表單工具 (SPB-2.0.html)。

A repository for building, validating, and deploying StashApp scrapers. Includes an Agent Skill (`skills/stash-scraper-builder`), a scraper quality gate (`scripts/scraper-quality-gate.sh`), a Deno-based validator (`validator/`), comprehensive documentation (`docs/`, `skills/stash-scraper-builder/references/`), scaffolding templates (`Template/`), an interactive scraper request form (`SPB-2.0.html`), and a collection of working scrapers (`scrapers/`).

## Directory Structure

```
.
├── .github/                   # GitHub Actions workflows & config
│   ├── actions/
│   │   └── skill-link-check/  # Custom action for validating skill references
│   ├── workflows/
│   │   ├── eval.yml           # Evaluation workflow
│   │   ├── link-check.yml    # Markdown link checker
│   │   ├── quality-gate.yml  # Scraper quality gate CI
│   │   ├── test-eval.yml     # Test evaluation workflow
│   │   └── validate.yml      # YAML schema validation
│   └── markdown-link-check.json
├── Build/Scripts/             # Build helper scripts (zh-TW docs)
│   ├── README.md
│   ├── build-site.sh
│   ├── clean.sh
│   ├── eval-all.sh
│   ├── install.sh
│   ├── test.sh
│   └── validate-all.sh
├── docs/                      # Quality gate documentation (bilingual)
│   ├── 01_System_Architecture.md
│   ├── 02_Quality_Gate_Overview.md  # 中文總覽
│   ├── 03_Quality_Gate_Rules.md
│   ├── 04_Production_Gate.md
│   ├── 05_CI_Workflows.md
│   ├── 06_Testing_Guide.md
│   └── scraper-request-template.html
├── review-notes/              # AI model review notes (6 models, 2026-08-29/30)
│   ├── Claude-Opus-5.md
│   ├── Claude-Sonnet-5.md
│   ├── GPT-5.6-Terra.md
│   ├── Gpt-5.6-Sol.md
│   ├── Kimi-K3.md
│   └── deepseek-v4-pro-review.md
├── scrapers/                  # Working scraper YAML files
│   ├── README.md
│   ├── ACCEED.yml
│   ├── Bravo-Japan.yml
│   ├── CK-Download.yml
│   ├── Coat.yml
│   ├── GV-Wiki.yml
│   ├── Games-Video.yml
│   ├── Hunks-Ch.yml
│   ├── JGVData.yml
│   ├── Justice01.yml
│   ├── KO-Shop.yml
│   ├── KO-Tube.yml
│   ├── Ko-Video.yml
│   └── Mens-RushTV.yml
├── scripts/                   # Quality gate scripts (canonical)
│   ├── build-site.sh          # Generates landing page (1,951 B)
│   ├── eval-run.sh            # Runs evaluation pack
│   └── scraper-quality-gate.sh
├── skills/                    # Agent Skill definitions
│   └── stash-scraper-builder/
│       ├── SKILL.md           # Skill definition + load table
│       └── references/        # 17 reference docs (bilingual 概要 lines)
│           ├── advanced-patterns.md
│           ├── best-practices.md
│           ├── cdp-workflow.md
│           ├── date-formats.md
│           ├── eval-pack.md
│           ├── examples.md
│           ├── json-examples.md
│           ├── json-patterns.md
│           ├── multi-site-network-scrapers.md
│           ├── performer-cleaning.md
│           ├── post-processing.md
│           ├── schema-checklist.md
│           ├── scraper.schema.json
│           ├── scraping-failures.md
│           ├── script-actions.md
│           ├── title-patterns.md
│           └── xpath-patterns.md
├── Template/                  # Scaffolding templates (from CommunityScrapers)
│   ├── README.md              # Provenance + usage guide
│   ├── SceneScraperTemplate.yml
│   ├── WordpressSceneScraper.yml
│   ├── PerformerScraperTemplate.yml
│   ├── GroupScraperTemplate.yml
│   ├── GalleryScraperTemplate.yml
│   └── ImageScraperTemplate.yml
├── tests/                     # Pytest test suite
│   ├── __init__.py
│   ├── test_build.py
│   ├── test_scrapers.py
│   ├── test_skill.py
│   └── test_validator.py
├── validator/                 # Deno-based YAML validator
│   ├── index-zh-TW.mjs        # Chinese-localized validator
│   └── scraper.schema.json    # Local schema stub (3.4 KB)
├── AGENTS.md                  # Agent rules (bilingual)
├── LICENSE-CC-BY-SA-4.0
├── LICENSE-MIT
├── README.md                  # This file
├── SPB-2.0.html               # Scraper Request Builder tool (interactive form)
└── SRB-2.0-documentation.md   # SPB tool manual (zh-TW primary)
```

## Quick Start

### Prerequisites

- **Deno** (for validator): `curl -fsSL https://deno.land/install.sh | sh`
- **Node.js** (for scripts): `brew install node` or from nodejs.org
- **Python 3** (for tests): `brew install python` or from python.org

### Test a single scraper

```bash
# Validate YAML against schema
deno run -R=scrapers,validator/scraper.schema.json validator/index-zh-TW.mjs -s scrapers/ACCEED.yml

# Run quality gate (technical + business checks)
bash scripts/scraper-quality-gate.sh scrapers/ACCEED.yml
```

### Run all tests

```bash
# Validate all scrapers
deno run -R=scrapers,validator/scraper.schema.json validator/index-zh-TW.mjs -a -s scrapers/

# Run pytest suite
pytest tests/
```

### Build a new scraper

1. Copy a template: `cp Template/SceneScraperTemplate.yml scrapers/ExampleSite.yml`
2. Rename and set root `name:` (required, match filename)
3. Replace `example.com` with real domain(s)
4. Fill selectors, keep `parseDate` Go layouts
5. Replace `# Last Updated February XX, 2025` with `# Last Updated: YYYY-MM-DD`
6. Validate and run quality gate (see above)

## What's Inside

| Folder | Purpose |
|---|---|
| `skills/stash-scraper-builder/` | Agent Skill for generating scraper YAML (load SKILL.md + references on demand) |
| `scripts/` + `Build/Scripts/` | Quality gate scripts, eval runners, build helpers |
| `validator/` | Deno-based YAML schema validator (Chinese-localized) |
| `docs/` | Quality gate documentation (6 files, bilingual) |
| `Template/` | Scaffolding templates from stashapp/CommunityScrapers |
| `scrapers/` | Working scraper examples (public, no credentials) |
| `tests/` | Pytest suite for validation, skill, and scrapers |
| `review-notes/` | AI model review notes (6 models, 2026-08-29/30) |
| `SPB-2.0.html` | Interactive Scraper Request Builder form (exports Markdown/JSON) |
| `SRB-2.0-documentation.md` | SPB tool manual (zh-TW primary) |

## CI/CD Workflows

Five GitHub Actions workflows run on push/PR:

| Workflow | Triggers | Purpose |
|---|---|---|
| `validate.yml` | `scrapers/*.yml`, `validator/**`, `skills/.../scraper.schema.json` | YAML schema validation |
| `quality-gate.yml` | `scrapers/**/*.yml`, `scripts/scraper-quality-gate.sh`, `validator/**` | Quality gate CI (technical + business checks) |
| `eval.yml` | `scrapers/*.yml` | Evaluation workflow |
| `test-eval.yml` | `tests/` | Test evaluation workflow |
| `link-check.yml` | `skills/stash-scraper-builder/**/*.md`, `README.md` | Markdown link checker |

See `docs/05_CI_Workflows.md` for details.

## Documentation

### Core docs

- **[docs/01_System_Architecture.md](docs/01_System_Architecture.md)** — System design and architecture
- **[docs/02_Quality_Gate_Overview.md](docs/02_Quality_Gate_Overview.md)** — Quality gate overview (中文)
- **[docs/03_Quality_Gate_Rules.md](docs/03_Quality_Gate_Rules.md)** — 5 rules details
- **[docs/04_Production_Gate.md](docs/04_Production_Gate.md)** — Business checklist
- **[docs/05_CI_Workflows.md](docs/05_CI_Workflows.md)** — CI/CD workflows
- **[docs/06_Testing_Guide.md](docs/06_Testing_Guide.md)** — How to test

### Skill references

- **[skills/stash-scraper-builder/SKILL.md](skills/stash-scraper-builder/SKILL.md)** — Skill definition, load table, always-on rules
- **[skills/stash-scraper-builder/references/](skills/stash-scraper-builder/references/)** — 17 reference docs (schema checklist, XPath/JSON patterns, CDP workflow, date formats, post-processing, scraping failures, eval pack, etc.)
- **[Template/README.md](Template/README.md)** — Scaffolding templates provenance and usage

### Agent rules

- **[AGENTS.md](AGENTS.md)** — Agent rules for building/modifying scrapers (bilingual)

### Tool

- **[SPB-2.0.html](SPB-2.0.html)** — Scraper Request Builder (interactive form, exports Markdown/JSON)
- **[SRB-2.0-documentation.md](SRB-2.0-documentation.md)** — SPB tool manual (zh-TW primary)

## Contributing

### Adding a scraper

1. Create YAML in `scrapers/` (or copy from `Template/`)
2. Validate: `deno run -R=scrapers,validator/scraper.schema.json validator/index-zh-TW.mjs -s scrapers/YOUR_SCRAPER.yml`
3. Run quality gate: `bash scripts/scraper-quality-gate.sh scrapers/YOUR_SCRAPER.yml`
4. Commit with `# Last Updated: YYYY-MM-DD` footer
5. Push — CI will run `validate.yml` and `quality-gate.yml`

### Running tests locally

```bash
# All scrapers validation
deno run -R=scrapers,validator/scraper.schema.json validator/index-zh-TW.mjs -a -s scrapers/

# Pytest suite
pytest tests/ -v
```

### Review notes

The `review-notes/` folder contains critical reviews from 6 AI models (Claude Opus 5, Claude Sonnet 5, GPT-5.6 Terra, GPT-5.6 Sol, Kimi K3, DeepSeek V4 Pro) conducted on 2026-08-29/30. These identify material gaps, contradictions, and optimization opportunities — see individual files for detailed findings and fix priorities.

## Bilingual Policy

> **概要（zh-TW）：** 本倉庫文件以英文為主，每份文件開頭或關鍵章節附有 zh-TW 概要/總覽/重點摘錄。若英文與 zh-TW 內容衝突，以英文為準。

Documentation is primarily in English, with zh-TW overview/summary lines at the top of reference files or key sections. When English and zh-TW content conflict, English is normative.

## License

Dual-licensed:

- **CC BY-SA 4.0** — see [LICENSE-CC-BY-SA-4.0](LICENSE-CC-BY-SA-4.0)
- **MIT** — see [LICENSE-MIT](LICENSE-MIT)

Template files (`Template/`) are derived from the [stashapp/CommunityScrapers](https://github.com/stashapp/CommunityScrapers) template set; respect upstream licensing when re-exporting.

## Acknowledgments

- [StashApp documentation](https://docs.stashapp.cc/) — official scraper development guide
- [stashapp/CommunityScrapers](https://github.com/stashapp/CommunityScrapers) — upstream scraper repository and schema/validator
- [DeepWiki CommunityScrapers](https://deepwiki.com/stashapp/CommunityScrapers/) — explanatory context for schema and patterns
