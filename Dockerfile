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

# Expose port
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Use absolute path so both startup-seed and standalone server use the same DB
ENV DATABASE_URL=file:/app/db/custom.db

EXPOSE 3000

# Start: run seed first, then start the standalone server
CMD ["sh", "-c", "cd /app && bun run scripts/startup-seed.ts && cd /app/.next/standalone && DATABASE_URL=file:/app/db/custom.db node server.js"]
