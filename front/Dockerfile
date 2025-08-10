# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy only the built assets and minimal files needed for preview
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
RUN npm i --no-audit --no-fund --omit=dev && npm i vite@5 -D --no-audit --no-fund
EXPOSE 5173
CMD ["npm","run","preview","--","--host","0.0.0.0"]

