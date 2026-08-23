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
        "xpath-patterns.md",
        "json-patterns.md",
        "json-examples.md",
        "date-formats.md",
        "title-patterns.md",
        "performer-cleaning.md",
        "schema-checklist.md",
        "scraper.schema.json",
        "script-actions.md",
        "cdp-workflow.md",
        "advanced-patterns.md",
        "examples.md",
        "eval-pack.md",
        "request-template.md",
        "request-template-zh-TW.md",
        "validator-errors-zh-TW.md",
        "validator-index-messages-zh-TW.md",
    ]
    for ref in refs:
        assert Path(f"skills/stash-scraper-builder/references/{ref}").exists(), f"缺少 {ref}"
