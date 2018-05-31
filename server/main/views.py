from django.db.models import Max, Min
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from main.models import Donor, DonorSerializer


def index(request):
    return render(request, 'index.html')


@api_view(http_method_names=['GET'])
def get_donors_meta(request):
    agg = Donor.objects.all().aggregate

    return Response({
        'x': agg(min=Min('position_x'), max=Max('position_x')),
        'y': agg(min=Min('position_y'), max=Max('position_y'))
    })


class GetDonors(ListAPIView):
    model = Donor
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer

    def get_queryset(self):
        x0 = self.kwargs.get('x0')
        x1 = self.kwargs.get('x1')
        y0 = self.kwargs.get('y0')
        y1 = self.kwargs.get('y1')

        return self.queryset.filter(
            position_x__gte=x0, position_x__lte=x1,
            position_y__gte=y0, position_y__lte=y1
        )


class GetDonorBySerial(RetrieveAPIView):
    queryset = Donor.objects
    serializer_class = DonorSerializer
    lookup_field = 'serial'
