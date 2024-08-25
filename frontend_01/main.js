// main.js

import './style.css';

/**
 * Decodifica un JWT y devuelve su payload como objeto JSON.
 * @param {string} token - El token JWT.
 * @returns {object|null} - El payload del token o null si no es válido.
 */
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Error decodificando el token JWT:', e);
    return null;
  }
};

/**
 * Verifica si un token JWT es válido (no ha expirado).
 * @param {string} token - El token JWT.
 * @returns {boolean} - Verdadero si es válido, falso si ha expirado o es inválido.
 */
const isTokenValid = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return false;
  }
  const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
  return decoded.exp > currentTime;
};

// Función para hacer la petición a la API RESTful
const fetchProjects = async (token, port_backend_api_rest) => {
  try {
    const response = await fetch(`http://localhost:${port_backend_api_rest}/api/projects`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud a la API RESTful');
    }

    const data = await response.json();
    console.log('Datos recibidos de la API RESTful:', data);
  } catch (error) {
    console.error('Error al obtener datos de la API RESTful:', error);
  }
};

window.onload = () => {
  const variable_frontend_01 = import.meta.env.VITE_VARIABLE_FRONTEND_01_DOCKER;
  const port_frontend = import.meta.env.VITE_PORT_FRONTEND_01_DOCKER;
  const port_backend_api_rest = import.meta.env.VITE_PORT_BACKEND_API_REST_DOCKER;
  const port_backend_auth0 = import.meta.env.VITE_PORT_BACKEND_AUTH0_DOCKER;

  try {
    // Capturar el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (urlToken) {
      // Guardar el token en localStorage
      localStorage.setItem('access_token', urlToken);
      console.log('Token JWT guardado en localStorage:', urlToken);

      // Mostrar contenido si el token está presente
      document.querySelector('#app').innerHTML = `
        <div>
          <h1>frontend_01 puerto ${port_frontend}</h1>
          <h1>${variable_frontend_01}</h1>
          <button id="fetch-projects" class="button">Obtener Proyectos</button>
        </div>
      `;

      // Limpiar el token de la URL para evitar que quede expuesto
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // No hay token en la URL; verificar localStorage
      const storedToken = localStorage.getItem('access_token');

      if (storedToken) {
        console.log('Token encontrado en localStorage:', storedToken);

        if (isTokenValid(storedToken)) {
          console.log('El token en localStorage es válido.');

          // Mostrar contenido si el token es válido
          document.querySelector('#app').innerHTML = `
            <div>
              <h1>frontend_01 puerto ${port_frontend}</h1>
              <h1>${variable_frontend_01}</h1>
              <button id="fetch-projects" class="button">Obtener Proyectos</button>
            </div>
          `;
        } else {
          console.log('El token en localStorage ha expirado o es inválido.');

          // Eliminar el token inválido de localStorage
          localStorage.removeItem('access_token');

          // Redirigir al backend de Auth0 para iniciar sesión
          document.querySelector('#app').innerHTML = `
            <div>
              <h1>Token inválido o expirado. Redirigiendo para iniciar sesión...</h1>
            </div>
          `;
          setTimeout(() => {
            window.location.href = `http://localhost:${port_backend_auth0}`; // Ajusta la URL según sea necesario
          }, 2000);
        }
      } else {
        console.log('No se encontró ningún token en la URL ni en localStorage.');

        // No hay token disponible; redirigir al backend de Auth0 para iniciar sesión
        document.querySelector('#app').innerHTML = `
          <div>
            <h1>Acceso no autorizado. Serás redirigido en breve...</h1>
            <p>Si no eres redirigido, haz clic <a href="http://localhost:${port_backend_auth0}">aquí</a> para iniciar sesión.</p>
          </div>
        `;
        setTimeout(() => {
          window.location.href = `http://localhost:${port_backend_auth0}`; // Ajusta la URL según sea necesario
        }, 2000);
      }
    }

    // Agregar el evento al botón para hacer la solicitud a la API
    document.getElementById('fetch-projects')?.addEventListener('click', () => {
      const token = localStorage.getItem('access_token');
      if (token && isTokenValid(token)) {
        fetchProjects(token, port_backend_api_rest);
      } else {
        console.error('El token no es válido o no está presente.');
      }
    });

  } catch (error) {
    console.error('Error:', error.message);

    // Mostrar un mensaje de acceso no autorizado y redirigir después de un tiempo
    document.querySelector('#app').innerHTML = `
      <div>
        <h1>Acceso no autorizado. Serás redirigido en breve...</h1>
        <p>Si no eres redirigido, haz clic <a href="http://localhost:${port_backend_auth0}">aquí</a> para iniciar sesión.</p>
      </div>
    `;

    // Redirigir al backend de Auth0 después de 2 segundos
    setTimeout(() => {
      window.location.href = `http://localhost:${port_backend_auth0}`; // Ajusta la URL según sea necesario
    }, 2000);
  }
};
