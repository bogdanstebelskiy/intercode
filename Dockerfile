FROM node:24-alpine3.21 AS build-ui
WORKDIR /ui
COPY ui/package*.json ./
RUN npm install
COPY ui/ ./
RUN npm run build

FROM node:24-alpine3.21 AS build-api
WORKDIR /api
COPY api/packag*.json ./
RUN npm install
COPY api/ ./
COPY --from=build-ui /ui/dist ./public
RUN npm run build

FROM node:24-alpine3.21
WORKDIR /app
COPY --from=build-api /api/dist ./dist
COPY --from=build-api /api/node_modules ./node_modules
COPY --from=build-api /api/public ./public
COPY api/package*.json ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]