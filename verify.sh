#!/usr/bin/env bash
# verify.sh — Cổng kiểm chứng Verify Gate của School Operating Portal
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="$HERE/.tools/bin:$PATH"

cd "$HERE/app"
npm test
