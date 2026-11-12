# server/Dockerfile
#
# Layer-caching principle: package files are copied and dependencies
# installed BEFORE the rest of the application code, so code-only
# changes don't force a slow dependency reinstall on every build.

FROM node:22-alpine
# "alpine" is a minimal Linux distribution: small image size, faster
# downloads, and a smaller attack surface (fewer installed packages that
# could contain vulnerabilities, Lecture 16's A06). Node 22 matches the
# engines constraint in server/package.json (Lecture 10).

ENV NODE_ENV=production
# Switches npm and Express to production behaviour. error-handler.js
# (Lecture 16's A05 fix) hides internal error details only when
# NODE_ENV is production AND that handler is mounted in app.js.

WORKDIR /app
# Every subsequent instruction runs relative to /app inside the image.

COPY package*.json ./
RUN npm ci --omit=dev
# Dependencies are installed here, in their own cached layer.

COPY prisma.config.ts ./
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx prisma generate
# prisma.config.ts calls env("DATABASE_URL"), which throws if the variable
# is unset, and .env is excluded by .dockerignore. `generate` never connects
# to the database, so a placeholder set for this one command is enough.
# It is not an ENV, so it does not persist into the image: the real URL
# must be supplied at runtime.

COPY src ./src
# Application code is copied last. It changes most often, so keeping it
# last invalidates the fewest cached layers.

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
# The entrypoint applies pending database migrations before the server starts.

ENV PORT=3000
# Inkwell's server defaults to port 4000 (`process.env.PORT || 4000`).
# Setting PORT here makes the container listen on the port EXPOSE documents.

EXPOSE 3000
# Documents the port the app listens on (Section 4.7's networking).

USER node
# Drop root: the official node image ships an unprivileged "node" user.
# Everything above stays root-owned and read-only to the running process.

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/index.js"]
# Secrets are never baked into the image. Supply them at runtime, e.g.:
#   docker run -p 3000:3000 \
#     -e DATABASE_URL=... \
#     -e ACCESS_TOKEN_SECRET=... \
#     -e REFRESH_TOKEN_SECRET=... \
#     inkwell-server