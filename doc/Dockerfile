FROM node:16.14.0-alpine3.15 as build

RUN apk add git

WORKDIR /usr/src/ezpaarse/middlewares
RUN git clone https://github.com/ezpaarse-project/ezpaarse-middlewares.git ./middlewares

WORKDIR /usr/src/ezpaarse/doc
COPY . .
RUN npm install
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.21.6-alpine
COPY --from=build /usr/src/ezpaarse/doc/src/.vuepress/dist/ /usr/share/nginx/html/