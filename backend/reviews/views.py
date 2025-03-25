from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product, Review
from .serializers import ReviewSerializer
from django.db.models import Avg
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from .models import Wishlist
from .serializers import WishlistSerializer
from rest_framework import generics, permissions




class ProductReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        # Проверка: уже оставил отзыв?
        if Review.objects.filter(user=request.user, product=product).exists():
            return Response({"error": "Вы уже оставили отзыв на этот товар."}, status=400)

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            Review.objects.create(
                product=product,
                user=request.user,
                rating=serializer.validated_data['rating'],
                comment=serializer.validated_data['comment']
            )

            # Пересчёт среднего рейтинга
            return Response({"message": "Отзыв успешно добавлен!"}, status=201)
        return Response(serializer.errors, status=400)

    def update_average_rating(self, product):
        avg_rating = Review.objects.filter(product=product).aggregate(Avg('rating'))['rating__avg']
        product.average_rating = round(avg_rating, 1)
        product.save()


class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response({"error": "Отзыв не найден или у вас нет прав"}, status=404)

        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            self.update_average_rating(review.product)
            return Response({"message": "Отзыв обновлён!"})
        return Response(serializer.errors, status=400)

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response({"error": "Отзыв не найден или у вас нет прав"}, status=404)

        product = review.product
        review.delete()
        self.update_average_rating(product)
        return Response({"message": "Отзыв удалён!"}, status=200)

    def update_average_rating(self, product):
        avg_rating = Review.objects.filter(product=product).aggregate(Avg('rating'))['rating__avg'] or 0
        product.average_rating = round(avg_rating, 1)
        product.save()

class ReviewListView(ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product']


class WishlistListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(wishlist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product_id=product_id)

        if not created:
            return Response({"message": "Product already in wishlist"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(WishlistSerializer(wishlist_item).data, status=status.HTTP_201_CREATED)


class WishlistModifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        wishlist_item = Wishlist.objects.filter(user=request.user, product_id=product_id).first()

        if not wishlist_item:
            return Response({"error": "Product not in wishlist"}, status=status.HTTP_404_NOT_FOUND)

        wishlist_item.delete()
        return Response({"message": "Product removed from wishlist"}, status=status.HTTP_204_NO_CONTENT)