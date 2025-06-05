from django.urls import path
from chat_bot.views import ChatBotView,ChatHistoryView

urlpatterns = [
    path('ask/', ChatBotView.as_view(), name='chatbot'),
    path('history/', ChatHistoryView.as_view(), name='chat-history'),
]