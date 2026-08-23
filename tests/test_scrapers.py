import subprocess
import sys
from pathlib import Path

def test_scrapers_valid():
    """測試所有刮削器通過驗證"""
    result = subprocess.run(
        ["deno", "run", "-R=scrapers", "-R=validator/scraper.schema.json", "validator/index-zh-TW.mjs", "-a", "-s", "scrapers/"],
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"驗證失敗：{result.stderr}"

def test_scrapers_have_name():
    """測試所有刮削器都有 name"""
    for scraper in Path("scrapers/").rglob("*.yml"):
        content = scraper.read_text()
        assert "name:" in content, f"{scraper} 缺少 name"

def test_scrapers_have_action():
    """測試所有刮削器都有 action"""
    for scraper in Path("scrapers/").rglob("*.yml"):
        content = scraper.read_text()
        assert "action:" in content, f"{scraper} 缺少 action"
