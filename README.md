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

## PRODUCCIÓN ##

# Proceso DevOps para Desplegar la Aplicación en Oracle Cloud

Este documento describe los pasos y las herramientas necesarias para desplegar la aplicación en **Oracle Cloud** utilizando **Terraform** y **GitHub Actions** como parte de un proceso de **CI/CD**.

## 1. Configuración Inicial del Proyecto
- **Repositorio GitHub**: Asegúrate de que tu código esté en un repositorio de GitHub.
  - Herramientas: **Git**, **GitHub**.

## 2. Configuración de Terraform para la Infraestructura
- **Terraform**: Define la infraestructura como código para desplegar la aplicación en Oracle Cloud.
  - En el archivo `main.tf`, definimos los recursos necesarios, como:
    - **Container Instances** para ejecutar los contenedores Docker.
    - **Load Balancer** para manejar el tráfico HTTPS.
    - **SSL Certificates** para la seguridad de las conexiones.

```hcl
provider "oci" {
  # Configura el proveedor de Oracle Cloud con tus credenciales.
}

resource "oci_containerinstances_instance" "my_instance" {
  # Configuración de contenedores.
}
Herramienta: Terraform.
3. Configuración de GitHub Actions para CI/CD
GitHub Actions: Automatiza el proceso de Integración Continua (CI) y Despliegue Continuo (CD).
Define un archivo .yml en el directorio .github/workflows/ para ejecutar pruebas, aplicar Terraform y desplegar la aplicación.
Puedes configurar diferentes workflows para las ramas de desarrollo (develop) y producción (main).
GitHub Secrets: Almacena de forma segura las variables sensibles (como claves API) y accede a ellas en los workflows.
Ejemplo básico de archivo .yml:
yaml
Copiar código
name: CI/CD Pipeline

on:
  push:
    branches:
      - develop
      - main
  pull_request:
    branches:
      - develop
      - main

jobs:
  deploy:
    runs-on: ubuntu





Tú dijiste:
hazlo de nuevo por favoe, perdona las molestias
ChatGPT Plus
ChatGPT
No hay problema, aquí tienes el resumen en formato Markdown correcto en una sola entrada como lo pediste:

markdown
Copiar código
# Proceso DevOps para Desplegar la Aplicación en Oracle Cloud

Este documento describe los pasos y herramientas necesarias para desplegar la aplicación en **Oracle Cloud** utilizando **Terraform** y **GitHub Actions** como parte de un proceso de **CI/CD**.

## 1. Configuración Inicial del Proyecto
- **Repositorio GitHub**: Asegúrate de que tu código esté en un repositorio de GitHub.
  - Herramientas: **Git**, **GitHub**.

## 2. Configuración de Terraform para la Infraestructura
- **Terraform**: Define la infraestructura como código para desplegar la aplicación en Oracle Cloud.
  - En el archivo `main.tf`, definimos los recursos necesarios, como:
    - **Container Instances** para ejecutar los contenedores Docker.
    - **Load Balancer** para manejar el tráfico HTTPS.
    - **SSL Certificates** para la seguridad de las conexiones.

### Ejemplo básico de archivo `main.tf`:
```hcl
provider "oci" {
  tenancy_ocid     = "<tenancy_ocid>"
  user_ocid        = "<user_ocid>"
  fingerprint      = "<fingerprint>"
  private_key_path = "<path_to_private_key>"
  region           = "<region>"
}

resource "oci_containerinstances_instance" "my_instance" {
  display_name   = "my-container-instance"
  compartment_id = "<compartment_ocid>"
  availability_domain = "<availability_domain>"

  container {
    name = "my-container"
    image_url = "docker.io/myrepository/myimage:latest"
    ports {
      container_port = 80
      host_port      = 80
      protocol       = "TCP"
    }

    environment_variables = {
      "AUTH0_CLIENT_ID"     = "<your_auth0_client_id>"
      "AUTH0_CLIENT_SECRET" = "<your_auth0_client_secret>"
    }
  }
}

## Herramienta: Terraform.

## 3. Configuración de GitHub Actions para CI/CD

**GitHub Actions**: Automatiza el proceso de **Integración Continua (CI)** y **Despliegue Continuo (CD)**.

- Define un archivo `.yml` en el directorio `.github/workflows/` para ejecutar pruebas, aplicar **Terraform** y desplegar la aplicación.
- Puedes configurar diferentes workflows para las ramas de desarrollo (`develop`) y producción (`main`).

**GitHub Secrets**: Almacena de forma segura las variables sensibles (como claves API) y accede a ellas en los workflows.

### Ejemplo básico de archivo `.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - develop
      - main
  pull_request:
    branches:
      - develop
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Terraform
      uses: hashicorp/setup-terraform@v1

    - name: Initialize Terraform
      run: terraform init

    - name: Apply Terraform
      run: terraform apply -auto-approve
      env:
        TF_VAR_auth0_client_id: ${{ secrets.AUTH0_CLIENT_ID }}
        TF_VAR_auth0_client_secret: ${{ secrets.AUTH0_CLIENT_SECRET }}

##Herramienta: GitHub Actions.


## 4. Gestión de Certificados SSL y Load Balancer

**SSL/TLS Certificates**: Utiliza **Let's Encrypt** o un servicio similar para obtener los certificados SSL.  
**Terraform** se encarga de configurar el **Load Balancer** con los certificados SSL para habilitar HTTPS.

**Herramientas**: Let's Encrypt, Terraform.

## 5. Implementación del Entorno de Desarrollo y Producción

### Desarrollo:
- Haces **push** o **pull request** a la rama `develop`.
- **GitHub Actions** ejecuta pruebas automáticas y puede desplegar tu aplicación en un entorno de **staging** o desarrollo para probar.

### Producción:
- Haces un **pull request** desde `develop` a `main` o `production`.
- **GitHub Actions** ejecuta **Terraform** para desplegar tu aplicación en **Oracle Cloud** (subir la aplicación a la nube).

## 6. Monitoreo y Mantenimiento

**Monitoreo**: Usa **OCI Monitoring** para monitorear la salud de los contenedores y recursos en Oracle Cloud.  
**Alertas**: Configura alertas en caso de que haya problemas de rendimiento o fallos en la infraestructura.

## Resumen de Herramientas Utilizadas

- **GitHub**: Control de versiones y repositorio del código.
- **Terraform**: Gestión de la infraestructura como código (para instancias de contenedores, load balancer, etc.).
- **GitHub Actions**: Automatización del CI/CD.
- **Oracle Cloud (OCI)**: Plataforma en la nube para desplegar la aplicación.
- **Let's Encrypt** (u otro servicio): Para la generación de certificados SSL.
- **OCI Monitoring**: Monitoreo de la infraestructura en Oracle Cloud.

## Flujo de Trabajo

1. **Desarrollo**: Trabajas en una rama `develop` y haces **push**.
2. **Pull Request**: Verificas los cambios mediante un PR a `main` (producción).
3. **GitHub Actions**: Ejecuta pruebas y, si todo está bien, despliega en producción mediante **Terraform** en **Oracle Cloud**.
4. **Despliegue en Producción**: Una vez verificado, se hace el despliegue final en producción.
