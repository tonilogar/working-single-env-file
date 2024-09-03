Folder PATH listing for volume DADES
Volume serial number is 000001B4 A4D1:F93C
D:.
|   .env
|   .gitignore
|   docker-compose.yml
|   LICENSE
|   nginx.conf
|   package-lock.json
|   README.md
|   
+---backend_api_rest
|   |   Dockerfile
|   |   package-lock.json
|   |   package.json
|   |   
|   \---src
|       |   app.js
|       |   
|       +---controllers
|       |       projects-controller.js
|       |       
|       +---database
|       |       mongo-db.js
|       |       
|       +---endpoints
|       |       endpoints.js
|       |       
|       +---middleware
|       |       auth.js
|       |       
|       +---models
|       |       project.js
|       |       
|       \---routes
|               projects-routes.js
|               
+---backend_auth0
|   |   .dockerignore
|   |   .gitignore
|   |   .prettierrc.yaml
|   |   Dockerfile
|   |   exec.ps1
|   |   exec.sh
|   |   package-lock.json
|   |   package.json
|   |   README.md
|   |   server.js
|   |   
|   +---bin
|   |       www
|   |       
|   \---public
|       |   index.html
|       |   
|       +---css
|       |       main.css
|       |       
|       +---images
|       |       logo.png
|       |       
|       \---js
|               app.js
|               cookies.js
|               ui.js
|               
+---frontend_01
|   |   .gitignore
|   |   Dockerfile
|   |   index.html
|   |   javascript.svg
|   |   main.js
|   |   package-lock.json
|   |   package.json
|   |   style.css
|   |   vite.config.js
|   |   
|   \---public
|           vite.svg
|           
\---frontend_02
    |   .gitignore
    |   Dockerfile
    |   index.html
    |   javascript.svg
    |   main.js
    |   package-lock.json
    |   package.json
    |   style.css
    |   vite.config.js
    |   
    \---public
            vite.svg
            
