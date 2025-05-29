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
