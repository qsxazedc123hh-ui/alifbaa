FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source (including db/custom.db with data + public/uploads with images)
COPY . .

# Generate Prisma client (don't run db:push to avoid wiping data)
RUN bun run db:generate

# Build
RUN bun run build

# Fix: Update DATABASE_URL in the standalone .env to use absolute path
RUN echo 'DATABASE_URL=file:/app/db/custom.db' > /app/.next/standalone/.env

# Expose port
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/app/db/custom.db

EXPOSE 3000

# Start: run seed first (from /app), then start the standalone server
# Both use the SAME absolute DB path: /app/db/custom.db
CMD ["sh", "-c", "cd /app && DATABASE_URL=file:/app/db/custom.db bun run scripts/startup-seed.ts && cd /app/.next/standalone && DATABASE_URL=file:/app/db/custom.db node server.js"]
