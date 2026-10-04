FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN bun run db:generate

# Build
RUN bun run build

# Create directories for persistent data
RUN mkdir -p /app/db /app/public/uploads

# Expose port
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

# Start
CMD ["bun", "run", "start"]
