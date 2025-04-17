from rest_framework import serializers
from .models import Review, Wishlist

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'comment', 'review_date']
        read_only_fields = ['id', 'review_date']

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'created_at']
        read_only_fields = ['user', 'created_at']  # `user` будет устанавливаться автоматически
