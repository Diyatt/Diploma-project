from django.db import models
from users.models import User
from products.models import Product


class Review(models.Model):
    product = models.ForeignKey(Product,  related_name='reviews' , on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} on {self.product.name} - {self.rating}★"



class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # Чтобы избежать дублирования

    def __str__(self):
        return f"{self.user.username}'s wishlist - {self.product.name}"
