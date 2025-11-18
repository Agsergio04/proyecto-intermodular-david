FROM node:18-alpine

WORKDIR /app

COPY package.json ./

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh && \
    npm install --no-save

COPY . .

EXPOSE 3000

# Run entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]