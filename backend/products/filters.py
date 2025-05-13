import django_filters
from .models import Product
from django_filters import rest_framework as filters

class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")  # Цена >=
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")  # Цена <=
    district = django_filters.BaseInFilter(field_name="district", lookup_expr="in")

    category = filters.NumberFilter(field_name="category")

    class Meta:
        model = Product
        fields = ['category', 'region', 'district', 'min_price', 'max_price']