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

# Run
CMD ["pnpm", "start"]