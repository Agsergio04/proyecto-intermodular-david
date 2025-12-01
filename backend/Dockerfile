FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies during build
RUN npm install --no-save

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN apk add --no-cache dos2unix && dos2unix /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh && apk del dos2unix

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run entrypoint script
ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
