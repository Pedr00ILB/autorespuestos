from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Carro
from .serializers import CarroSerializer
from .permissions import IsOwnerOrAdmin
from usuarios.permisos import EsAdmin

class CarroList(generics.ListAPIView):
    queryset = Carro.objects.all()
    serializer_class = CarroSerializer
    permission_classes = [IsAuthenticated]

class CarroDetail(generics.RetrieveAPIView):
    queryset = Carro.objects.all()
    serializer_class = CarroSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]

class CarroCreate(generics.CreateAPIView):
    queryset = Carro.objects.all()
    serializer_class = CarroSerializer
    permission_classes = [IsAuthenticated, EsAdmin]

    def perform_create(self, serializer):
        # Agregamos el usuario que crea el carro
        serializer.save(creado_por=self.request.user)

class CarroUpdate(generics.UpdateAPIView):
    queryset = Carro.objects.all()
    serializer_class = CarroSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def perform_update(self, serializer):
        # Agregamos el usuario que actualiza el carro
        instance = serializer.save(actualizado_por=self.request.user)
        return Response(serializer.data)

class CarroDelete(generics.DestroyAPIView):
    queryset = Carro.objects.all()
    serializer_class = CarroSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def perform_destroy(self, instance):
        # Agregamos el usuario que elimina el carro
        instance.eliminado_por = self.request.user
        instance.save()
        instance.delete()
