FROM node:18 AS build
WORKDIR /app

COPY Escuela-Front/package*.json ./
RUN npm install -g @angular/cli
RUN npm install

COPY Escuela-Front/. .
RUN ng build --configuration=production

FROM nginx:alpine

# Cambiar el puerto donde escucha nginx
RUN sed -i 's/listen       80;/listen       8000;/' /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/Escuela-Front /usr/share/nginx/html

EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]
