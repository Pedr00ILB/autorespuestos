from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from usuarios.views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
    UserProfileView,
    RegistroUsuarioView
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/carros/', include('carros.urls')),
    path('api/piezas/', include('piezas.urls')),
    path('api/reparaciones/', include('reparaciones.urls')),
    path('api/devoluciones/', include('devoluciones.urls')),
    path('api/asesorias/', include('asesorias.urls')),
    path('api/accesorios/', include('accesorios.urls')),

    # Autenticación
    path('api/auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/verify/', CustomTokenRefreshView.as_view(), name='token_verify'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/me/', UserProfileView.as_view(), name='user_profile'),
    path('api/auth/registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
]

# Servir archivos multimedia en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
