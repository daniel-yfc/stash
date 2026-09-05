"""Scraper checks driven by the repository quality gate."""

import subprocess
from pathlib import Path

GATE = "tools/scraper-quality-gate.sh"


def test_scrapers_pass_quality_gate():
    """所有刮削器通過品質閘門"""
    scrapers = sorted(Path("scrapers/").rglob("*.yml"))
    assert scrapers, "scrapers/ 中沒有刮削器"
    failures = []
    for scraper in scrapers:
        result = subprocess.run(
            ["bash", GATE, str(scraper)],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            output = (result.stdout + result.stderr).strip()
            failures.append(f"{scraper}: {output}")
    assert not failures, "品質閘門失敗：\n" + "\n\n".join(failures)


def test_scrapers_have_name():
    """所有刮削器都有 name"""
    for scraper in Path("scrapers/").rglob("*.yml"):
        assert "name:" in scraper.read_text(), f"{scraper} 缺少 name"


def test_scrapers_have_action():
    """所有刮削器都有 action"""
    for scraper in Path("scrapers/").rglob("*.yml"):
        assert "action:" in scraper.read_text(), f"{scraper} 缺少 action"
