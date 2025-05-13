from django.urls import path
from .views import ChatListCreateView, MessageListCreateView, ChatDetailView

urlpatterns = [
    path('chats/', ChatListCreateView.as_view(), name='chat-list-create'), # list & create chats
    path('chats/<int:chat_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),  # list & create messagess
    path('chats/<int:pk>/', ChatDetailView.as_view(), name='chat-detail'),  # ✅ МІНЕ ОСЫ ЖЕТІСПЕЙ ЖАТЫР
]