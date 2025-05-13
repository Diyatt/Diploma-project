from rest_framework.views import APIView
from rest_framework import generics
from users.models import User
from users.serializers import UserSerializer, ChangePasswordSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from .serializers import UserUpdateSerializer
from django.contrib.auth import get_user_model
import random
from django.core.mail import send_mail
import string
from rest_framework import serializers


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)  # Деактивирован по умолчанию
        verification_code = f"{random.randint(100000, 999999)}"
        user.verification_code = verification_code
        user.save()

        send_mail(
            subject="Verify your email",
            message=f"Your verification code is: {verification_code}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Generate tokens
        user = serializer.instance
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Registration successful. Please verify your email.'
        }, status=status.HTTP_201_CREATED)

class VerifyEmailCodeView(APIView):
    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        if not email or not code:
            return Response({"error": "Email и код обязательны"}, status=status.HTTP_400_BAD_REQUEST)

        # try:
        #     user = User.objects.get(email=email)
        # except User.DoesNotExist:
        #     return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "User not found."}, status=404)

        if user.verification_code != code:
            return Response({"error": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.verification_code = None
        user.save()
        return Response({"message": "Email verified successfully!"}, status=status.HTTP_200_OK)

class ResendVerificationCodeView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=400)

        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "User not found"}, status=404)

        # Генерируем новый код
        verification_code = f"{random.randint(100000, 999999)}"
        user.verification_code = verification_code
        user.save()

        # Отправляем письмо
        send_mail(
            subject="Verify your email again",
            message=f"Your re-verification code is: {verification_code}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({"message": "Код повторно отправлен на почту!"}, status=200)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.full_name
        token['email'] = user.email
        return token

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

User = get_user_model()

class PasswordResetRequestView(APIView):
    """
    Запрос на сброс пароля: отправляет email со ссылкой на сброс.
    """
    def post(self, request):
        email = request.data.get("email")
        print("Received email:", email)

        if not email:
            return Response({"error": "Email is required"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        token = default_token_generator.make_token(user)

        # Используем BACKEND_URL вместо FRONTEND_URL
        reset_link = f"{settings.BACKEND_URL}/api/auth/password-reset-confirm/{token}/"

        send_mail(
            "Reset Password Request",
            f"Click the following link to reset your password: {reset_link}",
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "Reset link sent!"})


class PasswordResetConfirmView(APIView):
    """
    Подтверждение сброса пароля: обновляет пароль пользователя.
    """

    def post(self, request, token):
        email = request.data.get("email")
        new_password = request.data.get("password")

        if not email or not new_password:
            return Response({"error": "Email and password are required"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successful!"})

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")  # Получаем refresh-токен из запроса
            if not refresh_token:
                return Response({"error": "Refresh-токен не передан!"}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist()  # Добавляем токен в черный список
            return Response({"message": "Вы успешно вышли из аккаунта!"})
        except Exception as e:
            return Response({"error": f"Невозможно выполнить выход! {str(e)}"}, status=400)

class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]  # Убедитесь, что пользователь аутентифицирован

    def delete(self, request, format=None):
        user = request.user  # Получаем текущего аутентифицированного пользователя

        try:
            user.delete()  # Удаляем текущего пользователя
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)      

User = get_user_model()

class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Возвращает текущего аутентифицированного пользователя."""
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({
                "message": "Профиль успешно обновлен",
                "user": serializer.data
            }, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response({
                "message": "Ошибка валидации",
                "errors": e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "message": "Произошла ошибка при обновлении профиля",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]  # Убедитесь, что пользователь аутентифицирован
    def delete(self, request, format=None):
        user = request.user  # Получаем текущего аутентифицированного пользователя

        try:
            user.delete()  # Удаляем текущего пользователя
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']
            confirm_password = serializer.validated_data['confirm_password']
            
            # Проверяем, что новый пароль и подтверждение совпадают
            if new_password != confirm_password:
                return Response({"detail": "New password and confirm password do not match."}, status=status.HTTP_400_BAD_REQUEST)

            # Аутентификация с использованием текущего пароля
            user = authenticate(username=request.user.username, password=current_password)
            if user is None:
                return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

            # Меняем пароль пользователя
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True, context={'request': request})
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)