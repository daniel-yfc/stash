import subprocess
import sys
from pathlib import Path

def test_skill_md_exists():
    """測試 SKILL.md 存在"""
    assert Path("skills/stash-scraper-builder/SKILL.md").exists()

def test_skill_md_has_frontmatter():
    """測試 SKILL.md 有 frontmatter"""
    content = Path("skills/stash-scraper-builder/SKILL.md").read_text()
    assert content.startswith("---")
    assert "name:" in content
    assert "description:" in content

def test_references_exist():
    """測試參考文件存在"""
    refs = [
        "UPSTREAM_SOURCES.md",
        "advanced-patterns.md",
        "best-practices.md",
        "cdp-workflow.md",
        "date-formats.md",
        "eval-pack.md",
        "examples.md",
        "incident-reviews.md",
        "json-examples.md",
        "json-patterns.md",
        "multi-site-network-scrapers.md",
        "out-of-scope.md",
        "performer-cleaning.md",
        "phase0-secrets-policy.md",
        "post-processing.md",
        "schema-checklist.md",
        "scraping-failures.md",
        "script-actions.md",
        "skill-read-order.md",
        "source-selection.md",
        "template-workflow.md",
        "title-patterns.md",
        "xpath-patterns.md",
    ]
    for ref in refs:
        assert Path(f"skills/stash-scraper-builder/references/{ref}").exists(), f"缺少 {ref}"
