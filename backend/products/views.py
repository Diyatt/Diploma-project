from rest_framework import generics, filters, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import NotFound, PermissionDenied, AuthenticationFailed
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage
from .serializers import CategorySerializer, ProductSerializer
from .filters import ProductFilter
from .permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView

class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MyProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user)

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
        # Көп сурет жүктеу үшін:
        for file in self.request.FILES.getlist('images'):
            ProductImage.objects.create(product=product, image=file)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Егер тек көру болса ғана views арттырамыз
        instance.views += 1
        instance.save(update_fields=['views'])

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class TopViewedProductsView(APIView):
    def get(self, request):
        top_products = Product.objects.filter(status='accepted').order_by('-views')[:3]
        serializer = ProductSerializer(top_products, many=True)
        return Response(serializer.data)