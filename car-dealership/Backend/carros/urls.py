from django.urls import path
from .views import CarroList, CarroDetail

urlpatterns = [
    path('', CarroList.as_view(), name='carro-list'),
    path('<int:id>/', CarroDetail.as_view(), name='carro-detail'),
]
