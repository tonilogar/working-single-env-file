FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Ejecutar la construcción para producción
RUN npm run build

# Exponer el puerto que usará Vite
#EXPOSE 5174

# Comando para iniciar Vite en modo desarrollo
#CMD ["npm", "run", "dev"]

# Exponer el puerto que usará Vite
EXPOSE 5174

# Comando para iniciar Vite en modo producción
CMD ["npx", "serve", "-s", "dist"]