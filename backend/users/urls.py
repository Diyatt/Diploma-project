from django.urls import path
from users.views import RegisterView, UserProfileView, PasswordResetRequestView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import LoginView , LogoutView, UserUpdateView, UserDeleteView, ChangePasswordView, VerifyEmailCodeView, ResendVerificationCodeView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/verify-email/', VerifyEmailCodeView.as_view(), name='verify-email'),
    path('auth/resend-verification/', ResendVerificationCodeView.as_view(), name='resend_verification'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', UserProfileView.as_view(), name='user_profile'),
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('auth/password-reset-confirm/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('update-profile/', UserUpdateView.as_view(), name='update-profile'),
    path('users/delete/', UserDeleteView.as_view(), name='user-delete'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change-password'),
]
