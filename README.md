# Proyecto Docker con Autenticación Auth0 y Gestión de Variables de Entorno

## Intención del Repositorio

1. **Trabajar con un solo fichero `.env`:**
   El proyecto está configurado en un entorno Docker con diferentes contenedores y utiliza un solo fichero `.env`. El fichero `.env` está alojado en el directorio raíz del proyecto, junto con `docker-compose.yml`. `Docker-compose` lee el fichero `.env` y administra las variables a los contenedores correspondientes, solucionando de esta manera la necesidad de múltiples ficheros `.env` para cada contenedor.

2. **Enviar datos de manera segura del backend al frontend:**
   Protege las URLs para que no sean accesibles sin el token necesario y al mismo tiempo evita la lectura de los datos escribiendo directamente las URLs en el navegador.

3. **Utilizar Auth0 externamente para la creación y validación de usuarios:**
   La autenticación y validación de usuarios se maneja externamente utilizando Auth0.

## Estructura del Proyecto

Primero, estos tres puntos se implementarán en el contenedor `backend_auth` que consta de un backend (puerto 3000) y un frontend para que el usuario cree o valide su usuario.

Una vez completado este paso, se implementará en:

- Un contenedor de una API REST básica.
- Un contenedor de un frontend realizado con VITE.

## Estructura de Archivos

