from rest_framework import serializers
from .models import Carro

class CarroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carro
        fields = [
            'id',
            'marca',
            'modelo',
            'año',
            'precio',
            'kilometraje',
            'transmision',
            'combustible',
            'estado',
            'descripcion',
            'imagen_principal',
            'fecha_creacion',
            'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a 0')
        return value

    def validate_kilometraje(self, value):
        if value < 0:
            raise serializers.ValidationError('El kilometraje no puede ser negativo')
        return value
