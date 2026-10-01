#!/bin/sh
set -eu

# Each service syncs only what it needs into its own environment.
case "${UV_SYNC_MODE:-workspace}" in
    workspace) uv sync --locked --no-default-groups ;;
    notebooks) uv sync --locked --no-default-groups --group notebooks ;;
    checks) uv sync --locked --only-group dev ;;
    app) uv sync --locked --no-default-groups --package "${UV_WORKSPACE_PACKAGE:?Set UV_WORKSPACE_PACKAGE to the app name}" ;;
    *) printf 'Unknown UV_SYNC_MODE: %s\n' "$UV_SYNC_MODE" >&2; exit 2 ;;
esac
exec "$@"
