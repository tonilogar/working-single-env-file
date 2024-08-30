// The Auth0 client, initialized in configureClient()
let auth0Client = null;

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
  try {
    console.log("Logging in", targetUrl);

    const options = {
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    };

    if (targetUrl) {
      options.appState = { targetUrl };
    }

    await auth0Client.loginWithRedirect(options);
  } catch (err) {
    console.log("Log in failed", err);
  }
};

/**
 * Executes the logout flow
 */
const logout = async () => {
  try {
    console.log("Logging out");
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth_config");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      audience: config.audience
    }
  });
};

/**
 * Checks to see if the user is authenticated. If so, fn is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

/* Calls the API endpoint with an authorization token */

const callApi = async (targetUrl) => {
  try {
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
   
    eachElement(".result-block", (c) => c.classList.add("show"));

    // Redireccionar al frontend correspondiente, pasando el token en la URL
    window.location.href = `${targetUrl}?token=${token}`;
  } catch (e) {
    console.error(e);
  }
};

// Will run when page finishes loading
window.onload = async () => {
  await configureClient();

  // Obtener la configuración desde el backend
  // Obtener el token del localStorage
  const token = localStorage.getItem('access_token');

  // Realizar la solicitud a /config con el token en el header
  const response = await fetch('/config', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const config = await response.json();

  const ports = {
    "TOOL 001": config.PORT_FRONTEND_01,
    "TOOL 002": config.PORT_FRONTEND_02,
    "TOOL 003": config.PORT_FRONTEND_03,
    "TOOL 004": config.PORT_FRONTEND_04,
    "TOOL 005": config.PORT_FRONTEND_05,
    "TOOL 006": config.PORT_FRONTEND_06,
    "TOOL 007": config.PORT_FRONTEND_07,
    "TOOL 008": config.PORT_FRONTEND_08,
    "TOOL 009": config.PORT_FRONTEND_09,
    "TOOL 010": config.PORT_FRONTEND_10
  };

  // Selecciona todos los botones con la clase 'button_tools'
  const buttons = document.querySelectorAll('.button_tools');

  buttons.forEach(button => {
    const toolName = button.innerText.trim(); // Obtener el nombre de la herramienta desde el botón
    const port = ports[toolName]; // Obtener el puerto correspondiente

    if (port) {
      button.setAttribute('data-port', port); // Asignar el puerto al atributo data-port
    }

    button.addEventListener('click', function() {
      callApi(`http://localhost:${port}/`);
    });
  });

  // If unable to parse the history hash, default to the root URL
  if (!showContentFromUrl(window.location.pathname)) {
    showContentFromUrl("/");
    window.history.replaceState({ url: "/" }, {}, "/");
  }

  const bodyElement = document.getElementsByTagName("body")[0];

  // Listen out for clicks on any hyperlink that navigates to a #/ URL
  bodyElement.addEventListener("click", (e) => {
    if (isRouteLink(e.target)) {
      const url = e.target.getAttribute("href");

      if (showContentFromUrl(url)) {
        e.preventDefault();
        window.history.pushState({ url }, {}, url);
      }
    }
  });

  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    console.log("> User is authenticated");
    window.history.replaceState({}, document.title, window.location.pathname);
    updateUI();
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
      console.log("Error parsing redirect:", err);
    }

    window.history.replaceState({}, document.title, "/");
  }

  updateUI();
};
