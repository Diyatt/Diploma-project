from rest_framework import generics, permissions
from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        chat_id = self.kwargs.get('chat_id')
        try:
            chat = Chat.objects.get(pk=chat_id)
            # Check if the current user is part of this chat
            if self.request.user != chat.user1 and self.request.user != chat.user2:
                raise ValidationError("You are not a participant in this chat.")
            return Message.objects.filter(chat_id=chat_id)
        except Chat.DoesNotExist:
            raise ValidationError("Chat does not exist.")

    def perform_create(self, serializer):
        chat_id = self.kwargs['chat_id']
        try:
            chat = Chat.objects.get(pk=chat_id)
            # Check if the current user is part of this chat
            if self.request.user != chat.user1 and self.request.user != chat.user2:
                raise ValidationError("You are not a participant in this chat.")
            
            # Get content and image from request data
            content = self.request.data.get('content')
            image = self.request.FILES.get('image')
            
            if not content and not image:
                raise ValidationError("Either content or image is required.")
                
            # Save the message
            message = serializer.save(
                sender=self.request.user, 
                chat=chat, 
                content=content,
                image=image
            )
            
            # Update the chat's updated_at field
            chat.save()  # This will update the updated_at field due to auto_now=True
            
        except Chat.DoesNotExist:
            raise ValidationError("Chat does not exist.")

class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(
            Q(user1=user) | Q(user2=user)
        ).order_by('-updated_at')  # Order by most recent first

    def perform_create(self, serializer):
        user1 = self.request.user
        user2 = serializer.validated_data.get('user2')  # Validate user2 correctly
        
        if not user2:
            raise ValidationError("user2 is required.")
        
        if Chat.objects.filter(user1=user1, user2=user2).exists() or Chat.objects.filter(user1=user2, user2=user1).exists():
            raise ValidationError("Chat between these users already exists.")
        
        serializer.save(user1=user1)


class ChatDetailView(RetrieveAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]
