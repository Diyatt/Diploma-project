from django.db import models
from locations.models import Region, District
from users.models import User
from cloudinary.models import CloudinaryField

class Category(models.Model):
    category_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    image = CloudinaryField('image', blank=True, null=True)

    def __str__(self):
        return self.category_name


class Quality(models.Model):
    QUALITY_TYPES = {
        'excellent': 'Excellent',
        'good': 'Good',
        'average': 'Average',
        'not_bad': 'Not Bad'
    }
    
    quality_type = models.CharField(max_length=20, unique=True, choices=QUALITY_TYPES.items())

    def __str__(self):
        return self.QUALITY_TYPES.get(self.quality_type, self.quality_type)

class Product(models.Model):
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    views = models.IntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255)
    quality = models.ForeignKey(Quality, on_delete=models.CASCADE)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    piece = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    average_rating = models.FloatField(default=0)
    
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='processing',
    )

    def __str__(self):
        return f"{self.name} ({self.owner.username})"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image', null=True, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"

