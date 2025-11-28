FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies during build
RUN npm install --no-save

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Run entrypoint script
ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
