#!/bin/bash
# Scraper Quality Gate - 完整品質檢核腳本
# 用法：bash scripts/scraper-quality-gate.sh <scraper.yml>

set -e

SCRAPER_FILE="$1"

if [ -z "$SCRAPER_FILE" ]; then
  echo "Usage: $0 <scraper.yml>"
  echo "Example: $0 scrapers/Coat.yml"
  exit 1
fi

if [ ! -f "$SCRAPER_FILE" ]; then
  echo "❌ ERROR: File not found: $SCRAPER_FILE"
  exit 1
fi

echo "======================================"
echo "   Scraper Quality Gate"
echo "======================================"
echo "File: $SCRAPER_FILE"
echo ""

# ======================================
# Phase 1: 5 條規則預檢
# ======================================
echo "Phase 1: 5 Rules Pre-check"
echo "--------------------------------------"

# Rule 1: name exists and matches filename
FILENAME=$(basename "$SCRAPER_FILE" .yml | tr '[:lower:]' '[:upper:]')
NAME_VALUE=$(grep "^name:" "$SCRAPER_FILE" | head -1 | cut -d: -f2 | tr -d ' ' | tr '[:lower:]' '[:upper:]')
if [ "$FILENAME" = "$NAME_VALUE" ]; then
  echo "✅ Rule 1: name matches filename ($NAME_VALUE)"
else
  echo "❌ Rule 1: name mismatch (filename: $FILENAME, name: $NAME_VALUE)"
  echo "   Fix: Change 'name:' to match filename or rename file"
  exit 1
fi

# Rule 2: useCDP placement (only in top-level driver)
USECDP_IN_ENTRY=0
if grep -A20 "^sceneByURL:" "$SCRAPER_FILE" | grep -q "useCDP:"; then
  echo "❌ Rule 2: useCDP inside sceneByURL (should be in top-level driver only)"
  USECDP_IN_ENTRY=1
fi
if grep -A20 "^sceneByName:" "$SCRAPER_FILE" | grep -q "useCDP:"; then
  echo "❌ Rule 2: useCDP inside sceneByName (should be in top-level driver only)"
  USECDP_IN_ENTRY=1
fi
if grep -A20 "^sceneByFragment:" "$SCRAPER_FILE" | grep -q "useCDP:"; then
  echo "❌ Rule 2: useCDP inside sceneByFragment (should be in top-level driver only)"
  USECDP_IN_ENTRY=1
fi
if grep -A20 "^performerByURL:" "$SCRAPER_FILE" | grep -q "useCDP:"; then
  echo "❌ Rule 2: useCDP inside performerByURL (should be in top-level driver only)"
  USECDP_IN_ENTRY=1
fi
if grep -A20 "^groupByURL:" "$SCRAPER_FILE" | grep -q "useCDP:"; then
  echo "❌ Rule 2: useCDP inside groupByURL (should be in top-level driver only)"
  USECDP_IN_ENTRY=1
fi

if [ $USECDP_IN_ENTRY -eq 0 ]; then
  echo "✅ Rule 2: useCDP placement correct (top-level driver only)"
else
  echo "   Fix: Move 'useCDP:' to top-level 'driver:' block"
  exit 1
fi

# Rule 3: no driver.cookies in public scraper
if grep -A10 "^driver:" "$SCRAPER_FILE" | grep -q "cookies:"; then
  echo "❌ Rule 3: driver.cookies found in public scraper"
  echo "   Fix: Remove cookies or move to scrapers/private/"
  exit 1
else
  echo "✅ Rule 3: no driver.cookies in public scraper"
fi

# Rule 4: sceneByFragment (warning only - not enforced)
if grep -q "^sceneByFragment:" "$SCRAPER_FILE"; then
  echo "✅ Rule 4: sceneByFragment present"
else
  echo "⚠️  Rule 4: sceneByFragment not present"
  echo "   Note: Add if site supports fragment-based scraping"
fi

# Rule 5: Last Updated header
if grep -q "^# Last Updated:" "$SCRAPER_FILE"; then
  LAST_UPDATED=$(grep "^# Last Updated:" "$SCRAPER_FILE" | cut -d: -f2 | tr -d ' ')
  echo "✅ Rule 5: # Last Updated header present ($LAST_UPDATED)"
else
  echo "❌ Rule 5: missing # Last Updated header"
  echo "   Fix: Add '# Last Updated: YYYY-MM-DD' at top of file"
  exit 1
fi

echo ""
echo "Phase 1: ✅ PASSED"
echo ""

# ======================================
# Phase 2: Schema validation
# ======================================
echo "Phase 2: Schema Validation"
echo "--------------------------------------"

# Check if validator exists
if [ ! -f "validator/index-zh-TW.mjs" ]; then
  echo "❌ ERROR: validator/index-zh-TW.mjs not found"
  echo "   Fix: Ensure validator script exists"
  exit 1
fi

# Run validator
if deno run --allow-read validator/index-zh-TW.mjs "$SCRAPER_FILE" > /tmp/validator-output.txt 2>&1; then
  echo "✅ Schema validation: PASSED"
  cat /tmp/validator-output.txt
else
  echo "❌ Schema validation: FAILED"
  echo ""
  echo "Validator output:"
  cat /tmp/validator-output.txt
  echo ""
  echo "   Fix: Review validator errors above"
  rm -f /tmp/validator-output.txt
  exit 1
fi

rm -f /tmp/validator-output.txt
echo ""
echo "Phase 2: ✅ PASSED"
echo ""

# ======================================
# Summary
# ======================================
echo "======================================"
echo "   All Phases PASSED ✅"
echo "======================================"
echo ""
echo "Scraper is ready for:"
echo "  - Commit to git"
echo "  - Push to remote"
echo "  - Create pull request"
echo ""
echo "Next steps:"
echo "  1. Test in Stash with real URLs"
echo "  2. Mark as VERIFIED after testing"
echo "  3. Update # Last Updated date"
echo ""
