# Etapa 1: Compilar la aplicación Angular
FROM node:18 AS build
WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Build producción
RUN ng build --configuration=production

# Etapa 2: Servir la app con NGINX
FROM nginx:alpine

# Copiar automáticamente la carpeta que contiene index.html
# El patrón */ significa que tomará cualquier subcarpeta dentro de dist/Escuela-Front
COPY --from=build /app/dist/Escuela-Front/* /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
