FROM node:10.15.3
LABEL maintainer="ezPAARSE Team <ezpaarse@couperin.org>"

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_ENV production
ENV PATH /opt/ezpaarse/bin:/opt/ezpaarse/node_modules/.bin:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin:/usr/local/sbin

# install ezpaarse
COPY . /opt/ezpaarse
WORKDIR /opt/ezpaarse
RUN mkdir -p /opt/ezpaarse/logs

# minimal build of ezpaarse (install npm modules and build front)
RUN make node-modules build-nuxt ; npm cache clear --force

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
ENTRYPOINT [ "/opt/ezpaarse/docker-entrypoint.sh" ]
CMD ["ezpaarse", "start", "--no-daemon"]