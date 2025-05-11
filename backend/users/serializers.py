from users.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from locations.models import District
from .utils import generate_verification_code, send_verification_email  # импорт вспомогалок


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    profile_picture = serializers.SerializerMethodField()
    region = serializers.StringRelatedField()
    district = serializers.StringRelatedField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'confirm_password',
            'full_name', 'phone_number', 'local_address', 'region',
            'district', 'profile_picture', 'created_at'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"password": "Пароли не совпадают."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def create_resend(self, validated_data):
        # Генерируем код верификации
        validated_data.pop('confirm_password')
        code = generate_verification_code()

        # Создаём пользователя
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False  # Пользователь неактивен до подтверждения
        user.verification_code = code
        user.save()

        # Отправка письма
        send_verification_email(user.email, code)

        return user


User = get_user_model()

class UserUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=False, max_length=255)
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False, max_length=20)
    district = serializers.PrimaryKeyRelatedField(queryset=District.objects.all(), required=False)
    local_address = serializers.CharField(required=False)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone_number', 'district', 'local_address', 'profile_picture']

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None

    def validate_email(self, value):
        """Проверка уникальности email при его изменении."""
        if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value

    def update(self, instance, validated_data):
        """Обновление пользователя с сохранением неизмененных полей."""
        for attr, value in validated_data.items():
            if value is not None:  # Обновляем только если значение предоставлено
                setattr(instance, attr, value)
        instance.save()
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)