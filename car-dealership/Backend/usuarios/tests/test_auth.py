from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthTests(APITestCase):
    """
    Pruebas para el sistema de autenticación.
    Incluye pruebas para registro y login de usuarios.
    """
    
    def setUp(self):
        # Configurar el cliente de prueba
        self.client = APIClient()
        
        # URLs de la API
        self.registro_url = reverse('registro_usuario')
        self.token_url = reverse('token_obtain_pair')
        
        # Crear un usuario de prueba
        self.usuario_prueba = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'telefono': '1234567890',
            'fecha_nacimiento': '1990-01-01',
            'password': 'testpassword123',
            'es_cliente': True,
            'es_empleado': False,
            'es_admin': False
        }
        
        # Crear el usuario en la base de datos
        self.user = User.objects.create_user(
            username=self.usuario_prueba['email'],
            email=self.usuario_prueba['email'],
            first_name=self.usuario_prueba['first_name'],
            last_name=self.usuario_prueba['last_name'],
            telefono=self.usuario_prueba['telefono'],
            fecha_nacimiento=self.usuario_prueba['fecha_nacimiento'],
            password=self.usuario_prueba['password'],
            es_cliente=self.usuario_prueba['es_cliente'],
            es_empleado=self.usuario_prueba['es_empleado'],
            es_admin=self.usuario_prueba['es_admin']
        )
    
    def test_registro_usuario_exitoso(self):
        """
        Verifica que un nuevo usuario pueda registrarse correctamente.
        """
        datos_registro = {
            'email': 'nuevo@example.com',
            'password': 'nuevopassword123',
            'nombre': 'Nuevo',
            'apellidos': 'Usuario',
            'telefono': '0987654321',
            'fecha_nacimiento': '1995-05-15',
            'es_cliente': True
        }
        
        # Realizar la petición de registro
        response = self.client.post(
            self.registro_url, 
            datos_registro, 
            format='json'
        )
        
        # Verificar la respuesta
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data['mensaje'], 
            'Usuario registrado exitosamente.'
        )
        
        # Verificar que el usuario fue creado en la base de datos
        self.assertTrue(
            User.objects.filter(email=datos_registro['email']).exists()
        )
    
    def test_login_exitoso(self):
        """
        Verifica que un usuario registrado pueda iniciar sesión correctamente.
        """
        datos_login = {
            'email': self.usuario_prueba['email'],
            'password': self.usuario_prueba['password']
        }
        
        # Realizar la petición de login
        response = self.client.post(
            self.token_url, 
            datos_login, 
            format='json'
        )
        
        # Verificar la respuesta
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        
        # Verificar que se devuelve la información del usuario
        self.assertIn('user', response.data)
        self.assertEqual(
            response.data['user']['email'], 
            self.usuario_prueba['email']
        )
        
    def test_login_credenciales_invalidas(self):
        """
        Verifica que no se pueda iniciar sesión con credenciales incorrectas.
        """
        datos_login_invalidos = {
            'email': self.usuario_prueba['email'],
            'password': 'contrasenaincorrecta'
        }
        
        # Realizar la petición de login con contraseña incorrecta
        response = self.client.post(
            self.token_url, 
            datos_login_invalidos, 
            format='json'
        )
        
        # Verificar que la respuesta es un error de autenticación
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # Verificar que hay un mensaje de error (puede variar según la configuración)
        self.assertIn('detail', response.data)
        # Verificar que el mensaje de error indica credenciales inválidas
        self.assertIn('credenciales', str(response.data['detail']).lower())
