# Autenticación con Cookies HTTP-Only

Este documento describe los cambios realizados en el sistema de autenticación para usar cookies HTTP-Only en lugar de almacenar tokens en el localStorage.

## Cambios realizados

1. **Eliminación del manejo de tokens en el frontend**:
   - Se eliminó todo el código que almacenaba tokens en el `localStorage`.
   - Se actualizaron los hooks y componentes para no depender del almacenamiento local.

2. **Configuración de Axios**:
   - Se configuró Axios para incluir credenciales en todas las peticiones (`withCredentials: true`).
   - Se implementó el manejo de tokens CSRF para protección contra ataques CSRF.

3. **Manejo de sesiones**:
   - La autenticación ahora se maneja completamente mediante cookies HTTP-Only.
   - El backend es responsable de establecer y renovar las cookies de autenticación.

## Configuración requerida en el backend

Para que este sistema funcione correctamente, el backend debe estar configurado de la siguiente manera:

### 1. Configuración de CORS

Asegúrate de que tu backend permita credenciales y los orígenes correctos:

```python
# Ejemplo para Django
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Reemplaza con tu dominio de frontend
    "https://tudominio.com",
]
```

### 2. Configuración de cookies seguras

```python
# Configuración para cookies seguras (Django)
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True  # Solo en producción con HTTPS
SESSION_COOKIE_SAMESITE = 'Lax'  # o 'Strict' según sea necesario
CSRF_COOKIE_HTTPONLY = False  # Necesario para que Axios pueda leer el token CSRF
CSRF_COOKIE_SECURE = True  # Solo en producción con HTTPS
```

### 3. Endpoints requeridos

El backend debe implementar los siguientes endpoints:

- `POST /auth/token/` - Para iniciar sesión
- `POST /auth/token/refresh/` - Para renovar el token de acceso
- `POST /auth/logout/` - Para cerrar sesión
- `GET /auth/me/` - Para obtener la información del usuario actual
- `POST /auth/token/verify/` - Para verificar si el token es válido

## Flujo de autenticación

1. **Inicio de sesión**:
   - El frontend envía las credenciales a `/auth/token/`
   - El backend valida las credenciales y establece las cookies HTTP-Only
   - El frontend redirige al usuario a la página principal

2. **Solicitudes autenticadas**:
   - El navegador envía automáticamente las cookies con cada solicitud
   - El backend verifica las cookies y autentica al usuario

3. **Renovación de token**:
   - Si el token de acceso expira, el interceptor de Axios intentará renovarlo automáticamente
   - El backend debe manejar la renovación del token usando el refresh token de las cookies

4. **Cierre de sesión**:
   - El frontend llama a `/auth/logout/`
   - El backend elimina las cookies de autenticación

## Consideraciones de seguridad

- **CSRF Protection**: Se utiliza un token CSRF para proteger contra ataques CSRF.
- **Cookies HTTP-Only**: Las cookies de autenticación son HTTP-Only para prevenir ataques XSS.
- **Secure Flag**: Las cookies solo se envían a través de conexiones seguras (HTTPS).
- **SameSite**: Configurado para prevenir ataques CSRF.

## Pruebas

Para probar la autenticación:

1. Inicia sesión y verifica que se establezcan las cookies.
2. Navega por las rutas protegidas para asegurarte de que la autenticación funciona.
3. Cierra sesión y verifica que las cookies se eliminen.
4. Prueba a acceder a rutas protegidas sin autenticación para verificar la redirección al login.

## Solución de problemas

### Las cookies no se envían
- Verifica que `withCredentials: true` esté configurado en Axios.
- Asegúrate de que el backend permita el origen del frontend en CORS.
- Verifica que las cookies tengan el dominio correcto.

### Error 403 CSRF
- Asegúrate de que el token CSRF se esté enviando correctamente.
- Verifica que el backend esté configurado para aceptar el token CSRF.

### La sesión no persiste
- Verifica que las cookies tengan una fecha de expiración adecuada.
- Asegúrate de que las cookies no se estén eliminando prematuramente.

---

Este documento debe actualizarse si se realizan cambios en el flujo de autenticación o en la configuración del backend.
