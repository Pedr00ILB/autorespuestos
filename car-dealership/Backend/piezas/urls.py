from django.urls import path
from .views import (
    CategoriaPiezaList, CategoriaPiezaDetail,
    PiezaList, PiezaDetail,
    ComentarioPiezaList, ComentarioPiezaDetail
)

urlpatterns = [
    # Categorías
    path('categorias/', CategoriaPiezaList.as_view(), name='categoria-list'),
    path('categorias/<int:id>/', CategoriaPiezaDetail.as_view(), name='categoria-detail'),
    
    # Piezas
    path('', PiezaList.as_view(), name='pieza-list'),
    path('<int:id>/', PiezaDetail.as_view(), name='pieza-detail'),
    
    # Comentarios
    path('comentarios/', ComentarioPiezaList.as_view(), name='comentario-list'),
    path('comentarios/<int:id>/', ComentarioPiezaDetail.as_view(), name='comentario-detail'),
]
