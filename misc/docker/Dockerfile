FROM debian:wheezy
MAINTAINER ezPAARSE Team <ezpaarse@couperin.org>

ENV DEBIAN_FRONTEND noninteractive

# install debian dependencies
RUN set -x \
  && apt-get -y update \
  && apt-get -y upgrade \
  # used by nvm for nodejs & npm install
  && apt-get -y install curl \
  # used by ezpaarse for updates
	&& apt-get -y install git \
  # used by npm rebuild
  && apt-get -y install python make g++ \
  # clean apt-get cache to gain a few MB
	&& apt-get -y clean && rm -rf /var/lib/apt/lists/*

# install ezpaarse
RUN set -x \
  # git clone ezpaarse source code so the source code will be able to auto-upgrade itself
  # through the admin user interface 
	&& git clone https://github.com/ezpaarse-project/ezpaarse.git /root/ezpaarse \
	&& cd /root/ezpaarse && make \
  # to free a few MB in the docker image
  # (ezpaarse-libs will be downladed again at next update from the admin->system menu)
  && rm -rf /root/ezpaarse/build/ezpaarse-libs/

# tells jobs and logs folder is a volume cause lot of temporary data are written
# cf "when to use volumes"  http://www.projectatomic.io/docs/docker-image-author-guidance/
VOLUME /root/ezpaarse/tmp/jobs
VOLUME /root/ezpaarse/logs

ENV PATH /root/ezpaarse/build/nvm/bin/latest:/root/ezpaarse/bin:/root/ezpaarse/node_modules/.bin:$PATH

CMD ["ezpaarse", "start", "--no-daemon"]

EXPOSE 59599
