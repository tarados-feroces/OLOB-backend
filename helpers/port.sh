#!/usr/bin/env bash

sudo netstat -nlp | grep :5000
sudo netstat -nlp | grep :27017
ps -ef | grep node
