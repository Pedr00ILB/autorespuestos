from django.urls import path
from .views import (
    DevolucionList, DevolucionDetail,
    HistorialEstadoDevolucionList, HistorialEstadoDevolucionDetail,
    DocumentoDevolucionList, DocumentoDevolucionDetail
)

urlpatterns = [
    # Devoluciones
    path('', DevolucionList.as_view(), name='devolucion-list'),
    path('<int:id>/', DevolucionDetail.as_view(), name='devolucion-detail'),
    
    # Historial de Estados
    path('historial/', HistorialEstadoDevolucionList.as_view(), name='historial-list'),
    path('historial/<int:id>/', HistorialEstadoDevolucionDetail.as_view(), name='historial-detail'),
    
    # Documentos
    path('documentos/', DocumentoDevolucionList.as_view(), name='documento-list'),
    path('documentos/<int:id>/', DocumentoDevolucionDetail.as_view(), name='documento-detail'),
]
