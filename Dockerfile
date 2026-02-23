# Etapa 1: Compilar la aplicación Angular
FROM node:20 as build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm ci --legacy-peer-deps
# Copia el resto del código fuente al contenedor
COPY . .
ARG BUILD_CONFIGURATION=docker

# Compila la aplicación Angular
RUN npx ng build --configuration $BUILD_CONFIGURATION --base-href ./ --aot --optimization

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia el archivo de configuración de Nginx personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos generados por Angular en la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
