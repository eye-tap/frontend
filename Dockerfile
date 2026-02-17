FROM node:25-alpine3.21 AS build

# Frontend Build stage
WORKDIR /usr/src/build

COPY . /usr/src/build

RUN npm i
RUN npm run build
RUN cp ./dist/index.html ./dist/404.html

# Build final image
FROM nginx AS prod
COPY --from=build /usr/src/build/dist /usr/share/nginx/html
RUN sed -i 's/listen  .*/listen 3000;/g' /etc/nginx/conf.d/default.conf
EXPOSE 3000
