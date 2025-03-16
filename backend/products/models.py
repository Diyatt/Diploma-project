from django.db import models
from locations.models import Region, District
from users.models import User

class Category(models.Model):
    category_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.category_name


class Quality(models.Model):
    QUALITY_TYPES = [
        ('perfect', 'Отличное'),
        ('good', 'Хорошее'),
        ('working', 'Рабочее'),
    ]
    quality_type = models.CharField(max_length=20, choices=QUALITY_TYPES, unique=True)

    def __str__(self):
        return dict(self.QUALITY_TYPES)[self.quality_type]


class Product(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255)
    quality = models.ForeignKey(Quality, on_delete=models.CASCADE)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    piece = models.IntegerField()
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"
