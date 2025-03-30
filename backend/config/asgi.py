"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application

# 1️⃣ Устанавливаем переменную окружения перед импортами
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# 2️⃣ Загружаем Django перед импортом WebSocket
django.setup()

# 3️⃣ Только после этого импортируем WebSocket маршруты
from chats.routing import websocket_urlpatterns
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})