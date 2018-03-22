from faker import Faker
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from main.models import Donor


class Command(BaseCommand):
    help = 'Populates the db with random data'

    def add_arguments(self, parser):
        parser.add_argument('how_many', type=int)

    @transaction.atomic
    def handle(self, *args, **options):
        count = options['how_many']
        if count < 1 or count > 1000000:
            raise CommandError("You are out of range")

        deleted = Donor.objects.all().count()
        Donor.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(
            'Cleared %s entries' % deleted))

        fake = Faker()
        donors = []
        for i in range(0, count):
            faked_name = fake.name().split(' ')
            donor = Donor(
                first_name=faked_name[0],
                last_name=faked_name[1],
                serial=i)
            donors.append(donor)

        Donor.objects.bulk_create(donors)
        self.stdout.write(self.style.SUCCESS(
            'Successfully created %s entries' % count))
