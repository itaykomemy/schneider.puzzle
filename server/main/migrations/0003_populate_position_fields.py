
# Generated by Django 2.0.2 on 2018-05-06 18:01

from django.db import migrations
import math


def spread_pieces(apps, schema_editor):
    Donor = apps.get_model('main', 'Donor')
    donors = Donor.objects.all()
    donor_count = donors.count()
    length = math.ceil(math.sqrt(donor_count))
    countery = counterx = 0
    for donor in donors:
        if counterx > length:
            counterx = 0
            countery += 1

        donor.position_x = counterx
        donor.position_y = countery

        counterx += 1
        donor.save()


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_add_position_fields'),
    ]

    operations = [
        migrations.RunPython(spread_pieces),
    ]
