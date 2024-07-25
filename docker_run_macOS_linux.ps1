#!/bin/bash

# Obtener el directorio donde se encuentra el script
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Definir las rutas de origen y destino
source_file="$script_dir/.env"
destination_dir="$script_dir/frontend"
destination_file="$destination_dir/.env"

# Copiar el archivo, sobrescribiendo si ya existe
cp -f "$source_file" "$destination_file"

# Limpiar contenedores, imágenes, redes y volúmenes de Docker
docker container prune -f
docker image prune -f
docker network prune -f
docker volume prune -f

# Reiniciar Docker Compose
docker-compose down
docker-compose build
docker-compose up
