import './style.css'


const variable_frontend_02 = import.meta.env.VITE_VARIABLE_FRONTEND_02_DOCKER;
const port_frontend = import.meta.env.VITE_PORT_FRONTEND_02_DOCKER;
const port_backend = import.meta.env.VITE_PORT_BACKEND_API_REST_DOCKER;

document.querySelector('#app').innerHTML = `
  <div>
    <h1>frontend_copernicus_tools puerto ${port_frontend}</h1>
    <h1>${variable_frontend_02}</h1>
  </div>
`;


