## Obtener el directorio donde se encuentra el script
#$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
#Set-Location -Path $scriptDir
#
## Definir la lista de directorios de frontend
#$frontendDirs = @("frontend_copernicus_tools", "frontend_lidar", "frontend_03", "frontend_04", "frontend_05")
#
## Definir la ruta del archivo fuente
#$sourceFile = ".env"
#
## Copiar el archivo .env a cada directorio de frontend en la lista
#foreach ($dir in $frontendDirs) {
#    $destinationFile = Join-Path -Path $dir -ChildPath $sourceFile
#    Copy-Item -Path $sourceFile -Destination $destinationFile -Force
#}
#Solucionado el acceder a las variables las mapeo en docker-compose directamente
# Limpiar contenedores, imágenes, redes y volúmenes de Docker
docker container prune -f
docker image prune -f
docker network prune -f
docker volume prune -f

# Reiniciar Docker Compose
docker-compose down
docker-compose build
docker-compose up
