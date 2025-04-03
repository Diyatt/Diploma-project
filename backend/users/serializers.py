from users.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from locations.models import District

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'full_name', 'phone_number']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


User = get_user_model()

class UserUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    second_phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    district = serializers.PrimaryKeyRelatedField(queryset=District.objects.all(), required=False)
    local_address = serializers.CharField(required=False)
    profile_picture = serializers.ImageField(required=False, allow_null=True)  # Убираем allow_blank

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'second_phone_number', 'district', 'local_address', 'profile_picture']

    def validate_email(self, value):
        """Проверка уникальности email при его изменении."""
        if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)