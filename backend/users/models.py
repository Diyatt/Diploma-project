from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from locations.models import Region
from locations.models import District
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True)
    full_name = models.CharField(max_length=255)
    local_address = models.TextField()
    phone_number = models.CharField(max_length=20)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    profile_picture = CloudinaryField('image', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    groups = models.ManyToManyField(Group, related_name="custom_user_groups")
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions")

    def __str__(self):
        return self.full_name or self.username

