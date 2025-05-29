from rest_framework import serializers
from .models import Devolucion, HistorialEstadoDevolucion, DocumentoDevolucion
from usuarios.models import Cliente, Usuario
from piezas.models import Pieza
from carros.models import Carro
from usuarios.serializers import ClienteSerializer
from piezas.serializers import PiezaSerializer
from carros.serializers import CarroSerializer

class DocumentoDevolucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentoDevolucion
        fields = [
            'id',
            'devolucion',
            'archivo',
            'descripcion',
            'fecha_creacion'
        ]
        read_only_fields = ['id', 'fecha_creacion']

class HistorialEstadoDevolucionSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        required=False
    )

    class Meta:
        model = HistorialEstadoDevolucion
        fields = [
            'id',
            'devolucion',
            'estado_anterior',
            'estado_nuevo',
            'fecha_cambio',
            'usuario',
            'notas'
        ]
        read_only_fields = ['id', 'fecha_cambio']

class DevolucionSerializer(serializers.ModelSerializer):
    cliente_detalle = ClienteSerializer(read_only=True, source='cliente')
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        write_only=True,
        source='cliente'
    )
    producto_devuelto_detalle = PiezaSerializer(read_only=True, source='producto_devuelto')
    producto_devuelto_id = serializers.PrimaryKeyRelatedField(
        queryset=Pieza.objects.all(),
        write_only=True,
        source='producto_devuelto',
        required=False
    )
    vehiculo_devuelto_detalle = CarroSerializer(read_only=True, source='vehiculo_devuelto')
    vehiculo_devuelto_id = serializers.PrimaryKeyRelatedField(
        queryset=Carro.objects.all(),
        write_only=True,
        source='vehiculo_devuelto',
        required=False
    )
    documentos = DocumentoDevolucionSerializer(many=True, read_only=True)
    historial_estados = HistorialEstadoDevolucionSerializer(many=True, read_only=True)

    class Meta:
        model = Devolucion
        fields = [
            'id',
            'cliente',
            'cliente_detalle',
            'cliente_id',
            'tipo',
            'motivo',
            'estado',
            'fecha_solicitud',
            'fecha_resolucion',
            'monto',
            'producto_devuelto',
            'producto_devuelto_detalle',
            'producto_devuelto_id',
            'vehiculo_devuelto',
            'vehiculo_devuelto_detalle',
            'vehiculo_devuelto_id',
            'comentario',
            'documentos',
            'historial_estados'
        ]
        read_only_fields = [
            'id',
            'fecha_solicitud',
            'fecha_resolucion',
            'monto',
            'documentos',
            'historial_estados'
        ]

    def validate_monto(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError('El monto debe ser mayor a 0')
        return value
