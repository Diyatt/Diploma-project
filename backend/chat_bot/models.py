from django.db import models
# Create your models here.
from django.db import models
from products.models import Product  # Модель товаров из вашего приложения
from users.models import User  # Модель пользователя (JWT)

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Связь с пользователем
    query = models.TextField()          # Запрос пользователя
    response = models.TextField()       # Ответ бота
    products = models.ManyToManyField(Product)  # Товары, которые предложил бот
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Безопасное получение email
        user_identifier = "Аноним" if self.user is None else getattr(self.user, 'email', str(self.user))
        return f"{user_identifier}: {self.query[:50]}"