from django.urls import path, register_converter
from main import views, converters


register_converter(converters.SignedIntConverter, 'signed_int')


urlpatterns = [
    path('', views.index),

    path('donors/meta',
         views.get_donors_meta),

    path('donors/<signed_int:x0>/<signed_int:x1>/<signed_int:y0>/<signed_int:y1>',
         views.GetDonors.as_view()),

    path('donor/<signed_int:serial>',
         views.GetDonorBySerial.as_view()),
]
