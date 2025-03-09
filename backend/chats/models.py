from django.db import models
from users.models import User

class Chat(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats_initiated')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats_received')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)  # Можно отправлять сообщения без текста (например, только изображение)
    image = models.ImageField(upload_to='chat_images/', blank=True, null=True)  # Загружаемые изображения
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)
