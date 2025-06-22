#!/bin/bash

docker compose -p automatized-restapi -f docker-compose.prod.yml up --build
