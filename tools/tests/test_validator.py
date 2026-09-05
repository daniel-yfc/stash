"""Validator and repository layout checks."""

import subprocess
from pathlib import Path


def test_validator_exists():
    """測試 validator 檔案存在"""
    assert Path("validator/index.mjs").exists()
    assert Path("validator/index-zh-TW.mjs").exists()
    assert Path("validator/scraper.schema.json").exists()


def test_validator_execution():
    """依賴已安裝時，validator 可以執行"""
    if Path("node_modules/ajv").exists():
        result = subprocess.run(
            ["node", "validator/index.mjs", "-a", "--ci"],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, f"驗證失敗：{result.stderr}\n{result.stdout}"
    else:
        # node_modules 未安裝時（如 eval.yml），至少確認品質閘門存在
        assert Path("tools/scraper-quality-gate.sh").exists()


def test_scrapers_dir_exists():
    """測試 scrapers 目錄存在"""
    assert Path("scrapers/").is_dir()


def test_tools_dir_exists():
    """測試 tools 目錄存在"""
    assert Path("tools/").is_dir()
    assert Path("tools/scraper-quality-gate.sh").exists()
    assert Path("tools/validate-all.sh").exists()
    assert Path("tools/check_scraper_docs.py").exists()


def test_skills_dir_exists():
    """測試 skills 目錄存在"""
    assert Path("skills/stash-scraper-builder/").is_dir()
    assert Path("skills/stash-scraper-builder/SKILL.md").exists()
    assert Path("skills/stash-scraper-builder/references/").is_dir()


def test_docs_dir_exists():
    """測試 docs 目錄存在"""
    assert Path("docs/").is_dir()
    assert Path("docs/01_System_Architecture.md").exists()
