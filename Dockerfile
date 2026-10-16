# Digital Suraksha Multi-Stage Production Dockerfile

# Base Node Image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# Dependencies & Build Stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/backend/package*.json ./packages/backend/
COPY packages/frontend/package*.json ./packages/frontend/

RUN npm install

COPY . .

# Generate Prisma Client & Build all packages
RUN npm run build --workspace=packages/shared
RUN npm run prisma:generate --workspace=packages/backend
RUN npm run build --workspace=packages/backend
RUN npm run build --workspace=packages/frontend

# Backend Target
FROM base AS backend
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/packages/backend ./packages/backend

EXPOSE 5000
CMD ["node", "packages/backend/dist/server.js"]

# Frontend Target (Nginx Production Server)
FROM nginx:alpine AS frontend
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
