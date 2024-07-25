# Usar una imagen oficial de Node.js 20-alpine como base
# Usar una imagen oficial de Node.js como base
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
#EXPOSE 3001 #Lo expongo desde docker-compose

# Comando para ejecutar nodemon en modo desarrollo
# CMD ["npm", "run", "dev"] #Loejecuto desde docker-compose
