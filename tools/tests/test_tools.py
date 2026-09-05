"""Smoke tests for the consolidated tools/ directory."""

import subprocess
from pathlib import Path

TOOL_SCRIPTS = [
    "tools/scraper-quality-gate.sh",
    "tools/validate-all.sh",
    "tools/build-site.sh",
    "tools/clean.sh",
    "tools/install.sh",
    "tools/test.sh",
]

TOOL_FILES = TOOL_SCRIPTS + [
    "tools/check_scraper_docs.py",
    "tools/README.md",
]


def test_tool_files_exist():
    """所有工具檔案存在"""
    for path in TOOL_FILES:
        assert Path(path).is_file(), f"缺少 {path}"


def test_shell_scripts_syntax():
    """Shell 腳本通過 bash -n 語法檢查"""
    for script in TOOL_SCRIPTS:
        result = subprocess.run(["bash", "-n", script], capture_output=True, text=True)
        assert result.returncode == 0, f"{script} 語法錯誤：{result.stderr}"
