#!/bin/bash
set -e

echo "=== 驗證所有刮削器 ==="

# 檢查 Deno
if ! command -v deno &> /dev/null; then
  echo "錯誤：未安裝 Deno"
  exit 1
fi

# 檢查 validator
if [ ! -f "validator/index-zh-TW.mjs" ]; then
  echo "錯誤：找不到 validator/index-zh-TW.mjs"
  exit 1
fi

# 檢查 schema
if [ ! -f "validator/scraper.schema.json" ]; then
  echo "錯誤：找不到 validator/scraper.schema.json"
  exit 1
fi

# 驗證
deno run -R=scrapers,validator/scraper.schema.json validator/index-zh-TW.mjs -a -s scrapers/

echo "=== 驗證完成 ==="
