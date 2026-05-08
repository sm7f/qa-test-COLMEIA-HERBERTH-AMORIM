#!/usr/bin/env sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

export PATH="$PROJECT_ROOT/.tools/node-v24.14.1-linux-x64/bin:$PATH"
export CYPRESS_CACHE_FOLDER="$PROJECT_ROOT/.cache/Cypress"
unset ELECTRON_RUN_AS_NODE

exec "$PROJECT_ROOT/node_modules/.bin/cypress" "$@"
