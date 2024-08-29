import './style.css';

window.onload = () => {
  // Hacer una solicitud GET al endpoint /api/projects
  fetch('http://localhost:3001/api/projects', {
    method: 'GET',
    credentials: 'include' // Incluye las cookies en la solicitud
  })
    .then(response => {
      // Imprimir la respuesta completa (opcional, puedes eliminar este log si solo necesitas los datos JSON)
      console.log('Respuesta completa:', response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json(); // Convertir la respuesta a JSON
    })
    .then(data => {
      // Imprimir específicamente el JSON obtenido desde el endpoint
      console.log('JSON obtenido de /api/projects:', JSON.stringify(data, null, 2));
    })
    .catch(error => {
      // Manejar e imprimir errores
      console.error('Hubo un problema con la solicitud:', error);
    });
};
