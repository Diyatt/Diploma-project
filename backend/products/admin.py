from django.contrib import admin
from .models import Product, Category, Quality, ProductImage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'status', 'created_at', 'price')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('views', 'average_rating', 'created_at', 'updated_at')
    list_editable = ('status',)  # позволяет менять статус прямо в списке

    fieldsets = (
        (None, {    
            'fields': ('name', 'description', 'price', 'piece', 'owner', 'category', 'region', 'district', 'quality', 'status')
        }),
        ('Дополнительно', {
            'fields': ('views', 'average_rating', 'created_at', 'updated_at'),
        }),
    )
    
admin.site.register(Category)
admin.site.register(Quality)
admin.site.register(ProductImage)
