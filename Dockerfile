# build stage
FROM node:lts-alpine as build-stage
RUN apk add g++ make py3-pip
WORKDIR /app
COPY src/package*.json ./
RUN npm install --force
COPY src .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]