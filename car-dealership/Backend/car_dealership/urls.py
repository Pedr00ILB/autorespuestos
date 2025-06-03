from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenVerifyView
from usuarios.views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
    UserRegistrationView,
    UserProfileView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Autenticación
    path('api/auth/register/', UserRegistrationView.as_view(), name='register'),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/me/', UserProfileView.as_view(), name='user_profile'),
    
    # API endpoints
    path('api/carros/', include('carros.urls')),
    path('api/piezas/', include('piezas.urls')),
    path('api/reparaciones/', include('reparaciones.urls')),
    path('api/devoluciones/', include('devoluciones.urls')),
    path('api/asesorias/', include('asesorias.urls')),
    path('api/accesorios/', include('accesorios.urls')),
    
    # DRF browsable API auth
    path('api-auth/', include('rest_framework.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
