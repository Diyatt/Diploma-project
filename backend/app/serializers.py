from rest_framework import serializers
from django.contrib.auth.models import User
import phonenumbers


class RegisterSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=15, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'phone_number', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_phone_number(self, value):
        """Проверяем, что номер телефона валиден"""
        try:
            phone = phonenumbers.parse(value, None)
            if not phonenumbers.is_valid_number(phone):
                raise serializers.ValidationError("Некорректный номер телефона.")
        except phonenumbers.phonenumberutil.NumberParseException:
            raise serializers.ValidationError("Некорректный номер телефона.")
        return value

    def create(self, validated_data):
        """Создаем нового пользователя"""
        user = User.objects.create_user(
            username=validated_data['phone_number'],  
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
