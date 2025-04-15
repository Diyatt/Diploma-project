from django.contrib import admin

from .models import Product, Category, Quality, ProductImage
# Register your models here.
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Quality)
admin.site.register(ProductImage)
