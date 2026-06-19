FROM node:22-alpine

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3000

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./
COPY frontend/ ../frontend/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/').then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "start"]
