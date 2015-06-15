FROM debian:wheezy
MAINTAINER ezPAARSE Team<ezpaarse@couperin.org>

RUN apt-get -y update && \
	apt-get -y install git curl make python gcc build-essential && \
	apt-get -y upgrade && \
	apt-get -y clean && \
	git clone https://github.com/ezpaarse-project/ezpaarse.git /root/ezpaarse && \
	cd /root/ezpaarse && make

ENV PATH /root/ezpaarse/build/nvm/bin/latest:/root/ezpaarse/bin:/root/ezpaarse/node_modules/.bin:$PATH

CMD ["ezpaarse", "start", "--no-daemon"]

EXPOSE 59599
