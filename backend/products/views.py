from rest_framework import generics, filters, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import NotFound, PermissionDenied, AuthenticationFailed
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .filters import ProductFilter

class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise AuthenticationFailed(detail="Требуется аутентификация", code=status.HTTP_401_UNAUTHORIZED)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        if obj is None:
            raise NotFound(detail="Продукт не найден", code=status.HTTP_404_NOT_FOUND)
        return obj
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_authenticated:
            raise AuthenticationFailed(detail="Требуется аутентификация", code=status.HTTP_401_UNAUTHORIZED)
        if request.user != instance.owner:
            raise PermissionDenied(detail="Вы не являетесь владельцем продукта", code=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_authenticated:
            raise AuthenticationFailed(detail="Требуется аутентификация", code=status.HTTP_401_UNAUTHORIZED)
        if request.user != instance.owner:
            raise PermissionDenied(detail="Вы не являетесь владельцем продукта", code=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
