from django.urls import path
from .views import (
    CarroList,
    CarroDetail,
    CarroCreate,
    CarroUpdate,
    CarroDelete
)

urlpatterns = [
    path('', CarroList.as_view(), name='carro-list'),
    path('<int:id>/', CarroDetail.as_view(), name='carro-detail'),
    path('create/', CarroCreate.as_view(), name='carro-create'),
    path('<int:id>/update/', CarroUpdate.as_view(), name='carro-update'),
    path('<int:id>/delete/', CarroDelete.as_view(), name='carro-delete'),
]
