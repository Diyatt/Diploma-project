from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from .utils import ask_gpt, search_items, ask_gpt_for_advice, get_fallback_products
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from products.serializers import ProductSerializer


class ChatBotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_query = request.data.get("query", "").strip()
        user = request.user

        if not user_query:
            return Response(
                {"error": "Empty request."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            # 1. Обращение к GPT
            gpt_data = ask_gpt(user_query)
            intent = gpt_data.get("intent", "search")
            category = gpt_data.get("category", "")
            keywords = gpt_data.get("keywords", [])
            advice_text = gpt_data.get("advice_text", "")

            # Предустановим переменные, чтобы избежать ошибки

            # Ответ
            if intent == "search":
                products = search_items(category, keywords)
                if products.exists():
                    # Формируем список найденных товаров
                    response_text = f"Found {products.count()} alternatives:\n" + "\n".join(
                        [f"- {p.name} ({p.price} ₸/day): {'http://localhost:3000/product'}/{p.id}" for p in products]
                    )

                else:
                    # Товары не найдены, но можно дать совет из advice_text
                    if advice_text:
                        response_text = f"Unfortunately, no matching products found. Here's some advice for you:\n{advice_text}"

                    else:
                        # Если advice_text пустой —   # (опционально)
                        advice_data = ask_gpt_for_advice(user_query)
                        response_text = advice_data.get("advice_text", "No products found and no advice available.")

                    products = get_fallback_products(category)
                    if products.exists():
                        response_text += "\n\nYou might also be interested in:\n" + "\n".join(
                            [f"- {p.name} ({p.price} ₸/day): {'http://localhost:3000/product'}/{p.id}" for p in products]
                        )
                # Сохраняем и возвращаем
                chat_message = ChatMessage.objects.create(user=user, query=user_query, response=response_text)
                chat_message.products.set(products)
                serializer = ProductSerializer(products, many=True)
                return Response({"response": response_text, "products": serializer.data})

            elif intent == "advice":
                # Просто выдаем совет
                response_text = advice_text or "Here's some general advice."
                chat_message = ChatMessage.objects.create(user=user, query=user_query, response=response_text)
                chat_message.products.set([])
                return Response({
                    "response": response_text,
                    "products": []
                })

            # Если intent неизвестен
            return Response({
                "response": "Unrecognized request type.",
                "products": []
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            ChatMessage.objects.create(
                user=user,
                query=user_query,
                response=f"Error: {str(e)}"
            )
            return Response(
                {"error": f"Error has occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChatHistoryView(ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(user=self.request.user).order_by('-created_at')
