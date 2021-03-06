from django.urls import path
from main import views

urlpatterns = [
    path('', views.index),
    path('donors/', views.GetDonorsPaginated.as_view()),
    path('donor/<int:serial>', views.GetDonor.as_view())
]