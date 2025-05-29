from rest_framework import generics
from .models import CategoriaPieza, Pieza, ComentarioPieza
from .serializers import CategoriaPiezaSerializer, PiezaSerializer, ComentarioPiezaSerializer

class CategoriaPiezaList(generics.ListAPIView):
    queryset = CategoriaPieza.objects.all()
    serializer_class = CategoriaPiezaSerializer

class CategoriaPiezaDetail(generics.RetrieveAPIView):
    queryset = CategoriaPieza.objects.all()
    serializer_class = CategoriaPiezaSerializer
    lookup_field = 'id'

class PiezaList(generics.ListAPIView):
    queryset = Pieza.objects.all()
    serializer_class = PiezaSerializer

class PiezaDetail(generics.RetrieveAPIView):
    queryset = Pieza.objects.all()
    serializer_class = PiezaSerializer
    lookup_field = 'id'

class ComentarioPiezaList(generics.ListAPIView):
    queryset = ComentarioPieza.objects.all()
    serializer_class = ComentarioPiezaSerializer

class ComentarioPiezaDetail(generics.RetrieveAPIView):
    queryset = ComentarioPieza.objects.all()
    serializer_class = ComentarioPiezaSerializer
    lookup_field = 'id'
