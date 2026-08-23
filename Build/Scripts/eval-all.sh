#!/bin/bash
set -e

echo "=== 執行評估 ==="

# 檢查腳本
if [ ! -f "scripts/eval-run.sh" ]; then
  echo "錯誤：找不到 scripts/eval-run.sh"
  exit 1
fi

# 執行
./scripts/eval-run.sh

echo "=== 評估完成 ==="
