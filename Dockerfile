# Etapa 1: Compilar la aplicación Angular
FROM node:14 as build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install
RUN npm install -g @angular/cli@14
# Copia el resto del código fuente al contenedor
COPY . .

# Compila la aplicación Angular
RUN ng build --configuration docker --base-href ./ --aot --buildOptimizer

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
