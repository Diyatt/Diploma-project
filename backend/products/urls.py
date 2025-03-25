from django.urls import path
from .views import CategoryList, ProductListCreateView, ProductDetailView, MyProductListView

urlpatterns = [
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('myproducts/', MyProductListView.as_view(), name='my-product-list'),
]