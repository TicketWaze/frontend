# Use official Node.js image as the base
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the monorepo
COPY . .

# Build the frontend app (adjust path if needed)
WORKDIR /app/frontend
RUN pnpm install
RUN pnpm build
