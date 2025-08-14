FROM node:24-alpine3.21 AS build-ui
WORKDIR /ui
COPY ui/package*.json ./
RUN npm install
COPY ui/ ./
RUN npm run build

FROM node:24-alpine3.21 AS build-api
WORKDIR /api
COPY api/package*.json ./
RUN npm install
COPY api/ ./
RUN npm run build

FROM node:24-alpine3.21
WORKDIR /app

# Copy API files
COPY --from=build-api /api/dist ./api/dist
COPY --from=build-api /api/package*.json ./api/

# Copy UI build files maintaining structure
COPY --from=build-ui /ui/dist ./ui/dist

# Install only production dependencies
WORKDIR /app/api
RUN npm ci --only=production

# Back to app root
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "api/dist/main.js"]