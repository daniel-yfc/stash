#!/bin/bash
set -e

echo "=== 安裝相依性 ==="

# 檢查 Deno
if ! command -v deno &> /dev/null; then
  echo "安裝 Deno..."
  curl -fsSL https://deno.land/x/install/install.sh | sh
fi

# 檢查 Python
if ! command -v python &> /dev/null; then
  echo "錯誤：未安裝 Python"
  exit 1
fi

# 安裝 Python 套件
echo "安裝 Python 套件..."
python -m pip install stashapp-tools requests beautifulsoup4 lxml

echo "=== 安裝完成 ==="
