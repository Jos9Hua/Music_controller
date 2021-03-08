from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('join/', index, name='join'),
    path('info/', index, name='info'),
    path('create/', index, name='create'),
    path('room/<str:roomCode>/', index, name='room'),
]
