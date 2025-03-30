from django.urls import path
from . import views

urlpatterns = [
    path('chats/', views.ChatListView.as_view(), name='chat-list'),
    path('chats/<int:chat_id>/messages/', views.MessageListCreateView.as_view(), name='message-list'),
]