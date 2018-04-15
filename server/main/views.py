from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import status

from main.models import Donor, DonorSerializer

from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


class GetDonorsPaginated(ListAPIView):
    queryset = Donor.objects.all().order_by('order1')
    serializer_class = DonorSerializer
    pagination_class = LimitOffsetPagination


class GetDonor(APIView):
    def get(self, request, serial):
        try:
            donor = Donor.objects.get(serial=serial)
            serializer = DonorSerializer(donor)
            return Response(serializer.data)
        except Donor.DoesNotExist:
            return Response(status=400, data={
                'message': 'Not found'
            })
