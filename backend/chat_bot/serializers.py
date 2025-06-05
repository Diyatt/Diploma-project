from rest_framework import serializers
from .models import ChatMessage
from products.serializers import ProductSerializer


class ChatMessageSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "query", "response", "products", "created_at"]