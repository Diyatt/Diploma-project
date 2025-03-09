from django.contrib import admin
from .models import User
from .models import Region
from .models import District
from .models import Category
from .models import Product
from .models import Wishlist
from .models import Chat
from .models import Message

# Register your models here.

admin.site.register(User)
admin.site.register(Region)
admin.site.register(District)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Wishlist)
admin.site.register(Chat)
admin.site.register(Message)
