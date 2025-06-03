# Guía de Despliegue Seguro

Esta guía proporciona instrucciones paso a paso para configurar y desplegar el backend de manera segura.

## Configuración Inicial

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Configuración de Django
DJANGO_SECRET_KEY=tu_clave_secreta_muy_larga_y_segura
DJANGO_DEBUG=False

# Configuración de base de datos (ejemplo para PostgreSQL)
DB_NAME=nombre_bd
DB_USER=usuario_bd
DB_PASSWORD=contraseña_bd
DB_HOST=localhost
DB_PORT=5432

# Configuración de correo electrónico
EMAIL_HOST=tu_servidor_smtp
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu_email
EMAIL_HOST_PASSWORD=tu_contraseña
```

### Configuración de Seguridad

1. **HSTS**: Ya está configurado en `settings.py` con:
   ```python
   SECURE_HSTS_SECONDS = 31536000  # 1 año
   SECURE_HSTS_INCLUDE_SUBDOMAINS = True
   SECURE_HSTS_PRELOAD = True
   ```

2. **SSL**: Asegúrate de tener un certificado SSL válido y configura tu servidor web (Nginx/Apache) para redirigir el tráfico HTTP a HTTPS.

3. **ALLOWED_HOSTS**: Actualiza en `settings.py` con tus dominios de producción.

## Grupos y Permisos

### Grupos por Defecto
El sistema incluye tres grupos por defecto:

1. **Administrador**: Acceso completo al sistema.
2. **Empleado**: Puede ver y modificar registros, pero no eliminarlos.
3. **Cliente**: Acceso limitado a su perfil y funcionalidades de cliente.

### Configuración Inicial
Para crear los grupos y permisos por defecto, ejecuta:

```bash
python manage.py shell < initial_data.py
```

## Despliegue

### Requisitos Previos
- Python 3.8+
- PostgreSQL / MySQL / SQLite (solo para desarrollo)
- pip
- virtualenv (recomendado)

### Pasos para el Despliegue

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd car-dealership/Backend
   ```

2. **Crear y activar entorno virtual**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar base de datos**
   - Crea una base de datos en tu servidor
   - Actualiza la configuración en `settings.py` o en el archivo `.env`

5. **Migraciones**
   ```bash
   python manage.py migrate
   ```

6. **Crear superusuario**
   ```bash
   python manage.py createsuperuser
   ```

7. **Recopilar archivos estáticos**
   ```bash
   python manage.py collectstatic
   ```

8. **Verificar configuración de seguridad**
   ```bash
   python manage.py check --deploy
   ```

## Mantenimiento

### Antes de cada despliegue
1. Hacer backup de la base de datos
2. Ejecutar pruebas
3. Verificar dependencias con `pip list --outdated`
4. Actualizar `requirements.txt` si es necesario
5. Ejecutar `python manage.py check --deploy`

### Tareas programadas
Configura un cron job o sistema similar para:
- Backups diarios
- Limpieza de sesiones expiradas
- Tareas de mantenimiento de la base de datos

## Solución de Problemas

### Errores Comunes
- **CSRF Token Error**: Verifica `CSRF_TRUSTED_ORIGINS` y `CORS_ALLOWED_ORIGINS`
- **Base de datos no accesible**: Verifica credenciales y que el servicio esté activo
- **Archivos estáticos no encontrados**: Ejecuta `collectstatic`

### Registros
Revisa los logs en:
- `/var/log/nginx/` (si usas Nginx)
- `/var/log/syslog`
- Los logs de tu servicio de aplicación (Gunicorn, uWSGI, etc.)

## Seguridad Adicional

1. **Firewall**: Configura reglas para permitir solo los puertos necesarios (80, 443, SSH).
2. **Fail2Ban**: Instálalo para proteger contra intentos de fuerza bruta.
3. **Actualizaciones**: Mantén el sistema operativo y paquetes actualizados.
4. **Monitoreo**: Configura alertas para actividad sospechosa.

## Soporte
Para problemas técnicos, contactar al equipo de desarrollo en soporte@tudominio.com
