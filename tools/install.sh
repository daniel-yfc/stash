#!/usr/bin/env bash
# Install development dependencies.
# Usage: bash tools/install.sh

set -e

echo "=== Installing dependencies ==="

if ! command -v node &> /dev/null; then
  echo "Error: Node.js 20+ is required (validator/index.mjs)" >&2
  exit 1
fi

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
