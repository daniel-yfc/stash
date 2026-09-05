#!/usr/bin/env bash
# Run the Python test suite.
# Usage: bash tools/test.sh

set -e

if [ ! -d "tools/tests/" ]; then
  echo "Error: tools/tests/ not found (run from the repository root)" >&2
  exit 1
fi

python3 -m pytest tools/tests/ -v

echo "=== Tests complete ==="
