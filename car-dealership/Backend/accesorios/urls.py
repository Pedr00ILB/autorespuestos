from django.urls import path
from .views import CategoriaList, CategoriaDetail, AccesorioList, AccesorioDetail

urlpatterns = [
    # Categorías
    path('categorias/', CategoriaList.as_view(), name='categoria-list'),
    path('categorias/<int:id>/', CategoriaDetail.as_view(), name='categoria-detail'),
    
    # Accesorios
    path('', AccesorioList.as_view(), name='accesorio-list'),
    path('<int:id>/', AccesorioDetail.as_view(), name='accesorio-detail'),
]
