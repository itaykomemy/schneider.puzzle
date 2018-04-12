FROM python:3
ENV PYTHONUNBUFFERED 1

# Install required packages and remove the apt packages cache when done.
RUN apt-get update && \
    apt-get install -y \
	nginx \
	supervisor && \
    rm -rf /var/lib/apt/lists/*

# install uwsgi now because it takes a little while
RUN pip install uwsgi

# COPY requirements.txt and RUN pip install BEFORE adding the rest of your code, this will cause Docker's caching mechanism
# to prevent re-installing (all your) dependencies when you made a change a line or two in your app.
COPY server/requirements.txt /home/docker/code/app/
RUN pip install -r /home/docker/code/app/requirements.txt

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx-app.conf /etc/nginx/sites-available/default
COPY supervisor-app.conf /etc/supervisor/conf.d/

# add (the rest of) our code
COPY server/ /home/docker/code/app/
COPY supervisor-app.conf uwsgi.ini uwsgi_params docker-entrypoint.sh /home/docker/code/

# Copy UI build
COPY ui/build /home/docker/static/ui

ENV DB_PATH /home/docker/db/
RUN mkdir -p /home/docker/db/

EXPOSE 80

ENTRYPOINT ["/home/docker/code/docker-entrypoint.sh"]
