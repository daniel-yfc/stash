#!/bin/bash
set -e

echo "=== 清理 ==="

# 清理 site/
if [ -d "site/" ]; then
  rm -rf site/
  echo "  ✓ 清理 site/"
fi

# 清理暫存
if [ -d ".cache/" ]; then
  rm -rf .cache/
  echo "  ✓ 清理 .cache/"
fi

echo "=== 清理完成 ==="
