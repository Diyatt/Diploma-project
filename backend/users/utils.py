import random
from django.core.mail import send_mail
import os

def generate_verification_code():
    return str(random.randint(100000, 999999))

def send_verification_email(email, code):
    subject = "Подтверждение регистрации"
    message = f"Ваш код подтверждения: {code}"
    send_mail(subject, message, os.getenv('EMAIL_HOST_USER'), [email])
