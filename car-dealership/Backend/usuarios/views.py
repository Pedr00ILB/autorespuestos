from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from django.utils import timezone
from .serializers import UsuarioSerializer

User = get_user_model()

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UsuarioSerializer

    def post(self, request, *args, **kwargs):
        # Forzar el renderizado de la respuesta como JSON
        request.accepted_renderer = JSONRenderer()
        
        try:
            # Hacer una copia mutable del QueryDict
            data = request.data.copy()
            
            # Si no se proporciona username, usar la parte antes del @ del email
            if 'username' not in data and 'email' in data:
                data['username'] = data.get('email').split('@')[0]
                
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                # El método create del serializador ya maneja la creación del usuario
                user = serializer.save()
                return Response({
                    'message': 'Usuario registrado exitosamente',
                    'user': self.serializer_class(user).data
                }, status=status.HTTP_201_CREATED)
            
            # Si hay errores de validación, devolverlos en formato JSON
            return Response({
                'error': 'Error de validación',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            # Capturar cualquier otro error y devolverlo en formato JSON
            return Response({
                'error': 'Error en el servidor',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(email=request.data.get('email'))
            user.last_login = timezone.now()
            user.save()
        return response

class CustomTokenRefreshView(TokenRefreshView):
    pass

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Sesión cerrada exitosamente"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Token inválido"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UsuarioSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
