FROM node:lts-alpine AS dependencies
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci

FROM node:lts-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build:typecheck

FROM nginx:latest AS prod
COPY --from=build /app/build/client /usr/share/nginx/html
COPY ./nginx/nginx.conf  /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443
