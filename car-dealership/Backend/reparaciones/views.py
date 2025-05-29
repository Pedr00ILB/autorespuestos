from rest_framework import generics
from .models import Servicio, Reparacion, DetalleReparacion, HistorialEstadoReparacion
from .serializers import (
    ServicioSerializer, ReparacionSerializer,
    DetalleReparacionSerializer, HistorialEstadoReparacionSerializer
)

class ServicioList(generics.ListAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

class ServicioDetail(generics.RetrieveAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    lookup_field = 'id'

class ReparacionList(generics.ListAPIView):
    queryset = Reparacion.objects.all()
    serializer_class = ReparacionSerializer

class ReparacionDetail(generics.RetrieveAPIView):
    queryset = Reparacion.objects.all()
    serializer_class = ReparacionSerializer
    lookup_field = 'id'

class DetalleReparacionList(generics.ListAPIView):
    queryset = DetalleReparacion.objects.all()
    serializer_class = DetalleReparacionSerializer

class DetalleReparacionDetail(generics.RetrieveAPIView):
    queryset = DetalleReparacion.objects.all()
    serializer_class = DetalleReparacionSerializer
    lookup_field = 'id'

class HistorialEstadoReparacionList(generics.ListAPIView):
    queryset = HistorialEstadoReparacion.objects.all()
    serializer_class = HistorialEstadoReparacionSerializer

class HistorialEstadoReparacionDetail(generics.RetrieveAPIView):
    queryset = HistorialEstadoReparacion.objects.all()
    serializer_class = HistorialEstadoReparacionSerializer
    lookup_field = 'id'
