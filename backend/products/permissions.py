from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    """Разрешает изменять и удалять объект только его владельцу."""

    def has_object_permission(self, request, view, obj):
        # Чтение (GET, HEAD, OPTIONS) доступно всем
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        # Изменять и удалять может только владелец
        return obj.owner == request.user
