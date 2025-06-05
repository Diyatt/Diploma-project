from openai import OpenAI
import json
from django.conf import settings
from products.models import Product
from products.models import Category
from django.db.models import Q

def ask_gpt(user_query: str) -> dict:
    """Запрашивает у GPT категорию и ключевые слова."""

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """You are an intelligent assistant for a rental web application. 
                Your job is to understand the user's intent and extract useful search data from their queries.
                
                There are two types of queries:
                You must analyze the user's message and identify their **intent**. There are two types of user requests:
                1. 'search': When the user clearly wants to find/rent a product.
                2. 'advice': When the user is describing a situation, problem, or asking for suggestions (without directly mentioning a product).

                Return this JSON:
                {
                    "intent": "search" | "advice",
                    "category": "...",  # optional
                    "keywords": [...],  # optional
                    "advice_text": "..."  # only if intent == "advice"
                }
                """
            },
            {"role": "user", "content": user_query},
        ]
    )
    try:
        print("[GPT RAW OUTPUT]", response.choices[0].message.content)
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"[GPT Parse Error] {e}")
        return {"category": "", "keywords": []}

def search_items(category: str, keywords: list):
    try:
        print(f"[SEARCH] Start search: category='{category}', keywords={keywords}")
        queryset = Product.objects.filter(status='accepted')
        print(f"[SEARCH] Initial queryset count: {queryset.count()}")

        # if category:
        #     categories = Category.objects.filter(category_name__icontains=category)
        #     queryset = queryset.filter(category__in=categories)
        #
        # if keywords:
        #     keyword_filter = Q()
        #     for keyword in keywords:
        #         keyword_filter |= Q(name__icontains=keyword) | Q(description__icontains=keyword)
        #     queryset = queryset.filter(keyword_filter)
        #
        # return queryset.distinct()[:5]
        # Добавим фильтр по ключевым словам (в name, description, и category.category_name)

        if keywords:
            keyword_filter = Q()
            for keyword in keywords:
                keyword_filter |= Q(name__icontains=keyword)
                keyword_filter |= Q(description__icontains=keyword)
                keyword_filter |= Q(category__category_name__icontains=keyword)
            queryset = queryset.filter(keyword_filter)
            print(f"[SEARCH] After keyword filtering: {queryset.count()} results")

        # Также отдельно фильтр по category (например, если GPT вернул конкретную категорию)

        final_results = queryset.distinct()[:5]
        print(f"[SEARCH] Final results count: {final_results.count()}")
        return final_results

    except Exception as e:
        print(f"Search error: {e}")
        return Product.objects.none()

def ask_gpt_for_advice(user_query: str) -> dict:
    """Gets a contextual advice if no products were found for the user's query."""
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",

        messages=[
            {
                "role": "system",
                "content": """You are a smart assistant for a rental web service.
                The user has entered a query but no matching products were found.
                Your job is to provide a helpful suggestion related to the user's intent – such as alternative rental ideas, relevant categories, or general guidance based on the context.
                
                Return this JSON:
                {
                  "advice_text": "..."  // A helpful, user-friendly suggestion
                }
                """
            },
            {"role": "user", "content": user_query},
        ]
    )

    try:
        return json.loads(response.choices[0].message.content.strip())
    except Exception as e:
        print(f"[GPT ADVICE ERROR] {e}")
        return {"advice_text": "Try rephrasing your request or contact support for help."}


def get_fallback_products(category: str, limit:int = 3):
    """Получить альтернативные товары, если основной поиск ничего не дал."""
    if category:
        return Product.objects.filter(category__category_name__icontains=category).order_by('-created_at')[:limit]
    return Product.objects.all().order_by('-average_rating')[:limit]  # или по рейтингу