from rest_framework import generics
from .models import Region, District
from .serializers import RegionSerializer, DistrictSerializer

class RegionListView(generics.ListAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class DistrictListView(generics.ListAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
