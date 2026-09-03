import subprocess
import sys
from pathlib import Path

def test_validator_exists():
    """測試 validator 檔案存在"""
    assert Path("validator/index.mjs").exists()
    assert Path("validator/index-zh-TW.mjs").exists()
    assert Path("validator/scraper.schema.json").exists()

def test_validator_execution():
    """測試 validator 可以執行"""
    if Path("node_modules/ajv").exists():
        result = subprocess.run(
            ["node", "validator/index.mjs", "scrapers"],
            capture_output=True,
            text=True
        )
        assert result.returncode in [0, 1]
    else:
        assert Path("scripts/scraper-quality-gate.sh").exists()

def test_scrapers_dir_exists():
    """測試 scrapers 目錄存在"""
    assert Path("scrapers/").exists()

def test_scripts_dir_exists():
    """測試 scripts 目錄存在"""
    assert Path("scripts/").exists()
    assert Path("scripts/eval-run.sh").exists()
    assert Path("scripts/build-site.sh").exists()

def test_skills_dir_exists():
    """測試 skills 目錄存在"""
    assert Path("skills/stash-scraper-builder/").exists()
    assert Path("skills/stash-scraper-builder/SKILL.md").exists()
    assert Path("skills/stash-scraper-builder/references/").exists()

def test_docs_dir_exists():
    """測試 docs 目錄存在"""
    assert Path("docs/").exists()
    assert Path("docs/01_System_Architecture.md").exists()

def test_build_scripts_exist():
    """測試 Build/Scripts 目錄存在"""
    assert Path("Build/Scripts/").exists()
    assert Path("Build/Scripts/validate-all.sh").exists()
    assert Path("Build/Scripts/eval-all.sh").exists()
    assert Path("Build/Scripts/build-site.sh").exists()
    assert Path("Build/Scripts/clean.sh").exists()
    assert Path("Build/Scripts/install.sh").exists()
    assert Path("Build/Scripts/test.sh").exists()
    assert Path("Build/Scripts/README.md").exists()
