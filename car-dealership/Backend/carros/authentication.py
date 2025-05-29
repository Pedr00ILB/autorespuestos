from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from usuarios.models import Usuario

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Agregar información adicional al token
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        
        return token

class CustomTokenObtainPairView(TokenObtainPairSerializer):
    serializer_class = CustomTokenObtainPairSerializer
