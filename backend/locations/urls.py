from django.urls import path
from .views import RegionListView, DistrictListView

urlpatterns = [
    path('regions/', RegionListView.as_view(), name='region-list'),
    path('districts/', DistrictListView.as_view(), name='district-list'),
]
