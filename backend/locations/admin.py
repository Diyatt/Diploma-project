from django.contrib import admin

# Register your models here.
from .models import Region, District

# Register your models here.
admin.site.register(Region)
admin.site.register(District)