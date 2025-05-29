from rest_framework import generics
from .models import Categoria, Accesorio
from .serializers import CategoriaSerializer, AccesorioSerializer

class CategoriaList(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetail(generics.RetrieveAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    lookup_field = 'id'

class AccesorioList(generics.ListAPIView):
    queryset = Accesorio.objects.all()
    serializer_class = AccesorioSerializer

class AccesorioDetail(generics.RetrieveAPIView):
    queryset = Accesorio.objects.all()
    serializer_class = AccesorioSerializer
    lookup_field = 'id'
