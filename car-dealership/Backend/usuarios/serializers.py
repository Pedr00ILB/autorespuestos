from rest_framework import serializers
from .models import Usuario, Perfil, Cliente, Empleado

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'password2',
            'first_name',
            'last_name',
            'telefono',
            'fecha_nacimiento',
            'es_cliente',
            'es_empleado',
            'es_admin',
            'last_login',
            'date_joined',
            'is_active',
        ]
        read_only_fields = [
            'id',
            'last_login',
            'date_joined',
            'is_active',
            'es_cliente',
            'es_empleado',
            'es_admin'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2', None):
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

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
