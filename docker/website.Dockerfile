# Next.js and its workers use Node; Bun manages the workspace and scripts.
FROM node:22-bookworm-slim
COPY --from=oven/bun:1.3.14 /usr/local/bin/bun /usr/local/bin/bun

ARG LOCAL_UID=1000
ARG LOCAL_GID=1000
RUN groupadd --non-unique --gid "$LOCAL_GID" playground \
    && useradd --non-unique --uid "$LOCAL_UID" --gid "$LOCAL_GID" --create-home playground \
    && mkdir -p /workspace/node_modules /workspace/apps/blog/node_modules \
        /workspace/apps/blog/.next /workspace/apps/blog/.next-dev \
        /home/playground/.bun/install/cache \
    && chown -R "$LOCAL_UID:$LOCAL_GID" /workspace /home/playground

ENV BUN_INSTALL_CACHE_DIR=/home/playground/.bun/install/cache

COPY --chmod=755 docker/website-entrypoint.sh /usr/local/bin/website-entrypoint
USER playground
WORKDIR /workspace
ENTRYPOINT ["website-entrypoint"]
CMD ["bun", "run", "dev", "--hostname", "0.0.0.0"]
