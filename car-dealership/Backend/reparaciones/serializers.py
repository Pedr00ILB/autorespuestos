from rest_framework import serializers
from .models import Servicio, Reparacion, DetalleReparacion, HistorialEstadoReparacion
from carros.models import Carro
from carros.serializers import CarroSerializer
from usuarios.models import Cliente, Usuario
from usuarios.serializers import ClienteSerializer, EmpleadoSerializer

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio',
            'duracion_estimada',
            'imagen',
            'fecha_creacion'
        ]
        read_only_fields = ['id', 'fecha_creacion']

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a 0')
        return value

class DetalleReparacionSerializer(serializers.ModelSerializer):
    servicio_detalle = ServicioSerializer(read_only=True, source='servicio')
    servicio_id = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.all(),
        write_only=True,
        source='servicio'
    )

    class Meta:
        model = DetalleReparacion
        fields = [
            'id',
            'reparacion',
            'servicio',
            'servicio_detalle',
            'servicio_id',
            'costo',
            'fecha_ejecucion',
            'notas'
        ]
        read_only_fields = ['id', 'fecha_ejecucion']

    def validate_costo(self, value):
        if value <= 0:
            raise serializers.ValidationError('El costo debe ser mayor a 0')
        return value

class HistorialEstadoReparacionSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        required=False
    )

    class Meta:
        model = HistorialEstadoReparacion
        fields = [
            'id',
            'reparacion',
            'estado_anterior',
            'estado_nuevo',
            'fecha_cambio',
            'usuario',
            'notas'
        ]
        read_only_fields = ['id', 'fecha_cambio']

class ReparacionSerializer(serializers.ModelSerializer):
    vehiculo_detalle = CarroSerializer(read_only=True, source='vehiculo')
    vehiculo_id = serializers.PrimaryKeyRelatedField(
        queryset=Carro.objects.all(),
        write_only=True,
        source='vehiculo'
    )
    cliente_detalle = ClienteSerializer(read_only=True, source='cliente')
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        write_only=True,
        source='cliente'
    )
    detalles = DetalleReparacionSerializer(many=True, read_only=True)
    historial_estados = HistorialEstadoReparacionSerializer(many=True, read_only=True)

    class Meta:
        model = Reparacion
        fields = [
            'id',
            'cliente',
            'cliente_detalle',
            'cliente_id',
            'vehiculo',
            'vehiculo_detalle',
            'vehiculo_id',
            'servicios',
            'detalles',
            'historial_estados',
            'fecha_ingreso',
            'fecha_entrega',
            'estado',
            'descripcion_problema',
            'descripcion_solucion',
            'costo_total',
            'tecnico_asignado',
            'tecnico_asignado_detalle'
        ]
        read_only_fields = [
            'id',
            'fecha_ingreso',
            'fecha_entrega',
            'costo_total',
            'tecnico_asignado_detalle'
        ]
