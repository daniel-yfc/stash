#!/bin/bash
set -e

echo "=== 執行評估包 ==="

# 1. 驗證所有刮削器
echo "1. 驗證刮削器..."
deno run -R=scrapers,validator/scraper.schema.json validator/index-zh-TW.mjs -a -s scrapers/

# 2. 檢查 eval-pack.md 的 5 任務
echo "2. 檢查評估任務..."

# Task 1: XPath scene
if [ -f "scrapers/example-xpath.yml" ]; then
  echo "  ✓ Task 1: XPath scene"
  if grep -q "sceneByURL" "scrapers/example-xpath.yml" && grep -q "sceneByFragment" "scrapers/example-xpath.yml"; then
    echo "    ✓ 包含 sceneByURL 和 sceneByFragment"
  else
    echo "    ✗ 缺少 sceneByURL 或 sceneByFragment"
    exit 1
  fi
else
  echo "  ✗ Task 1: XPath scene (missing)"
  exit 1
fi

# Task 2: JSON scene
if [ -f "scrapers/example-json.yml" ]; then
  echo "  ✓ Task 2: JSON scene"
  if grep -q "scrapeJson" "scrapers/example-json.yml"; then
    echo "    ✓ 包含 scrapeJson"
  else
    echo "    ✗ 缺少 scrapeJson"
    exit 1
  fi
else
  echo "  ✗ Task 2: JSON scene (missing)"
  exit 1
fi

# Task 3: Script
if [ -f "scrapers/example-script.yml" ]; then
  echo "  ✓ Task 3: Script"
  if grep -q "script" "scrapers/example-script.yml" && grep -q "requires" "scrapers/example-script.yml"; then
    echo "    ✓ 包含 script 和 requires"
  else
    echo "    ✗ 缺少 script 或 requires"
    exit 1
  fi
else
  echo "  ✗ Task 3: Script (missing)"
  exit 1
fi

# Task 4: Date fix
if [ -f "scrapers/example-date.yml" ]; then
  echo "  ✓ Task 4: Date fix"
  if grep -q "parseDate" "scrapers/example-date.yml"; then
    echo "    ✓ 包含 parseDate"
  else
    echo "    ✗ 缺少 parseDate"
    exit 1
  fi
else
  echo "  ✗ Task 4: Date fix (missing)"
  exit 1
fi

# Task 5: CDP
if [ -f "scrapers/example-cdp.yml" ]; then
  echo "  ✓ Task 5: CDP"
  if grep -q "useCDP" "scrapers/example-cdp.yml"; then
    echo "    ✓ 包含 useCDP"
  else
    echo "    ✗ 缺少 useCDP"
    exit 1
  fi
else
  echo "  ✗ Task 5: CDP (missing)"
  exit 1
fi

echo "=== 評估完成：5/5 通過 ==="
