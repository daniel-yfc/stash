# XPath Stability Patterns

**Load when:** writing or fixing `scrapeXPath` selectors.

> **概要（zh-TW）：** `common` 鍵必須 `$` 開頭且不可互相引用；錨點優先序為屬性 > 文本 > class > 位置。

## 1. `common` block

- Optional object; keys must match `^[$].+$` (start with `$`).
- Values are XPath **strings**.
- **No common-to-common references.** `$row: "$info//dl/dd"` is invalid. Repeat the prefix, or use `$info` only inside field selectors.

Compliant:

```yaml
xPathScrapers:
  myScraper:
    common:
      $info: "//div[@class='detail-area']"
      $actorLink: "//a[contains(@href,'/actor/')]"
    performer:
      Name: "$info/h1/text()"
      Height:
        selector: "$info//dt[contains(text(),'身長')]/following-sibling::dd[1]/text()"
```

Reject:

```yaml
# key missing $
common:
  infoRow: "//div[@class='info']"

# common-to-common reference
common:
  $a: "//div[@class='x']"
  $b: "$a/span"

# value is not a string
common:
  $info:
    selector: "//div[@class='info']"
```

Always quote XPath in YAML.

## 2. Anchor priority

1. Unique attributes: `//div[@id='actor-profile']`, `//span[@itemprop='birthDate']`
2. Label text (`contains()`, not exact `text()='…'`): `//dt[contains(text(),'身長')]/following-sibling::dd[1]`
3. Structural class (may churn on redesign)
4. Positional index last; if unavoidable, add a text guard and a comment

## 3. Selected-value forms

| Target | Form | Notes |
| --- | --- | --- |
| Text | `//h1/text()` | Most fields |
| Attribute | `//img/@src` | URL, href, src |
| Element HTML | `//div[@class='desc']` | Stash strips tags |
| Many nodes | `//a[contains(@href,'/tag/')]/text()` | Use with `concat` or `split` |

## 4. Anti-patterns

| Avoid | Prefer |
| --- | --- |
| `//div[3]/span[2]` | Attribute or label anchor |
| `//*/@href` | Narrow `//a[@class='…']/@href` |
| `/html/body/div[1]/…` | Nearest stable ancestor |
| `//span[text()='身高']` | `contains(text(),'身高')` |
| Selecting a node when you need text | Append `/text()` or `/@attr` |

## 5. Placeholders

`{inputURL}` and `{inputHostname}` work in `selector` / `fixed` (after `queryURLReplace`). They do **not** apply to `queryURL` (`{}`, `{title}`, `{filename}`).

```yaml
URLs:
  fixed: "{inputURL}"
Studio:
  Name:
    fixed: "{inputHostname}"
```

## 6. Patterns (quoted)

```yaml
xPathScrapers:
  performerScraper:
    common:
      $infoPiece: "//div[@class='infoPiece']/span"
    performer:
      Name: "//h1[@itemprop='name']"
      Height:
        selector: "$infoPiece[contains(text(),'Height')]/../span[@class='smallInfo']"
        postProcess:
          - replace:
              - regex: ".*?\\((\\d+) cm\\)"
                with: "$1"
```

```yaml
scene:
  Performers:
    Name: "$performer/@data-mxptext"
    URL: "$performer/@href"
  Tags:
    Name: "//div[@class='categoriesWrapper']//a[not(@class='add-btn-small ')]"
```

The space inside that `not()` argument is required by XPath 1.0 in the upstream example.

Verify every selector with DevTools `$x("//…")` on a live page before output.
