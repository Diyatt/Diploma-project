from rest_framework import generics, filters, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage, Quality
from .serializers import CategorySerializer, ProductSerializer, ProductImageSerializer, QualitySerializer
from .filters import ProductFilter
from .permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import serializers



class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MyProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)
    def get_serializer_context(self):
        return {'request': self.request}

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Product.objects.filter(status='accepted')
    
    def perform_create(self, serializer):
        product = serializer.save(owner=self.request.user)
        
        files = self.request.FILES.getlist('images')
        if len(files) > 4:
            product.delete()  # cleanup the just-created product
            raise serializers.ValidationError("You can upload a maximum of 4 images.")

        for file in files:
            ProductImage.objects.create(product=product, image=file)

    def get_serializer_context(self):
        return {'request': self.request}

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related("owner").all()
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        instance.status = 'processing'
        instance.save(update_fields=['status'])
        return Response(serializer.data)

    def get_serializer_context(self):
        return {'request': self.request}


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Егер тек көру болса ғана views арттырамыз
        instance.views += 1
        instance.save(update_fields=['views'])

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class TopViewedProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        # Сұрыптау және фильтрацияны осында жасаймыз
        return Product.objects.filter(status='accepted').order_by('-views')[:6]
    

class DeleteProductImageView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def delete(self, request, pk, *args, **kwargs):
        try:
            image_instance = ProductImage.objects.get(id=pk)
            image_instance.delete()
            return Response({"detail": "Image deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response({"detail": "Image not found."}, status=status.HTTP_404_NOT_FOUND)


class UploadProductImageView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        image = request.FILES.get('image')

        if not product_id or not image:
            return Response({"detail": "Product and image are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product_instance = Product.objects.get(id=product_id)
        except ObjectDoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        if product_instance.images.count() >= 4:
            return Response({"detail": "Maximum of 4 images per product allowed."}, status=status.HTTP_400_BAD_REQUEST)

        product_image = ProductImage.objects.create(product=product_instance, image=image)
        serializer = ProductImageSerializer(product_image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class QualityListView(generics.ListAPIView):
    queryset = Quality.objects.all()
    serializer_class = QualitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductDeleteView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def delete(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.get(id=pk)
            self.check_object_permissions(request, product)
            product.delete()
            return Response({"detail": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)