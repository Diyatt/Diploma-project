import json
from urllib.parse import parse_qs
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework_simplejwt.tokens import AccessToken
from .models import Chat, Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.chat_id = self.scope['url_route']['kwargs']['chat_id']
            self.room_group_name = f'chat_{self.chat_id}'

            query_string = parse_qs(self.scope['query_string'].decode())
            token = query_string.get('token', [None])[0]

            if token is None:
                print("❌ Token отсутствует")
                await self.close(code=4001)
                return

            user = await self.get_user_from_token(token)
            if user is None:
                print("❌ Ошибка аутентификации")
                await self.close(code=4001)
                return

            if not await self.is_chat_participant(user):
                print("❌ Пользователь не является участником чата")
                await self.close(code=4003)
                return

            self.scope['user'] = user
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

        except Exception as e:
            print(f"🔥 Ошибка в WebSocket: {e}")
            await self.close(code=1011)  # Ошибка сервера

    @database_sync_to_async
    def get_user_from_token(self, token):
        """Декодируем JWT-токен и получаем пользователя"""
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            return User.objects.get(id=user_id)
        except Exception as e:
            print("Token error:", e)
            return None

    @database_sync_to_async
    def is_chat_participant(self, user):
        """Проверяем, является ли пользователь участником чата"""
        return Chat.objects.filter(
            id=self.chat_id
        ).filter(
            Q(user1=user) | Q(user2=user)
        ).exists()

    async def disconnect(self, close_code):
        """Отключение пользователя"""
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        """Прием сообщений от пользователя"""
        if not text_data:  # Проверка, что данные не пустые
            print("❌ Получено пустое сообщение!")
            return

        try:
            text_data_json = json.loads(text_data)  # Попытка загрузки JSON
        except json.JSONDecodeError:
            print("❌ Ошибка декодирования JSON!")
            return

        message = text_data_json.get('message', '')

        if not message.strip():  # Игнорируем пустые сообщения
            print("⚠️ Пустое сообщение")
            return

        await self.save_message(self.scope['user'], message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': self.scope['user'].id,
                'sender_username': self.scope['user'].username,
                'sent_at': str(datetime.now())  # Время отправки
            }
        )

    async def chat_message(self, event):
        """Отправка сообщения в WebSocket"""
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'sent_at': event['sent_at']
        }))

    @database_sync_to_async
    def save_message(self, user, message):
        """Сохраняем сообщение в БД"""
        chat = Chat.objects.get(id=self.chat_id)  # Получаем чат
        return Message.objects.create(
            chat=chat,
            sender=user,
            content=message
        )