from rest_framework import serializers
from .models import TipoAsesoria, Asesoria
from usuarios.models import Cliente, Empleado
from usuarios.serializers import ClienteSerializer, EmpleadoSerializer

class TipoAsesoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAsesoria
        fields = [
            'id',
            'nombre',
            'descripcion',
            'duracion_estimada',
            'precio'
        ]
        read_only_fields = ['id']

    def validate_precio(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a 0')
        return value

class AsesoriaSerializer(serializers.ModelSerializer):
    cliente_detalle = ClienteSerializer(read_only=True, source='cliente')
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        write_only=True,
        source='cliente'
    )
    tipo_asesoria_detalle = TipoAsesoriaSerializer(read_only=True, source='tipo_asesoria')
    tipo_asesoria_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoAsesoria.objects.all(),
        write_only=True,
        source='tipo_asesoria'
    )
    asesor_detalle = EmpleadoSerializer(read_only=True, source='asesor')
    asesor_id = serializers.PrimaryKeyRelatedField(
        queryset=Empleado.objects.all(),
        write_only=True,
        source='asesor',
        required=False
    )

    class Meta:
        model = Asesoria
        fields = [
            'id',
            'cliente',
            'cliente_detalle',
            'cliente_id',
            'tipo_asesoria',
            'tipo_asesoria_detalle',
            'tipo_asesoria_id',
            'asesor',
            'asesor_detalle',
            'asesor_id',
            'estado',
            'fecha_solicitud',
            'fecha_programada',
            'fecha_inicio',
            'fecha_fin',
            'duracion_real',
            'descripcion',
            'resultado',
            'calificacion',
            'comentarios'
        ]
        read_only_fields = [
            'id',
            'fecha_solicitud',
            'fecha_inicio',
            'fecha_fin',
            'duracion_real',
            'calificacion'
        ]

    def validate_calificacion(self, value):
        if value is not None and (value < 0 or value > 5):
            raise serializers.ValidationError('La calificación debe estar entre 0 y 5')
        return value
