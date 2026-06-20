#!/usr/bin/env bash

set -euo pipefail

OUTPUT_DIR="dist/projeto-raizes-nordeste-uninter/browser"

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Build output not found at $OUTPUT_DIR"
  exit 1
fi

cp "$OUTPUT_DIR/index.html" "$OUTPUT_DIR/404.html"
touch "$OUTPUT_DIR/.nojekyll"

echo "GitHub Pages artifacts prepared in $OUTPUT_DIR"
