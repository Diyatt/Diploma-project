import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review
from django.db.models import Avg

logger = logging.getLogger(__name__)

@receiver([post_save, post_delete], sender=Review)
def update_product_rating(sender, instance, **kwargs):
    product = instance.product
    average = product.reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
    product.average_rating = round(average, 1) if average else 0
    product.save()
    logger.info(f"Updated average rating for product {product.id} to {product.average_rating}")
