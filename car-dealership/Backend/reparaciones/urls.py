from django.urls import path
from .views import (
    ServicioList, ServicioDetail,
    ReparacionList, ReparacionDetail,
    DetalleReparacionList, DetalleReparacionDetail,
    HistorialEstadoReparacionList, HistorialEstadoReparacionDetail
)

urlpatterns = [
    # Servicios
    path('servicios/', ServicioList.as_view(), name='servicio-list'),
    path('servicios/<int:id>/', ServicioDetail.as_view(), name='servicio-detail'),
    
    # Reparaciones
    path('', ReparacionList.as_view(), name='reparacion-list'),
    path('<int:id>/', ReparacionDetail.as_view(), name='reparacion-detail'),
    
    # Detalles de Reparación
    path('detalles/', DetalleReparacionList.as_view(), name='detalle-list'),
    path('detalles/<int:id>/', DetalleReparacionDetail.as_view(), name='detalle-detail'),
    
    # Historial de Estados
    path('historial/', HistorialEstadoReparacionList.as_view(), name='historial-list'),
    path('historial/<int:id>/', HistorialEstadoReparacionDetail.as_view(), name='historial-detail'),
]
