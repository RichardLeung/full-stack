#!/bin/sh
set -eu
task_root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$task_root"
mkdir -p apps/mobile/lib/generated
pnpm exec buf generate
node scripts/generate-locales.mjs
