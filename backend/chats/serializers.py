from rest_framework import serializers
from .models import Message, Chat

class ChatSerializer(serializers.ModelSerializer):
    user1_full_name = serializers.ReadOnlyField(source='user1.full_name')
    user2_full_name = serializers.ReadOnlyField(source='user2.full_name')

    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2', 'user1_full_name', 'user2_full_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user1']


class MessageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    sender = serializers.StringRelatedField(read_only=True)
    chat = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'content', 'sent_at', 'url']
        read_only_fields = ['id', 'sender', 'chat', 'sent_at']

    def get_url(self, obj):
        return obj.image.build_url() if obj.image else None
    

