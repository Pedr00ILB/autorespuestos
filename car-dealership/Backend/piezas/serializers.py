from rest_framework import serializers
from .models import CategoriaPieza, Pieza, ComentarioPieza
from usuarios.models import Usuario
from usuarios.serializers import UsuarioSerializer

class CategoriaPiezaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaPieza
        fields = ['id', 'nombre', 'descripcion', 'imagen']
        read_only_fields = ['id']

class ComentarioPiezaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        write_only=True,
        source='usuario'
    )

    class Meta:
        model = ComentarioPieza
        fields = [
            'id',
            'pieza',
            'usuario',
            'usuario_id',
            'contenido',
            'calificacion',
            'fecha_creacion'
        ]
        read_only_fields = ['id', 'fecha_creacion']

    def validate_calificacion(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError('La calificación debe estar entre 0 y 5')
        return value

class PiezaSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    comentarios = ComentarioPiezaSerializer(many=True, read_only=True)

    class Meta:
        model = Pieza
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio',
            'stock',
            'imagen',
            'categoria',
            'categoria_nombre',
            'compatibilidad',
            'garantia',
            'comentarios',
            'fecha_creacion',
            'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a 0')
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError('El stock no puede ser negativo')
        return value

    def validate_garantia(self, value):
        if value < 0:
            raise serializers.ValidationError('La garantía debe ser un número positivo')
        return value
