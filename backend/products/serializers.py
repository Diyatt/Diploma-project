from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category_name']

class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'owner': {'read_only': True},
            'views': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def get_image(self, obj):
        if obj.image:
            return obj.image.build_url()  # 👈 CloudinaryField ішінен толық URL құру
        return None






