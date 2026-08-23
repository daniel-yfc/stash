# stash-scraper-builder

> **StashApp scraper builder + Agent Skill + custom scraper collection.**

## What is this

A single repo that is simultaneously:

1. **Agent Skill**: `skills/stash-scraper-builder/` for AI to build scrapers.
2. **Scraper source**: `scrapers/` for Stash to import directly.
3. **Localized validator**: `validator/index-zh-TW.mjs` reports errors in Traditional Chinese.

## Quick start

### Use as a Skill

Add `skills/stash-scraper-builder/` to your Agent skills directory, or copy `SKILL.md` into your prompt.

### Use as a scraper source

In Stash → Settings → Metadata Providers → Scraping → Scraper Sources, add:

```
https://github.com/daniel-yfc/stash
```

### Local validation

```bash
# Validate all scrapers
deno run -R=scrapers -R=validator/scraper.schema.json validator/index-zh-TW.mjs -a -s scrapers/

# Validate a single scraper
deno run -R=scrapers -R=validator/scraper.schema.json validator/index-zh-TW.mjs scrapers/site-a/site-a.yml
```

## File structure

```
stash/
├── AGENTS.md                    # Agent rules
├── README.md                    # This file
├── README_zhTW.md               # Chinese version
├── LICENSE-MIT                  # Code license
├── LICENSE-CC-BY-SA-4.0         # Content license
├── .github/workflows/           # CI
│   ├── validate.yml             # Validate scrapers
│   ├── eval.yml                 # Run eval pack
│   └── site.yml                 # Build site
├── scripts/                     # Package-level automation
│   ├── eval-run.sh              # Run eval
│   └── build-site.sh            # Build site
├── skills/
│   └── stash-scraper-builder/   # Agent Skill
│       ├── SKILL.md             # Agent entry
│       └── references/          # Reference docs
├── scrapers/                    # Custom scrapers
├── validator/                   # Localized validator
│   ├── index-zh-TW.mjs          # zh-TW validator
│   └── scraper.schema.json      # Minimal offline schema
├── docs/                        # Documentation
│   └── ARCHITECTURE.md          # Architecture
├── tests/                       # Tests
├── Build/Scripts/               # Build scripts
└── site/                        # Auto-built site output
```

## Real-page testing (required before PR)

Schema validation proves structure only — NOT that a selector returns data. Every scraper must be tested against real pages from the target site before a PR is opened.

### Rules

- Test ** every function/mode the scraper implements** (`sceneByURL`, `performerByURL`, `sceneByName`, `sceneByFragment`, etc.).
- For each function, test at least **3 real pages** (e.g. 3 different videos, 3 different performers).
- For each test page, record the **URL** and the **expected value of every relevant field** (Title, Date, Performers, Studio, Tags, Image, …).
- Include edge cases in your 3+ pages where possible: missing date, multiple performers, CJK + Latin mixed names, bracketed title tags.
- A selector that returns nothing on a real page is a fail-to-fetch defect — fix it before the PR, do not ship it.

### Test record format (paste into the PR description)

| Function | Test URL | Field | Expected | Actual | Pass |
| --- | --- | --- | --- | --- | --- |
| sceneByURL | https://site.test/works/ABP-123 | Title | `Example Title` |  | ☐ |
| sceneByURL | https://site.test/works/ABP-123 | Date | `2024-03-15` |  | ☐ |
| sceneByURL | https://site.test/works/ABP-123 | Performers | `水神雷也` |  | ☐ |
| sceneByURL | https://site.test/works/ABP-124 | Title | `Another Title` |  | ☐ |
| sceneByURL | https://site.test/works/ABP-125 | Date | *(empty — page has no date)* |  | ☐ |
| performerByURL | https://site.test/actor/alice | Name | `Alice` |  | ☐ |
| performerByURL | https://site.test/actor/alice | Birthdate | `1995-01-02` |  | ☐ |
| sceneByName | query: `ABP-123` | results[0].URL | `https://site.test/works/ABP-123` |  | ☐ |

Minimum: **3 pages × every field of every function**. PRs without this table will be asked to add it.

## Contributing

1. Write a request using `references/request-template.md` or `references/request-template-zh-TW.md`.
2. Generate a scraper using `skills/stash-scraper-builder/`.
3. Validate with `validator/index-zh-TW.mjs`.
4. Run the 5-task eval pack in `references/eval-pack.md`.
5. **Test against 3+ real pages per function** and fill the test record table above.
6. Open a PR with the test table in the description.

## License

- Code: MIT
- Content: CC BY-SA 4.0

## References

- Stash scraper development docs: https://docs.stashapp.cc/in-app-manual/scraping/scraperdevelopment
- CommunityScrapers: https://github.com/stashapp/CommunityScrapers
- netresearch/skill-repo-skill: https://github.com/netresearch/skill-repo-skill
