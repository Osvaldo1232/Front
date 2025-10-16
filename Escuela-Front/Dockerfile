# Etapa 1: Compilar la aplicación Angular
FROM node:18 AS build

# Trabajamos en la carpeta Angular
WORKDIR /app/Escuela-Front

# Copiamos solo las dependencias primero
COPY Escuela-Front/package*.json ./
RUN npm install -g @angular/cli
RUN npm install

# Copiamos el resto del código fuente
COPY Escuela-Front/ ./

# Compilamos la app en producción
RUN ng build --configuration=production

# Etapa 2: Servir la app con NGINX
FROM nginx:alpine

# Copiamos la carpeta generada de build al contenedor de NGINX
COPY --from=build /app/Escuela-Front/dist/Escuela-Front/* /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Iniciamos NGINX
CMD ["nginx", "-g", "daemon off;"]
