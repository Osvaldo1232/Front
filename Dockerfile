# ==============================
# Etapa 1: Build de Angular
# ==============================
FROM node:20 AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY Escuela-Front/package*.json ./

# Instalar dependencias locales (incluye devDependencies)
RUN npm install

# Copiar todo el proyecto
COPY Escuela-Front/. .

# Construir la app usando la versión local del CLI
RUN npx ng build --configuration=production

# ==============================
# Etapa 2: Servir con Nginx
# ==============================
FROM nginx:alpine

# Copiar la app construida a Nginx
COPY --from=build /app/dist/Escuela-Front /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 8000
EXPOSE 8000

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
