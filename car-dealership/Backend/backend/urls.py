"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
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
    
    # Perfil de usuario
    path('api/auth/me/', UserProfileView.as_view(), name='user_profile'),
    
    # Otras aplicaciones
    path('api/vehiculos/', include('carros.urls')),
    path('api/accesorios/', include('accesorios.urls')),
    path('api/usuarios/', include('usuarios.urls')),
    
    # DRF browsable API auth
    path('api-auth/', include('rest_framework.urls')),
]
