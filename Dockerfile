
# Dockerizing MongoDB: Dockerfile for building MongoDB images
# Based on ubuntu:16.04, installs MongoDB following the instructions from:
# http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

FROM       ubuntu:16.04

# Installation:
# Import MongoDB public GPG key AND create a MongoDB list file
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu $(cat /etc/lsb-release | grep DISTRIB_CODENAME | cut -d= -f2)/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# Update apt-get sources AND install MongoDB
RUN apt-get update 
RUN apt-get install -y mongodb-org
RUN apt-get install -y wget curl python
RUN apt-get install -y mongodb 
RUN apt-get install -y supervisor
RUN touch /etc/supervisor/conf.d/mongo.conf

# Create the MongoDB data directory
RUN mkdir -p /data/db

# Expose port #27017 from the container to the host
EXPOSE 5000

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

#-----------------------------------------------------------------------------------------------------

ADD . /tf_tracker
WORKDIR /tf_tracker
RUN ./helpers/install.sh
# RUN cat ./supervisor.conf > /etc/supervisor/conf.d/mongo.conf
# RUN service supervisor start && supervisorctl reload && supervisorctl update
RUN npm run webpack
RUN chmod +x
# RUN /usr/bin/mongod

# Run server
ENTRYPOINT ["./helpers/start.sh"]
