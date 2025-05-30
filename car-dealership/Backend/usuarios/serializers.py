from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from .models import Usuario, Perfil, Cliente, Empleado

Usuario = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado para la autenticación JWT.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Agregar información adicional del usuario a la respuesta
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'nombre': self.user.get_full_name(),
        }
        
        return data

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

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    nombre = serializers.CharField(source='first_name')
    apellidos = serializers.CharField(source='last_name')
    telefono = serializers.CharField()
    fecha_nacimiento = serializers.DateField()
    
    class Meta:
        model = Usuario
        fields = [
            'email', 
            'password', 
            'nombre', 
            'apellidos', 
            'telefono', 
            'fecha_nacimiento',
            'es_cliente'
        ]
        extra_kwargs = {
            'es_cliente': {'default': True, 'required': False}
        }
    
    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value
    
    def create(self, validated_data):
        # Extraer campos adicionales
        password = validated_data.pop('password')
        
        # Crear el usuario
        user = Usuario.objects.create_user(
            username=validated_data['email'],  # Usar email como username
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            telefono=validated_data.get('telefono', ''),
            fecha_nacimiento=validated_data.get('fecha_nacimiento'),
            es_cliente=True,  # Por defecto es cliente
            es_empleado=False,
            es_admin=False,
            password=password  # Se encripta automáticamente
        )
        
        # Crear perfil por defecto
        Perfil.objects.create(usuario=user)
        
        # Si es cliente, crear registro en tabla Cliente
        if user.es_cliente:
            Cliente.objects.create(usuario=user)
            
        return user
