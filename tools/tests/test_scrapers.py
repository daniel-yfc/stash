import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def test_scrapers_valid():
    result = subprocess.run(
        ["node", "validator/index.mjs", "-a", "-s", "scrapers"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stdout + result.stderr


def test_scrapers_have_name():
    for scraper in (ROOT / "scrapers").rglob("*.yml"):
        content = scraper.read_text()
        assert "name:" in content, f"{scraper} missing name"


def test_fragment_mapping_is_optional_but_valid_when_present():
    for scraper in (ROOT / "scrapers").rglob("*.yml"):
        data = scraper.read_text()
        if "sceneByFragment:" not in data:
            continue
        block = data.split("sceneByFragment:", 1)[1]
        assert 'queryURL: "{url}"' in block or "queryURL: '{url}'" in block
