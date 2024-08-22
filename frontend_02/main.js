// main.js

import './style.css'

window.onload = () => {
  const variable_frontend_02 = import.meta.env.VITE_VARIABLE_FRONTEND_02_DOCKER;
  const port_frontend = import.meta.env.VITE_PORT_FRONTEND_02_DOCKER;
  const port_backend_api_rest = import.meta.env.VITE_PORT_BACKEND_API_REST_DOCKER;
  const port_backend_auth0 = import.meta.env.VITE_PORT_BACKEND_AUTH0_DOCKER;

  try {
    // Capturar el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Guardar el token en localStorage
      localStorage.setItem('access_token', token);
      console.log('Token JWT guardado en localStorage:', token);

      // Mostrar contenido si el token está presente
      document.querySelector('#app').innerHTML = `
        <div>
          <h1>frontend_01 puerto ${port_frontend}</h1>
          <h1>${variable_frontend_02}</h1>
        </div>
      `;

      // Limpiar el token de la URL para evitar que quede expuesto
      window.history.replaceState({}, document.title, window.location.pathname);

    } else {
      // Si no hay token en la URL, lanzar un error
      throw new Error('Token no encontrado en la URL.');
    }

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
