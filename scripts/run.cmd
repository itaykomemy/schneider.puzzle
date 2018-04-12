#!/bin/bash

docker rm -f puzzle
docker run --name puzzle -p 8008:80 itayky/ourpuzzle:latest