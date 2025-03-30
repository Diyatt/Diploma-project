from rest_framework import generics, permissions
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

class ChatListView(generics.ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(Q(user1=user) | Q(user2=user))

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Message.objects.filter(chat_id=self.kwargs['chat_id']).order_by('sent_at')

    def perform_create(self, serializer):
        chat = Chat.objects.get(id=self.kwargs['chat_id'])
        serializer.save(chat=chat, sender=self.request.user)