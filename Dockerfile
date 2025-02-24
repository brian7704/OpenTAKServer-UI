# ============ Stage 1: Build with Node ============
FROM node:22 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# Build the static production files to /app/dist
RUN npm run build


# ============ Stage 2: Use nginxinc/nginx-unprivileged ============
FROM nginxinc/nginx-unprivileged:latest

# Clean up default content (optional)
USER root
RUN rm -rf /usr/share/nginx/html/*
USER 101

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# This image listens on port 8080 by default (unprivileged port).
EXPOSE 8080

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]