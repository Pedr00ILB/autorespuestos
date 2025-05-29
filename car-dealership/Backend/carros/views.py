from rest_framework import generics
from .models import Carro
from .serializers import CarroSerializer

class CarroList(generics.ListAPIView):
    queryset = Carro.objects.all()
    serializer_class = CarroSerializer

class CarroDetail(generics.RetrieveAPIView):
    queryset = Carro.objects.all()
    serializer_class = CarroSerializer
    lookup_field = 'id'
