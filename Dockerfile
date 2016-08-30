FROM debian:wheezy
MAINTAINER ezPAARSE Team <ezpaarse@couperin.org>

ENV DEBIAN_FRONTEND noninteractive

# install debian dependencies
RUN set -x \
  && apt-get update \
  && apt-get -y --no-install-recommends upgrade \
  # used by nvm for nodejs & npm install
  && apt-get -y --no-install-recommends install curl ca-certificates \
  # used by ezpaarse platforms, resources and middleware updates
	&& apt-get -y --no-install-recommends install git \
  # used by npm rebuild
  && apt-get -y --no-install-recommends install python make g++ \
  # clean apt-get cache to gain a few MB
	&& apt-get -y clean && rm -rf /var/lib/apt/lists/*

# install ezpaarse
COPY . /opt/ezpaarse
WORKDIR /opt/ezpaarse

ENV PATH /opt/ezpaarse/build/nvm/bin/latest:/opt/ezpaarse/bin:/opt/ezpaarse/node_modules/.bin:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin:/usr/local/sbin
RUN set -x \
	&& cd /opt/ezpaarse && make \
  # to free a few MB in the docker image
  # (ezpaarse-libs will be downladed again at next update from the admin->system menu)
  && rm -rf /opt/ezpaarse/build/ezpaarse-libs/ \
  # clear the npm cache
  && cd /opt/ezpaarse/node_modules && npm cache clear

# tells "jobs" and "logs" folders are volumes cause lot of temporary data are written there
# cf "when to use volumes"  http://www.projectatomic.io/docs/docker-image-author-guidance/
VOLUME /opt/ezpaarse/tmp
VOLUME /opt/ezpaarse/logs
VOLUME /opt/ezpaarse/platforms
VOLUME /opt/ezpaarse/middlewares
VOLUME /opt/ezpaarse/resources
VOLUME /opt/ezpaarse/exclusions

# ezmasterification fo ezpaarse
# see https://github.com/Inist-CNRS/ezmaster
# (no data directory)
RUN mkdir -p /opt/ezmaster/config/
RUN touch /opt/ezmaster/config/config.json
RUN ln -s /opt/ezmaster/config/config.json /opt/ezpaarse/config.local.json
#RUN ln -s ###path to your data directory### /opt/ezmaster/data
EXPOSE 3000

# run ezpaarse process
EXPOSE 59599
CMD ["ezpaarse", "start", "--no-daemon"]