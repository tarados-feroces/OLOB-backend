#!/usr/bin/env bash

for f in $(ls ./src | grep -v -e "node_modules" -e "dist" -e "deploy.sh" -e ".idea" -e ".git")
do
    scp -r ./src/$f danchetto@130.193.34.42:/home/danchetto/backend/src
done
