from rest_framework import serializers
from .models import Message, Chat
from users.models import User
from users.serializers import UserSerializer

class ChatSerializer(serializers.ModelSerializer):
    # оқу кезінде: толық қолданушы
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)

    # жазу кезінде: тек ID қабылдайды
    user2_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="user2"
    )

    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2', 'user2_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user1']




class MessageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    sender = UserSerializer(read_only=True)
    chat = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'content', 'image', 'url', 'is_read', 'sent_at']
        read_only_fields = ['id', 'sender', 'chat', 'sent_at', 'is_read']

    def get_url(self, obj):
        return obj.image.build_url() if obj.image else None

