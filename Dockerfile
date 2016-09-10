FROM debian:wheezy
MAINTAINER ezPAARSE Team <ezpaarse@couperin.org>

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production
ENV PATH /opt/ezpaarse/build/nvm/bin/latest:/opt/ezpaarse/bin:/opt/ezpaarse/node_modules/.bin:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin:/usr/local/sbin

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

# build ezpaarse (install node, npm modules, clone sub git repositories ...)
ENV NVM_DIR "/opt/ezpaarse/build/nvm"
RUN make ; . /opt/ezpaarse/build/nvm/nvm.sh ; npm cache clear

# tells "jobs" and "logs" folders are volumes cause lot of temporary data are written there
# cf "when to use volumes"  http://www.projectatomic.io/docs/docker-image-author-guidance/
VOLUME /opt/ezpaarse/tmp
VOLUME /opt/ezpaarse/logs
VOLUME /opt/ezpaarse/platforms
VOLUME /opt/ezpaarse/middlewares
VOLUME /opt/ezpaarse/resources
VOLUME /opt/ezpaarse/exclusions

# ezmasterification of ezpaarse
# see https://github.com/Inist-CNRS/ezmaster
# (no data directory)
EXPOSE 3000
RUN mkdir -p /opt/ezmaster/config/
RUN cp /opt/ezpaarse/config.json /opt/ezmaster/config/config.json
RUN ln -s /opt/ezmaster/config/config.json /opt/ezpaarse/config.local.json

# run ezpaarse process
EXPOSE 59599
CMD ["ezpaarse", "start", "--no-daemon"]