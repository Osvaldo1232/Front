# Etapa 1: Build Angular
FROM node:18 AS build
WORKDIR /app

# Copiar los archivos de la carpeta Angular
COPY Escuela-Front/package*.json ./
RUN npm install
COPY Escuela-Front/ ./
RUN npm run build --prod

# Etapa 2: Servir con nginx
FROM nginx:alpine
COPY --from=build /app/dist/Escuela-Front /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
