# Используем официальный Node для сборки
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Используем nginx для сервинга собранного фронта
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфиг nginx, чтобы SPA работал правильно
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
