#!/bin/bash

set -e  # Прерывать скрипт при любой ошибке

# Ожидаем PostgreSQL
echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done
echo "✅ PostgreSQL is up!"

# Применяем миграции и собираем статику
echo "📦 Applying migrations..."
python manage.py migrate --noinput

echo "🖼️ Collecting static files..."
python manage.py collectstatic --noinput

# Запускаем Daphne
echo "🚀 Starting Daphne server..."
exec daphne -b 0.0.0.0 -p 8000 config.asgi:application
