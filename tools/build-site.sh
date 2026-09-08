#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

node validator/index.mjs -a -s scrapers
python tools/check_scraper_docs.py

echo "Site/validation inputs are valid."
