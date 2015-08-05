FROM debian:wheezy
MAINTAINER ezPAARSE Team <ezpaarse@couperin.org>

ENV DEBIAN_FRONTEND noninteractive

# install debian dependencies
USER root
RUN set -x \
  && apt-get update \
  && apt-get -y --no-install-recommends upgrade \
  # used by nvm for nodejs & npm install
  && apt-get -y --no-install-recommends install curl ca-certificates \
  # used by ezpaarse for updates
	&& apt-get -y --no-install-recommends install git \
  # used by npm rebuild
  && apt-get -y --no-install-recommends install python make g++ \
  # clean apt-get cache to gain a few MB
	&& apt-get -y clean && rm -rf /var/lib/apt/lists/*

# create a unix user for ezpaarse in order to run ezpaarse as a non-root user
RUN set -x \
  && groupadd -r ezpaarse -g 59599 \
  && useradd -u 59599 -r -g ezpaarse -d /opt/ezpaarse -s /sbin/nologin -c "ezpaarse docker image user" ezpaarse \
  && mkdir -p /opt/ezpaarse && chown -R ezpaarse:ezpaarse /opt/ezpaarse

# install ezpaarse
ENV PATH /opt/ezpaarse/build/nvm/bin/latest:/opt/ezpaarse/bin:/opt/ezpaarse/node_modules/.bin:$PATH
USER ezpaarse
RUN set -x \
  # git clone ezpaarse source code so the source code will be able to auto-upgrade itself
  # through the admin user interface 
  && cd /opt/ezpaarse && git clone https://github.com/ezpaarse-project/ezpaarse.git . \
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

# run ezpaarse process
EXPOSE 59599
CMD ["ezpaarse", "start", "--no-daemon"]