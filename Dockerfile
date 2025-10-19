FROM node:18 AS build
WORKDIR /app

COPY Escuela-Front/package*.json ./
RUN npm install -g @angular/cli
RUN npm install

COPY Escuela-Front/. .
RUN ng build --configuration=production

FROM nginx:alpine

# Copiar la configuración personalizada de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar la app Angular
COPY --from=build /app/dist/Escuela-Front /usr/share/nginx/html

EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]
