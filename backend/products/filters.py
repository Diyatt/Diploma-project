import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")  # Цена >=
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")  # Цена <=

    class Meta:
        model = Product
        fields = ['category', 'region', 'district', 'min_price', 'max_price']