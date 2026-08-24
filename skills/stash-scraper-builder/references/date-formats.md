# Date formats

Canonical reference:

- https://deepwiki.com/stashapp/CommunityScrapers/3.3-post-processing-pipeline

For the official `parseDate` behavior and Go reference time, see the link above.

## Common formats

- `YYYY-MM-DD` (ISO)
- `YYYY/MM/DD`
- `YYYY.MM.DD`
- `MM/DD/YYYY`
- `DD.MM.YYYY`
- `Month DD, YYYY`

## Additional common formats

- Compact dates: `20240424`, `20170318` → must be normalized to `YYYY-MM-DD` before `parseDate`.
- Japanese long form: `2024 年 04 月 24 日` → normalize to `2024-04-24`.
- Other common forms: `2024.4.24`, `2024/4/24` → normalize to `2024-04-24`.

Rules:

- Always zero-pad month and day before using `parseDate: "2006-01-02"`.
- If `parseDate` returns nil, the input string is not in the expected format.
