from django.urls import path
from main import views

urlpatterns = [
    path('', views.index),

    path('donors/meta',
         views.get_donors_meta),

    path('donors/<int:x0>/<int:x1>/<int:y0>/<int:y1>',
         views.GetDonors.as_view()),

    path('donor/<int:serial>',
         views.GetDonorBySerial.as_view()),
]
