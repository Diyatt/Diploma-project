from rest_framework.views import APIView
from rest_framework import generics
from users.models import User
from users.serializers import UserSerializer, ChangePasswordSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from .serializers import UserUpdateSerializer
from django.contrib.auth import get_user_model

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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