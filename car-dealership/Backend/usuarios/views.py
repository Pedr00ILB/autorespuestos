from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from .serializers import RegistroUsuarioSerializer, CustomTokenObtainPairSerializer

Usuario = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtener tokens JWT.
    Extiende la vista estándar para incluir la configuración de cookies.
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        
        # Obtener el usuario autenticado
        user = serializer.user
        
        # Actualizar la última vez que el usuario inició sesión
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        # Obtener el refresh token
        refresh = RefreshToken.for_user(user)
        
        # Configurar la respuesta
        response = Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'nombre': user.get_full_name(),
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)
        
        # Configurar cookies HTTP-Only
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=str(refresh.access_token),
            expires=refresh.access_token.payload['exp'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
        )
        
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            expires=refresh['exp'],
            httponly=True,
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            path='/auth/token/refresh/'
        )
        
        return response

class CustomTokenRefreshView(TokenRefreshView):
    """
    Vista personalizada para refrescar tokens JWT.
    """
    def post(self, request, *args, **kwargs):
        # Obtener el refresh token de las cookies o del cuerpo de la solicitud
        refresh_token = request.COOKIES.get('refresh_token') or request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {'detail': 'No se proporcionó un token de actualización'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar el token
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            # Configurar la respuesta
            response = Response({
                'access': access_token,
            }, status=status.HTTP_200_OK)
            
            # Actualizar la cookie de acceso
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=refresh.access_token.payload['exp'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
            )
            
            return response
            
        except Exception as e:
            return Response(
                {'detail': 'Token de actualización inválido o expirado'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class LogoutView(APIView):
    """
    Vista para cerrar sesión.
    Invalida el token de actualización y elimina las cookies.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Obtener el refresh token de las cookies
            refresh_token = request.COOKIES.get('refresh_token')
            
            if refresh_token:
                # Invalidar el token de actualización
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Configurar la respuesta
            response = Response(
                {'detail': 'Sesión cerrada exitosamente'},
                status=status.HTTP_205_RESET_CONTENT
            )
            
            # Eliminar las cookies
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            response.delete_cookie('refresh_token')
            response.delete_cookie('csrftoken')
            
            return response
            
        except Exception as e:
            return Response(
                {'detail': 'Error al cerrar la sesión'},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserProfileView(APIView):
    """
    Vista para obtener el perfil del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'nombre': user.get_full_name(),
            'is_staff': user.is_staff,
            'is_active': user.is_active,
            'last_login': user.last_login,
            'date_joined': user.date_joined,
        })

class RegistroUsuarioView(APIView):
    """
    Vista para el registro de nuevos usuarios.
    Crea un nuevo usuario con los datos proporcionados.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, format=None):
        serializer = RegistroUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Iniciar sesión automáticamente después del registro
            refresh = RefreshToken.for_user(user)
            
            # Configurar la respuesta
            response = Response(
                {
                    'mensaje': 'Usuario registrado exitosamente.',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'nombre': user.get_full_name(),
                    },
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                status=status.HTTP_201_CREATED
            )
            
            # Configurar cookies HTTP-Only
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=str(refresh.access_token),
                expires=refresh.access_token.payload['exp'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
            )
            
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                expires=refresh['exp'],
                httponly=True,
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                path='/auth/token/refresh/'
            )
            
            return response
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
