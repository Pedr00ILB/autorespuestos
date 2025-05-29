from rest_framework import generics
from .models import TipoAsesoria, Asesoria
from .serializers import TipoAsesoriaSerializer, AsesoriaSerializer

class TipoAsesoriaList(generics.ListAPIView):
    queryset = TipoAsesoria.objects.all()
    serializer_class = TipoAsesoriaSerializer

class TipoAsesoriaDetail(generics.RetrieveAPIView):
    queryset = TipoAsesoria.objects.all()
    serializer_class = TipoAsesoriaSerializer
    lookup_field = 'id'

class AsesoriaList(generics.ListAPIView):
    queryset = Asesoria.objects.all()
    serializer_class = AsesoriaSerializer

class AsesoriaDetail(generics.RetrieveAPIView):
    queryset = Asesoria.objects.all()
    serializer_class = AsesoriaSerializer
    lookup_field = 'id'
