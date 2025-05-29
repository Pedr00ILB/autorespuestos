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
        extra_kwargs = {
            'kilometraje': {'required': False, 'default': 0},
            'transmision': {'required': False, 'default': 'manual'},
            'combustible': {'required': False, 'default': 'gasolina'},
            'estado': {'required': False, 'default': 'usado'},
            'descripcion': {'required': False, 'allow_null': True},
            'imagen_principal': {'required': False, 'allow_null': True}
        }

    def validate_precio(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a 0')
        return value

    def validate_kilometraje(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError('El kilometraje no puede ser negativo')
        return value

    def validate(self, data):
        # Validaciones suaves que no bloquean
        if not data.get('descripcion'):
            data['descripcion'] = f"Carro {data.get('marca', 'desconocida')} {data.get('modelo', 'desconocido')}"
        return data
