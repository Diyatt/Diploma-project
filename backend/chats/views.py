from rest_framework import generics, permissions
from .models import Chat, Message
from .serializers import MessageSerializer, ChatSerializer
from rest_framework.exceptions import ValidationError

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
                
            serializer.save(
                sender=self.request.user, 
                chat=chat, 
                content=content,
                image=image
            )
        except Chat.DoesNotExist:
            raise ValidationError("Chat does not exist.")





class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(user1=user) | Chat.objects.filter(user2=user)



    def perform_create(self, serializer):
        user1 = self.request.user
        user2 = serializer.validated_data.get('user2')  # Validate user2 correctly
        
        if not user2:
            raise ValidationError("user2 is required.")
        
        if Chat.objects.filter(user1=user1, user2=user2).exists() or Chat.objects.filter(user1=user2, user2=user1).exists():
            raise ValidationError("Chat between these users already exists.")
        
        serializer.save(user1=user1)