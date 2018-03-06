from django.contrib import admin
from django.db import models
from rest_framework import serializers
import random

MAX_INT = 2 ** 63 - 1
MIN_INT = -(2 ** 63)


def get_random_order():
    return random.randint(MIN_INT, MAX_INT)


class Donor(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    order0 = models.BigIntegerField(default=get_random_order)
    order1 = models.BigIntegerField(default=get_random_order)
    order2 = models.BigIntegerField(default=get_random_order)
    order3 = models.BigIntegerField(default=get_random_order)
    date_added = models.DateTimeField(auto_now=True)

    def get_order_column_name(self, num=0):
        return 'order' + (num % 4)

    def __str__(self):
        return self.first_name + ' ' + self.last_name


admin.site.register(Donor)


class DonorSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        return {
            'id': obj.id,
            'firstName': obj.first_name,
            'lastName': obj.last_name,
        }
