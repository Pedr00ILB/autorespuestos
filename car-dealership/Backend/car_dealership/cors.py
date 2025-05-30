from corsheaders.defaults import default_headers

# Configuración de CORS
CORS_ALLOW_ALL_ORIGINS = False  # Deshabilitar en producción
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js development server
    "http://127.0.0.1:3000",  # Alternative localhost
]

# Configuración para permitir credenciales
CORS_ALLOW_CREDENTIALS = True

# Headers permitidos
CORS_ALLOW_HEADERS = list(default_headers) + [
    'content-type',
    'authorization',
    'x-csrftoken',
    'accept',
    'accept-encoding',
    'x-requested-with',
]

# Métodos HTTP permitidos
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Headers expuestos al frontend
CORS_EXPOSE_HEADERS = [
    'content-type',
    'x-csrftoken',
    'authorization',
]

# Configuración adicional de seguridad
CORS_PREFLIGHT_MAX_AGE = 86400  # 1 día
CORS_ALLOW_PRIVATE_NETWORK = True
