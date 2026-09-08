#!/usr/bin/env bash
# Install development dependencies.
# Usage: bash tools/install.sh

set -e

echo "=== Installing dependencies ==="

if ! command -v node &> /dev/null; then
  echo "Error: Node.js ^22.22.2 || ^24.15.0 || >=26.0.0 is required (validator/index.mjs and jsdom 30)" >&2
  exit 1
fi

node -e 'const [major, minor, patch] = process.versions.node.split(".").map(Number); const ok = (major === 22 && (minor > 22 || (minor === 22 && patch >= 2))) || (major === 24 && minor >= 15) || major >= 26; if (!ok) { console.error(`Error: Node.js ${process.versions.node} is unsupported; use ^22.22.2 || ^24.15.0 || >=26.0.0`); process.exit(1); }'

if ! command -v python3 &> /dev/null; then
  echo "Error: Python 3 is required (tools/tests, tools/check_scraper_docs.py)" >&2
  exit 1
fi

echo "Installing Python packages..."
python3 -m pip install -r requirements.txt
# Optional, only needed for developing script-action scrapers:
# python3 -m pip install stashapp-tools requests beautifulsoup4 lxml

echo "Installing Node packages..."
npm install

echo "=== Installation complete ==="
