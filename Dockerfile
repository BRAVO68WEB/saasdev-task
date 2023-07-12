FROM node:alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

# Copy source code
COPY . .

# Build
RUN pnpm run build

# Expose port
EXPOSE 4000

# Run
CMD ["pnpm", "start"]