import { acceptCookies, managePreferences, checkCookies } from './cookies.js';

let auth0Client = null; // Variable para almacenar la instancia del cliente Auth0

// Función para obtener el token JWT del servidor
const getJwtToken = async () => {
  const response = await fetch("/generate_token", {
    method: 'POST' // Solicitud POST para generar el token
  });
  const data = await response.json();
  return data.token; // Devuelve el token JWT
};

/**
 * Función para obtener la configuración de autenticación desde el servidor
 */
const fetchAuthConfig = async () => {
  const token = await getJwtToken(); // Obtiene el token JWT
  return fetch("/auth_config", {
    headers: {
      Authorization: `Bearer ${token}` // Usa el token JWT en la cabecera de autorización
    }
  });
};

/**
 * Función para obtener la variable de prueba desde el servidor
 */
const fetchTestVariable = async () => {
  const token = await getJwtToken(); // Obtiene el token JWT
  const response = await fetch("/test_variable", {
    headers: {
      Authorization: `Bearer ${token}` // Usa el token JWT en la cabecera de autorización
    }
  });
  const data = await response.json();
  return data.test_variable; // Devuelve la variable de prueba
};

/**
 * Función para inicializar el cliente de Auth0
 */
const configureClient = async () => {
  const response = await fetchAuthConfig(); // Obtiene la configuración de autenticación
  const config = await response.json();

  // Crea una instancia del cliente Auth0 usando la configuración obtenida
  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      audience: config.audience
    }
  });
};

/**
 * Función para iniciar el flujo de autenticación
 */
const login = async (targetUrl) => {
  try {
    console.log("Logging in", targetUrl);

    const options = {
      authorizationParams: {
        redirect_uri: window.location.origin // Redirige a la URL de origen después de la autenticación
      }
    };

    if (targetUrl) {
      options.appState = { targetUrl }; // Guarda la URL de destino en el estado de la aplicación
    }

    await auth0Client.loginWithRedirect(options); // Inicia el flujo de autenticación de redirección
  } catch (err) {
    console.log("Log in failed", err); // Maneja errores en el inicio de sesión
  }
};

/**
 * Función para ejecutar el flujo de cierre de sesión
 */
const logout = async () => {
  try {
    console.log("Logging out");
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin // Redirige a la URL de origen después de cerrar sesión
      }
    });
  } catch (err) {
    console.log("Log out failed", err); // Maneja errores en el cierre de sesión
  }
};

/**
 * Función para verificar si el usuario está autenticado. Si lo está, ejecuta `fn`. De lo contrario, solicita al usuario que inicie sesión.
 * @param {*} fn La función a ejecutar si el usuario ha iniciado sesión
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0Client.isAuthenticated(); // Verifica si el usuario está autenticado

  if (isAuthenticated) {
    return fn(); // Si está autenticado, ejecuta la función proporcionada
  }

  return login(targetUrl); // Si no está autenticado, inicia el flujo de inicio de sesión
};

/**
 * Función para llamar al endpoint de la API con un token de autorización
 */
const callApi = async () => {
  try {
    const token = await auth0Client.getTokenSilently(); // Obtiene el token de acceso de forma silenciosa

    const response = await fetch("/api/external", {
      headers: {
        Authorization: `Bearer ${token}` // Usa el token de acceso en la cabecera de autorización
      }
    });

    const responseData = await response.json();
    const responseElement = document.getElementById("api-call-result");

    responseElement.innerText = JSON.stringify(responseData, {}, 2); // Muestra los datos de respuesta en el elemento HTML

    document.querySelectorAll("pre code").forEach(hljs.highlightBlock);

    eachElement(".result-block", (c) => c.classList.add("show")); // Muestra los elementos con clase 'result-block'
  } catch (e) {
    console.error(e); // Maneja errores en la llamada a la API
  }
};

// Función que se ejecutará cuando la página haya terminado de cargarse
window.addEventListener('load', async () => {
  checkCookies(); // Verifica el estado de las cookies

  await configureClient(); // Inicializa el cliente de Auth0

  // Obtener y mostrar la variable de prueba
  const testVariable = await fetchTestVariable();
  console.log('Test Variable:', testVariable);

  // Actualiza el contenido del elemento HTML con la variable de prueba
  document.getElementById('test-variable-display').innerText = testVariable;

  // Si no se puede analizar el hash del historial, por defecto a la URL raíz
  if (!showContentFromUrl(window.location.pathname)) {
    showContentFromUrl("/");
    window.history.replaceState({ url: "/" }, {}, "/");
  }

  const bodyElement = document.getElementsByTagName("body")[0];

  // Escucha clics en cualquier hipervínculo que navegue a una URL con #
  bodyElement.addEventListener("click", (e) => {
    if (isRouteLink(e.target)) {
      const url = e.target.getAttribute("href");

      if (showContentFromUrl(url)) {
        e.preventDefault();
        window.history.pushState({ url }, {}, url);
      }
    } else if (e.target.getAttribute("id") === "call-api") {
      e.preventDefault();
      callApi(); // Llama a la API cuando se hace clic en el botón con id "call-api"
    }
  });

  const isAuthenticated = await auth0Client.isAuthenticated(); // Verifica si el usuario está autenticado

  if (isAuthenticated) {
    console.log("> User is authenticated");
    window.history.replaceState({}, document.title, window.location.pathname);
    updateUI(); // Actualiza la interfaz de usuario si el usuario está autenticado
    return;
  }

  console.log("> User not authenticated");

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    console.log("> Parsing redirect");
    try {
      const result = await auth0Client.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      }

      console.log("Logged in!");
    } catch (err) {
      console.log("Error parsing redirect:", err); // Maneja errores al analizar la redirección
    }

    window.history.replaceState({}, document.title, "/");
  }

  updateUI(); // Actualiza la interfaz de usuario al cargar la página
});
