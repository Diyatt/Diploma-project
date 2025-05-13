from rest_framework import serializers
from .models import Category, Product, ProductImage, Quality
from reviews.models import Wishlist


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()  # Переопределяем image

    class Meta:
        model = Category
        fields = ['id', 'category_name', 'created_at', 'image']  # убрали 'url'

    def get_image(self, obj):
        return obj.image.build_url() if obj.image else None


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'url']

    def get_url(self, obj):
        return obj.image.build_url() if obj.image else None


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    district_name = serializers.CharField(source='district.name', read_only=True)
    region_name = serializers.CharField(source='region.name', read_only=True)
    owner_phone = serializers.SerializerMethodField()
    quality = serializers.CharField(source='quality.quality_type', read_only=True)  # 🔁 атауын шығарамыз
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'  # Барлық өрісті аламыз, бірақ қосымша readable атауларды да қосамыз
        extra_kwargs = {
            'owner': {'read_only': True},
            'views': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'status': {'read_only': True},
        }

    def get_owner_phone(self, obj):
        return getattr(obj.owner, 'phone_number', None)

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, product=obj).exists()
        return False


class QualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Quality
        fields = ['id', 'quality_type']


