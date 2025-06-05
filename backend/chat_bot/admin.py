from django.contrib import admin

# Register your models here.
from .models import ChatMessage


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'short_query', 'short_response', 'created_at')
    list_filter = ('user', 'created_at')

    def short_query(self, obj):
        return obj.query[:50] + '...' if len(obj.query) > 50 else obj.query

    short_query.short_description = 'Request'

    def short_response(self, obj):
        return obj.response[:50] + '...' if len(obj.response) > 50 else obj.response

    short_response.short_description = 'Response'