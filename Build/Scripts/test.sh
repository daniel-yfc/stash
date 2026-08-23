#!/bin/bash
set -e

echo "=== 執行測試 ==="

# 檢查測試
if [ ! -d "tests/" ]; then
  echo "錯誤：找不到 tests/"
  exit 1
fi

# 執行測試
python -m pytest tests/

echo "=== 測試完成 ==="
