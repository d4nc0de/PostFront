# Etapa 1: Construcción de la aplicación
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install -g @angular/cli@20 \
    && npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto por defecto de ng serve
EXPOSE 4200

# Comando para iniciar la aplicación
CMD ["ng", "serve", "--host", "0.0.0.0"]