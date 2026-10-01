FROM python:3.14-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:0.12.7 /uv /uvx /usr/local/bin/

# Match the host user so notebook saves and lockfile changes remain user-owned.
ARG LOCAL_UID=1000
ARG LOCAL_GID=1000
RUN groupadd --non-unique --gid "$LOCAL_GID" playground \
    && useradd --non-unique --uid "$LOCAL_UID" --gid "$LOCAL_GID" --create-home playground \
    && mkdir -p /workspace /opt/venv /home/playground/.cache/uv \
    && chown -R "$LOCAL_UID:$LOCAL_GID" /workspace /opt/venv /home/playground

ENV UV_PROJECT_ENVIRONMENT=/opt/venv \
    UV_CACHE_DIR=/home/playground/.cache/uv \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    PYTHONDONTWRITEBYTECODE=1

COPY --chmod=755 docker/python-entrypoint.sh /usr/local/bin/python-entrypoint
USER playground
WORKDIR /workspace
ENTRYPOINT ["python-entrypoint"]
CMD ["uv", "--version"]
