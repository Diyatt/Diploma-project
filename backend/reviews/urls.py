from django.urls import path
from .views import ProductReviewView , ReviewDetailView

urlpatterns = [
    path('products/<int:product_id>/reviews/', ProductReviewView.as_view(), name='product-review'),
    path('reviews/<int:review_id>/', ReviewDetailView.as_view()),


]