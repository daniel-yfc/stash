#!/bin/bash
set -e

echo "=== 建立網站 ==="

# 檢查腳本
if [ ! -f "scripts/build-site.sh" ]; then
  echo "錯誤：找不到 scripts/build-site.sh"
  exit 1
fi

# 執行
./scripts/build-site.sh

echo "=== 網站建立完成 ==="
