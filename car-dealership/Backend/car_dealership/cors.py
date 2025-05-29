from corsheaders.defaults import default_headers

CORS_ALLOW_ALL_ORIGINS = True  # Para desarrollo
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",  # Descomentar para producción
# ]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + [
    'contenttype',
]
