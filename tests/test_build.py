import subprocess
import sys
from pathlib import Path

def test_build_scripts_executable():
    """測試建置腳本可執行"""
    scripts = [
        "Build/Scripts/validate-all.sh",
        "Build/Scripts/eval-all.sh",
        "Build/Scripts/build-site.sh",
        "Build/Scripts/clean.sh",
        "Build/Scripts/install.sh",
        "Build/Scripts/test.sh",
    ]
    for script in scripts:
        assert Path(script).exists(), f"缺少 {script}"
        assert Path(script).stat().st_mode & 0o111, f"{script} 不可執行"

def test_scripts_executable():
    """測試 scripts 目錄腳本可執行"""
    scripts = [
        "scripts/eval-run.sh",
        "scripts/build-site.sh",
    ]
    for script in scripts:
        assert Path(script).exists(), f"缺少 {script}"
        assert Path(script).stat().st_mode & 0o111, f"{script} 不可執行"
