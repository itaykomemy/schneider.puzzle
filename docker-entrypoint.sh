#!/bin/bash

echo "Apply database migrations"
python /home/docker/code/app/manage.py migrate
echo "Collect static files"
python /home/docker/code/app/manage.py collectstatic --noinput
supervisord -n