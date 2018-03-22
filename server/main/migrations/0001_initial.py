# Generated by Django 2.0.2 on 2018-03-19 05:02

from django.db import migrations, models
import main.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Donor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('serial', models.CharField(db_index=True, max_length=100, unique=True)),
                ('order0', models.BigIntegerField(default=main.models.get_random_order)),
                ('order1', models.BigIntegerField(default=main.models.get_random_order)),
                ('order2', models.BigIntegerField(default=main.models.get_random_order)),
                ('order3', models.BigIntegerField(default=main.models.get_random_order)),
                ('date_added', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
