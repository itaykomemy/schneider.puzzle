FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
RUN python3 /code/manage.py collectstatic --noinput
EXPOSE 8000/tcp
RUN chmod +x /code/scripts/start.sh
ENTRYPOINT /code/scripts/start.sh