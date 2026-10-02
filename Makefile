# Run `make` for help. Only Docker with Compose and make are needed on the host.
SHELL := /bin/sh
.DEFAULT_GOAL := help

REPO_ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
DOCKER_COMPOSE ?= docker compose
COMPOSE := $(DOCKER_COMPOSE) --project-directory "$(REPO_ROOT)" -f "$(REPO_ROOT)/compose.yaml"
LOCAL_UID ?= $(shell id -u)
LOCAL_GID ?= $(shell id -g)
export LOCAL_UID LOCAL_GID

APP ?=
CMD ?= $(APP)
ARGS ?=
NOTEBOOK ?=
PYTHON_WEB_PORT ?= 8000
CONTAINER_PORT ?= 8000

.PHONY: help setup docker-build notebook notebook-run notebook-check notebooks-prepare website website-check website-build \
	python-check check cli python-web python-shell website-shell uv bun format format-check stop clean

help: ## Show commands and usage
	@awk 'BEGIN { FS = ":.*## "; print "Run everything through make (Docker must be running):\n" } /^[a-zA-Z_-]+:.*## / { printf "  %-18s %s\n", $$1, $$2 }' "$(REPO_ROOT)/Makefile"
	@printf '\nExamples:\n  make notebook\n  make website\n  make website-check\n  make cli APP=my-cli CMD=my-cli ARGS="--help"\n  make notebook-run NOTEBOOK=notebooks/estimating-pi.ipynb\n  make uv ARGS="add --group notebooks numpy"\n  make bun ARGS="install"\n\nOverride NOTEBOOK_PORT=8888 or WEBSITE_PORT=3000 as needed.\nPython web apps can override PYTHON_WEB_PORT=8000 and CONTAINER_PORT=8000.\nPython containers read an optional ignored .env file.\n'

docker-build: ## Build the Python and website tooling images
	$(COMPOSE) build python website

setup: docker-build ## Build images and install locked dependencies in Docker volumes
	$(COMPOSE) run --rm -T notebook uv --version
	$(COMPOSE) run --rm -T python-check uv --version
	$(COMPOSE) run --rm -T website bun --version

notebook: ## Start JupyterLab at localhost:8888 (use the token from its logs)
	$(COMPOSE) up --build notebook

notebook-run: ## Execute and save a selected notebook: NOTEBOOK=notebooks/example.ipynb
	@test -n "$(NOTEBOOK)" || { printf 'Usage: make notebook-run NOTEBOOK=notebooks/example.ipynb\n' >&2; exit 2; }
	$(COMPOSE) run --rm --build -T notebook uv run --no-sync jupyter nbconvert --to notebook --execute --inplace "$(NOTEBOOK)"

notebook-check: ## Verify notebook widget values, callbacks, validation, and output rendering
	$(COMPOSE) run --rm --build -T notebook uv run --no-sync python apps/blog/scripts/test-notebook-widgets.py

notebooks-prepare: ## Refresh published notebook downloads while the website is running
	$(COMPOSE) run --rm --build -T website bun run notebooks:prepare

website: ## Start the website at localhost:3000
	$(COMPOSE) up --build website

website-check: ## Check website types and lint, then build the production export
	$(COMPOSE) run --rm --build -T website sh -c 'bun run typecheck && bun run lint && bun run test && bun run build'

website-build: ## Export the website to apps/blog/docs
	$(COMPOSE) run --rm --build -T website bun run build

python-check: ## Check Python lint and formatting
	$(COMPOSE) run --rm --build -T python-check sh -c 'uv run --no-sync ruff check . && uv run --no-sync ruff format --check .'

check: python-check notebook-check website-check ## Run Python, notebook, and website checks in Docker

cli: ## Run a Python workspace app: APP=my-cli CMD=my-cli ARGS="--help"
	@test -n "$(APP)" || { printf 'Usage: make cli APP=my-cli CMD=my-cli ARGS="--help"\nAdd a Python app under apps/ first.\n' >&2; exit 2; }
	$(COMPOSE) run --rm --build -e UV_SYNC_MODE=app -e UV_WORKSPACE_PACKAGE="$(APP)" python uv run --no-sync --package "$(APP)" -- "$(CMD)" $(ARGS)

python-web: ## Run a Python web app: APP=... CMD=... ARGS=...; listen on 0.0.0.0:8000
	@test -n "$(APP)" || { printf 'Usage: make python-web APP=my-app CMD=my-app ARGS="..."\n' >&2; exit 2; }
	$(COMPOSE) run --rm --build -p "127.0.0.1:$(PYTHON_WEB_PORT):$(CONTAINER_PORT)" -e UV_SYNC_MODE=app -e UV_WORKSPACE_PACKAGE="$(APP)" python uv run --no-sync --package "$(APP)" -- "$(CMD)" $(ARGS)

python-shell: ## Open a shell with the Python workspace and notebook dependencies ready
	$(COMPOSE) run --rm --build notebook sh

website-shell: ## Open a shell with the website dependencies ready
	$(COMPOSE) run --rm --build website sh

uv: ## Run uv in Docker, e.g. ARGS="lock" or "add --group notebooks numpy"
	@test -n "$(ARGS)" || { printf 'Usage: make uv ARGS="lock"\n' >&2; exit 2; }
	$(COMPOSE) run --rm --build --entrypoint uv python $(ARGS)

bun: ## Run Bun in Docker, e.g. ARGS="install" to update the JavaScript lockfile
	@test -n "$(ARGS)" || { printf 'Usage: make bun ARGS="install"\n' >&2; exit 2; }
	$(COMPOSE) run --rm --build --entrypoint bun website $(ARGS)

format: ## Format Python and website source in Docker
	$(COMPOSE) run --rm --build -T python-check uv run --no-sync ruff format .
	$(COMPOSE) run --rm --build -T website bun run format

format-check: ## Check Python and website formatting without changing source
	$(COMPOSE) run --rm --build -T python-check uv run --no-sync ruff format --check .
	$(COMPOSE) run --rm --build -T website bun run format:check

stop: ## Stop and remove this project's containers; keep dependency volumes
	$(COMPOSE) down --remove-orphans

clean: ## Stop containers and delete this project's Docker dependency/cache volumes
	$(COMPOSE) down --volumes --remove-orphans
