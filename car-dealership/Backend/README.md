# Backend - Sistema de Concesionario de Autos

Este es el backend del sistema de gestión para el concesionario de autos, construido con Django y Django REST framework.

## Requisitos

- Python 3.8+
- Django 4.2+
- Django REST framework
- djangorestframework-simplejwt
- django-cors-headers

## Instalación

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd car-dealership/Backend
   ```

2. Crea un entorno virtual y actívalo:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configura las variables de entorno:
   Crea un archivo `.env` en la carpeta `Backend` con las siguientes variables:
   ```
   SECRET_KEY=tu_clave_secreta_aqui
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

5. Aplica las migraciones:
   ```bash
   python manage.py migrate
   ```

6. Crea un superusuario:
   ```bash
   python manage.py createsuperuser
   ```

7. Inicia el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```

## Estructura del Proyecto

- `car_dealership/` - Configuración principal del proyecto
- `usuarios/` - Aplicación de gestión de usuarios y autenticación
- `carros/` - Aplicación de gestión de vehículos
- `piezas/` - Aplicación de gestión de repuestos
- `reparaciones/` - Aplicación de gestión de servicios de reparación
- `devoluciones/` - Aplicación de gestión de devoluciones
- `asesorias/` - Aplicación de gestión de asesorías
- `accesorios/` - Aplicación de gestión de accesorios

## Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación, con las siguientes características:

- **Login**: `POST /api/auth/token/`
- **Refresh Token**: `POST /api/auth/token/refresh/`
- **Verificar Token**: `POST /api/auth/verify/`
- **Logout**: `POST /api/auth/logout/`
- **Perfil de Usuario**: `GET /api/auth/me/`
- **Registro**: `POST /api/auth/registro/`

### Configuración de Cookies

- **Access Token**: Almacenado en una cookie HTTP-Only
- **Refresh Token**: Almacenado en una cookie HTTP-Only
- **CSRF Protection**: Utiliza tokens CSRF para protección contra ataques

## Configuración de CORS

El backend está configurado para permitir solicitudes desde el frontend. La configuración se encuentra en `car_dealership/cors.py`.

## Variables de Entorno

- `SECRET_KEY`: Clave secreta de Django
- `DEBUG`: Modo de depuración (True/False)
- `ALLOWED_HOSTS`: Lista de hosts permitidos separados por comas
- `DATABASE_URL`: URL de conexión a la base de datos (opcional)

## Despliegue

Para producción, asegúrate de:

1. Configurar `DEBUG=False`
2. Configurar `ALLOWED_HOSTS` correctamente
3. Configurar una base de datos segura (PostgreSQL recomendado)
4. Configurar un servidor web (Nginx + Gunicorn recomendado)
5. Configurar SSL/TLS para conexiones seguras

## Pruebas

Para ejecutar las pruebas:

```bash
python manage.py test
```

## Documentación de la API

La documentación de la API está disponible en `/api/docs/` cuando el servidor está en modo desarrollo.

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.
