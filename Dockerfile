FROM node:lts as build-stage-admin-local
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY ./ .
RUN yarn build

FROM nginx as production-stage-admin-local
RUN mkdir /app
COPY .env /app
COPY --from=build-stage-admin-local /app/dist /app
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf