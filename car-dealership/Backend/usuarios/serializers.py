from rest_framework import serializers
from .models import Usuario, Perfil, Cliente, Empleado

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'email',
            'telefono',
            'fecha_nacimiento',
            'es_cliente',
            'es_empleado',
            'es_admin',
            'last_login',
            'date_joined',
            'is_active',
            'is_staff',
            'is_superuser'
        ]
        read_only_fields = [
            'id',
            'last_login',
            'date_joined',
            'is_active',
            'is_staff',
            'is_superuser'
        ]
        extra_kwargs = {
            'telefono': {'required': False, 'allow_null': True},
            'fecha_nacimiento': {'required': False, 'allow_null': True}
        }

    def validate(self, data):
        if not data.get('telefono'):
            data['telefono'] = ''
        return data

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = [
            'id',
            'usuario',
            'direccion',
            'foto_perfil',
            'fecha_creacion',
            'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']
        extra_kwargs = {
            'direccion': {'required': False, 'allow_null': True},
            'foto_perfil': {'required': False, 'allow_null': True}
        }

    def validate(self, data):
        if not data.get('direccion'):
            data['direccion'] = 'Sin dirección registrada'
        return data

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = [
            'id',
            'usuario',
            'preferencias',
            'historial_compras',
            'puntos_fidelidad'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'preferencias': {'required': False, 'allow_null': True}
        }

    def validate(self, data):
        if not data.get('preferencias'):
            data['preferencias'] = 'Sin preferencias registradas'
        return data

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = [
            'id',
            'usuario',
            'cargo',
            'fecha_contratacion',
            'especialidad'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'cargo': {'required': False, 'default': 'Empleado General'},
            'fecha_contratacion': {'required': False, 'allow_null': True},
            'especialidad': {'required': False, 'allow_null': True}
        }

    def validate(self, data):
        if not data.get('especialidad'):
            data['especialidad'] = 'Sin especialidad registrada'
        return data
