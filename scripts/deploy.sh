#!/bin/bash

cd projects/saasdev-task
git stash
git pull
sudo docker compose down --volumes
sudo docker compose up --build -d