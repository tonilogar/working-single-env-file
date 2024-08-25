1. Inicio de Sesión y Creación del Token
   El usuario inicia sesión en el pequeño frontend de backend_auth0 en el puerto 3000.
   Auth0 valida las credenciales y genera un Access Token en el fichero:
   backend_auth0/public/app.js

const callApi = async (targetUrl) => {
try {
// Obtener token
const token = await auth0Client.getTokenSilently();
console.log('token', token);

    // Guardar el token en el localStorage
    localStorage.setItem('access_token', token);

    const response = await fetch("/api/external", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const responseData = await response.json();

    // Redireccionar al frontend correspondiente, pasando el token en la URL
    window.location.href = `${targetUrl}?token=${token}`;

} catch (e) {
console.error(e);
}
};

2. Recepción del Token
El Access Token es recibido y almacenado temporalmente en el frontend en el puerto 3000: 
localStorage.setItem('access_token', token);

3. Redirección con el Token
Cuando el usuario selecciona el enlace para ir al Frontend 01 
<button id="call-api" class="button_tools">TOOL 001</button>

En el puerto 5173, el Access Token se envía como un parámetro en la URL (por ejemplo,  window.location.href = `${targetUrl}?token=${token}`;

4. Uso del Token en el Frontend 01:
El Frontend 01 en el puerto 5173 recibe el token desde la URL.
const urlParams = new URLSearchParams(window.location.search);
El Frontend 01 extrae el token de la URL:
const token = urlParams.get('token');
Y lo utiliza para hacer peticiones a la API RESTful. 

5. Petición de Datos a la API RESTful
El Frontend 01 realiza una petición a la API RESTful en el puerto 3001, incluyendo el Access Token en los encabezados de la solicitud. 

6. Validación y Respuesta de la API
La API RESTful valida el token, procesa la solicitud, y devuelve los datos al Frontend 01. 

7. Visualización en el Frontend 01
El Frontend 01 muestra los con un console.log().



Vamos a recordar el porque estabamos mandando el token por la url.
Llegamos a la conclusión de que teniamos que pasar el token por la url, porque el local storege de los containers son puertos diferentes y si guardamos en el puerto 3000 el token en el localstorage, en el puerto 5173 no se encuentra, por eso tenemos que pasarlo por la url.
Si tu consideras que es mejor pasarlo con cookies que con token, razoname el porque.
Ya sabes que tu tienes mucho mas conocimiento sobre el tema que yo.
Yo intento aprender de ti, por eso quiero que seas critico y profesional con nuestros objetivos y no seas complacinete conmigo, si no el que decida.
ChatGPT Plus
ChatGPT
Entiendo tu punto, y es cierto que al estar trabajando con diferentes contenedores y puertos, el localStorage de un contenedor no es accesible desde otro. Esto es un problema cuando necesitas compartir un token entre diferentes aplicaciones front-end que se ejecutan en distintos orígenes (diferentes puertos en este caso).

Razones para Pasar el Token en la URL:
Restricción Técnica: Debido a que localStorage y sessionStorage son específicos de cada origen (dominio + puerto), no pueden ser compartidos entre diferentes puertos. Esto hace que pasar el token por la URL sea una opción viable para transferir el token entre aplicaciones que se ejecutan en diferentes puertos.
Facilidad de Implementación: Es una solución directa que requiere menos cambios en la infraestructura de la aplicación.
Desventajas de Pasar el Token en la URL:
Seguridad: Pasar tokens en la URL expone estos tokens a posibles ataques, ya que pueden quedar registrados en logs del servidor, historial del navegador, o ser compartidos accidentalmente.
Exposición en Referencias: Cuando un usuario sigue un enlace desde una página que contiene un token en la URL, el token puede ser enviado al servidor de la página de destino como parte del encabezado Referer.
Pasar el Token en Cookies Seguras:
Ventajas:

Mayor Seguridad: Las cookies pueden configurarse como HttpOnly, lo que impide que el token sea accesible desde JavaScript, protegiéndolo de ataques XSS. Además, pueden configurarse con la opción Secure para que solo se envíen a través de conexiones HTTPS, y SameSite para prevenir ataques CSRF.
Menor Exposición: Al contrario que los tokens en la URL, las cookies no son visibles en los logs del servidor ni en el historial del navegador.
Desventajas:

Configuración Compleja: Requiere más configuración tanto en el frontend como en el backend, especialmente si estás trabajando con aplicaciones en diferentes dominios o puertos.
Limitaciones de Uso: Las cookies están sujetas a restricciones como el tamaño máximo de 4KB, y en algunos casos, ciertos navegadores y configuraciones de red pueden bloquearlas.
Alternativas a Considerar:
OAuth 2.0 Implicit Flow o Authorization Code Flow con PKCE: En lugar de pasar el token directamente entre frontends, cada frontend podría gestionar su propio flujo de autenticación con Auth0, obteniendo un token directamente desde Auth0 cuando el usuario accede al frontend.

Ventaja: Evita compartir tokens entre aplicaciones y cada frontend maneja su propia autenticación de manera independiente.
Desventaja: Introduce más complejidad al tener múltiples flujos de autenticación.
Reverse Proxy: Utilizar un servidor proxy que maneje la autenticación y distribuya las solicitudes a los diferentes frontends, manteniendo el token en una sesión de servidor.

Ventaja: Centraliza la autenticación y protege los tokens.
Desventaja: Aumenta la complejidad de la infraestructura.
Mi Recomendación:
Si decides mantener el enfoque actual de pasar el token por la URL, deberías asegurarte de que el token se elimina de la URL tan pronto como se haya procesado (como ya estás haciendo), y que se almacena de manera segura en el localStorage o sessionStorage en el frontend correspondiente.

Si prefieres aumentar la seguridad y estás dispuesto a asumir una mayor complejidad en la configuración, usar cookies seguras sería la opción más segura. Sin embargo, para este enfoque deberías asegurarte de que todos los frontends y el backend estén configurados para manejar cookies de forma coherente.

Conclusión:
El flujo actual es funcional dado el entorno y las limitaciones, pero no es el más seguro posible. Si la seguridad es una preocupación importante, deberías considerar la implementación con cookies seguras o re-evaluar la arquitectura para utilizar un método diferente que permita compartir tokens de manera más segura entre los diferentes frontends.

¿Quieres proceder con el enfoque actual o explorar una de las alternativas mencionadas? Estoy aquí para guiarte en la dirección que elijas.