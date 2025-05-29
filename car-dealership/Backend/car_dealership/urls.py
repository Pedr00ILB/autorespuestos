from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/carros/', include('carros.urls')),
    path('api/piezas/', include('piezas.urls')),
    path('api/reparaciones/', include('reparaciones.urls')),
    path('api/devoluciones/', include('devoluciones.urls')),
    path('api/asesorias/', include('asesorias.urls')),
    path('api/accesorios/', include('accesorios.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
