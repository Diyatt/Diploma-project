from django.urls import path
from .views import ProductReviewView , ReviewDetailView, ReviewListView , WishlistListView, WishlistModifyView

urlpatterns = [
    path('products/<int:product_id>/reviews/add/', ProductReviewView.as_view(), name='product-review'),
    path('reviews/<int:review_id>/', ReviewDetailView.as_view()),
    path('products/<int:product_id>/reviews/', ReviewListView.as_view(), name='review-list'),
    path('wishlist/', WishlistListView.as_view(), name='wishlist-list'),  # Просмотр / Добавление
    path('wishlist/<int:product_id>/', WishlistModifyView.as_view(), name='wishlist-modify'),  # Удаление
]