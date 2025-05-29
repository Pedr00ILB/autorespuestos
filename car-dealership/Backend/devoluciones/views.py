from rest_framework import generics
from .models import Devolucion, HistorialEstadoDevolucion, DocumentoDevolucion
from .serializers import (
    DevolucionSerializer, HistorialEstadoDevolucionSerializer,
    DocumentoDevolucionSerializer
)

class DevolucionList(generics.ListAPIView):
    queryset = Devolucion.objects.all()
    serializer_class = DevolucionSerializer

class DevolucionDetail(generics.RetrieveAPIView):
    queryset = Devolucion.objects.all()
    serializer_class = DevolucionSerializer
    lookup_field = 'id'

class HistorialEstadoDevolucionList(generics.ListAPIView):
    queryset = HistorialEstadoDevolucion.objects.all()
    serializer_class = HistorialEstadoDevolucionSerializer

class HistorialEstadoDevolucionDetail(generics.RetrieveAPIView):
    queryset = HistorialEstadoDevolucion.objects.all()
    serializer_class = HistorialEstadoDevolucionSerializer
    lookup_field = 'id'

class DocumentoDevolucionList(generics.ListAPIView):
    queryset = DocumentoDevolucion.objects.all()
    serializer_class = DocumentoDevolucionSerializer

class DocumentoDevolucionDetail(generics.RetrieveAPIView):
    queryset = DocumentoDevolucion.objects.all()
    serializer_class = DocumentoDevolucionSerializer
    lookup_field = 'id'
