from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    region = models.ForeignKey('locations.Region', on_delete=models.SET_NULL, null=True)
    district = models.ForeignKey('locations.District', on_delete=models.SET_NULL, null=True)
    full_name = models.CharField(max_length=255)
    local_address = models.TextField()
    phone_number = models.CharField(max_length=20)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)