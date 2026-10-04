FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source (including db/custom.db with data + public/uploads with images)
COPY . .

# Generate Prisma client (don't run db:push to avoid wiping data)
RUN bun run db:generate

# Ensure the db file exists with data
RUN ls -la /app/db/custom.db || echo "WARNING: db file missing"

# Build
RUN bun run build

# Make sure uploads directory exists and has content
RUN ls -la /app/public/uploads/ || mkdir -p /app/public/uploads

# Expose port
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

# Start
CMD ["bun", "run", "start"]
