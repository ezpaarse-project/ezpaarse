FROM debian:jessie
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

# ezmasterification of ezpaarse
# see https://github.com/Inist-CNRS/ezmaster
# (no data directory)
RUN cp /opt/ezpaarse/config.json /opt/ezpaarse/config.local.json
RUN echo '{ \
  "httpPort": 59599, \
  "configPath": "/opt/ezpaarse/config.local.json" \
}' > /etc/ezmaster.json

# run ezpaarse process
EXPOSE 59599
CMD ["ezpaarse", "start", "--no-daemon"]