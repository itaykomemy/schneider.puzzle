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
    serial = models.CharField(max_length=100, unique=True, db_index=True)
    order0 = models.BigIntegerField(default=get_random_order)    
    position_x = models.IntegerField(
        blank=False, null=False, db_index=True, default=0)
    position_y = models.IntegerField(
        blank=False, null=False, db_index=True, default=0)
    date_added = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (('position_x', 'position_y'),)

    def __str__(self):
        return self.first_name + ' ' + self.last_name


class DonorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'position_x', 'position_y', 'serial')


admin.site.register(Donor, DonorAdmin)


class DonorSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        return {
            'id': obj.id,
            'firstName': obj.first_name,
            'lastName': obj.last_name,
            'serial': obj.serial
        }
