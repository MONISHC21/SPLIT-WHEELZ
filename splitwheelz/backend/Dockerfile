FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 splitwheelz

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p logs && chown -R splitwheelz:nodejs logs

USER splitwheelz

EXPOSE 5000
CMD ["node", "dist/server.js"]
