from django.urls import path
from .views import TipoAsesoriaList, TipoAsesoriaDetail, AsesoriaList, AsesoriaDetail

urlpatterns = [
    # Tipos de Asesoría
    path('tipos/', TipoAsesoriaList.as_view(), name='tipo-list'),
    path('tipos/<int:id>/', TipoAsesoriaDetail.as_view(), name='tipo-detail'),
    
    # Asesorías
    path('', AsesoriaList.as_view(), name='asesoria-list'),
    path('<int:id>/', AsesoriaDetail.as_view(), name='asesoria-detail'),
]
