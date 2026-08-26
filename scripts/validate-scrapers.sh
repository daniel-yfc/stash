#!/bin/bash
# Validate all scrapers in the scrapers/ directory
# Usage: ./validate-scrapers.sh

set -e

echo "🔍 Validating scrapers..."
echo ""

# Check if deno is installed
if ! command -v deno &> /dev/null; then
    echo "❌ deno is not installed. Please install deno first:"
    echo "   curl -fsSL https://deno.land/install.sh | sh"
    exit 1
fi

# Validate each scraper file
validator="validator/index-zh-TW.mjs"
schema="validator/scraper.schema.json"
scrapers_dir="scrapers"

# Counters
total=0
passed=0
failed=0

echo "Running validator..."
echo ""

# Find all .yml files in scrapers/ (including subdirectories)
while IFS= read -r -d '' file; do
    total=$((total + 1))
    filename=$(basename "$file")
    
    echo "📄 Validating: $filename"
    
    if deno run -R="$scrapers_dir" -R="$schema" "$validator" "$file" > /dev/null 2>&1; then
        echo "   ✅ PASSED"
        passed=$((passed + 1))
    else
        echo "   ❌ FAILED"
        echo "   Running with verbose output:"
        deno run -R="$scrapers_dir" -R="$schema" "$validator" -a "$file" || true
        failed=$((failed + 1))
    fi
    echo ""
done < <(find "$scrapers_dir" -name "*.yml" -type f -print0)

echo "================================"
echo "📊 Summary:"
echo "   Total:   $total"
echo "   Passed:  $passed ✅"
echo "   Failed:  $failed ❌"
echo "================================"

if [ $failed -gt 0 ]; then
    echo ""
    echo "⚠️  Some scrapers failed validation. Please fix the errors above."
    exit 1
else
    echo ""
    echo "🎉 All scrapers passed validation!"
    exit 0
fi
