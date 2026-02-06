FROM node:25-alpine3.21 AS build

# Frontend Build stage
WORKDIR /usr/src/build

COPY . /usr/src/build

RUN npm i
RUN npm run build
RUN cp ./deploy-package.json ./dist/package.json
RUN cp ./dist/index.html ./dist/404.html
WORKDIR /usr/src/build/dist
RUN npm i

# Build final image
FROM node:25-alpine3.21 AS production
COPY --from=build /usr/src/build/dist /usr/src/app
WORKDIR /usr/src/app

EXPOSE 3000

# Start http-server server
CMD ["npm", "run", "serve"]
