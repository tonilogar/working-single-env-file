# Usar una imagen oficial de Node.js 20-alpine como base
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto de la aplicación
#EXPOSE 3000 #Lo expongo desde docker-compose

# Comando para ejecutar nodemon en modo desarrollo
#CMD ["node", "bin/www"] #Loejecuto desde docker-compose

# Exponer el puerto de la aplicación
EXPOSE 3000

CMD ["node", "bin/www"]