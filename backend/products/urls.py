from django.urls import path
from .views import (
    CategoryList, ProductListCreateView, ProductDetailView, 
    MyProductListView, TopViewedProductsView, UploadProductImageView, 
    DeleteProductImageView, QualityListView, ProductDeleteView
)

urlpatterns = [
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    path('myproducts/', MyProductListView.as_view(), name='my-product-list'),
    path('products/top-viewed/', TopViewedProductsView.as_view(), name='top-viewed-products'),
    path('product-images/upload/', UploadProductImageView.as_view(), name='product-image-upload'),
    path('product-images/<int:pk>/delete/', DeleteProductImageView.as_view(), name='product-image-delete'),
    path('qualities/', QualityListView.as_view(), name='quality-list'),
]