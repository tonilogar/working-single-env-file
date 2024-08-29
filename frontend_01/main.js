import './style.css';

const variable_frontend = import.meta.env.VITE_VARIABLE_FRONTEND_01_DOCKER;
const port_frontend = import.meta.env.VITE_PORT_FRONTEND_01_DOCKER;
const port_backend_api_rest = import.meta.env.VITE_PORT_BACKEND_API_REST_DOCKER;
const port_backend_auth0 = import.meta.env.VITE_PORT_BACKEND_AUTH0_DOCKER;

let projectsData = null; // Variable para almacenar los datos del proyecto

// Función para verificar si el usuario está autenticado
const checkAuthentication = async () => {
  try {
    const response = await fetch(`http://localhost:${port_backend_api_rest}/api/projects`, {
      method: 'GET',
      credentials: 'include' // Incluye las cookies en la solicitud
    });

    if (response.ok) {
      console.log('Usuario autenticado. Cargando aplicación...');

      // Guardar los datos obtenidos de la petición en la variable projectsData
      projectsData = await response.json();

      // Imprimir los datos en la consola
      console.log('Datos obtenidos de /api/projects:', projectsData);

      // Mostrar el botón en la interfaz
      document.querySelector('#app').innerHTML = `
        <div>
          <h1>¡Bienvenido! Usuario autenticado.</h1>
          <h1>frontend_01 puerto ${port_frontend}</h1>
          <h1>${variable_frontend}</h1>
          <button id="fetch-projects" class="button">Obtener Proyectos</button>
          <div id="projects-list"></div> <!-- Contenedor para mostrar los proyectos -->
        </div>
      `;

      // Agregar el evento al botón para mostrar los proyectos
      document.getElementById('fetch-projects').addEventListener('click', () => {
        displayProjects(projectsData);
      });

    } else {
      throw new Error('No autenticado');
    }
  } catch (error) {
    console.error('Usuario no autenticado. Redirigiendo al inicio de sesión...');

    console.log('No se encontró ningún token en la URL ni en las cookies.');

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
};

// Función para mostrar los proyectos en el HTML
const displayProjects = (projects) => {
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = ''; // Limpiar contenido previo

  projects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.textContent = `Nombre del Proyecto: ${project.name}, Descripción: ${project.description}`;
    projectsList.appendChild(projectItem);
  });
};

// Ejecutar la verificación de autenticación cuando se cargue la página
window.onload = () => {
  checkAuthentication();
};
