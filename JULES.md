# Jules Adapter

This file adapts the shared repository instructions to Jules execution. It does not replace or duplicate repository policy.

## Required read order

1. Read [`AGENTS.md`](AGENTS.md).
2. For scraper work, read [`skills/stash-scraper-builder/SKILL.md`](skills/stash-scraper-builder/SKILL.md).
3. Follow [`skills/stash-scraper-builder/references/skill-read-order.md`](skills/stash-scraper-builder/references/skill-read-order.md).
4. Read only the specialized references selected by that read order.
5. For repository workflow, testing, CI, and documentation work, follow the routing in `AGENTS.md`, `docs/README.md`, and `docs/index.yml`.

## Jules execution

- Treat each task as a bounded change request. Identify target files, required evidence, and validation scope before editing.
- Prefer one coherent, reviewable change set. Do not create unrelated follow-up changes or speculative improvements.
- Use the completion-report format required by `AGENTS.md`.
- If required validation, live access, site behavior, credentials, or browser state is unavailable, report the limitation and do not make claims that depend on unavailable evidence.
- `AGENTS.md`, the scraper skill, selected skill references, executable tools, and the official CommunityScrapers schema/validator remain authoritative.

## Non-duplication rule

Do not copy schema rules, canonical commands, scraper mode rules, documentation policy, or credential policy into this adapter. Refer to their authoritative shared source.
