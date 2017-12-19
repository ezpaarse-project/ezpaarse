FROM node:8.6.0
MAINTAINER ezPAARSE Team <ezpaarse@couperin.org>

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production
ENV PATH /opt/ezpaarse/bin:/opt/ezpaarse/node_modules/.bin:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin:/usr/local/sbin

# install debian dependencies
RUN set -x \
  && apt-get update \
  # used by npm (rebuild)
  && apt-get -y --no-install-recommends install build-essential python make g++ curl ca-certificates \
  # used by ezpaarse platforms, resources and middleware updates
	&& apt-get -y --no-install-recommends install git \
  # clean apt-get cache to gain a few MB
	&& apt-get -y clean && rm -rf /var/lib/apt/lists/*

# install ezpaarse npm dependencies
COPY ./package.json /opt/ezpaarse/
COPY ./bower.json   /opt/ezpaarse/
COPY ./.bowerrc     /opt/ezpaarse/
WORKDIR /opt/ezpaarse
RUN npm install --no-save -q --unsafe-perm

# copy source code and install data dependencies
COPY . /opt/ezpaarse
RUN make platforms-update middlewares-update exclusions-update resources-update
RUN make checkconfig

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
ENTRYPOINT [ "./docker-entrypoint.sh" ]