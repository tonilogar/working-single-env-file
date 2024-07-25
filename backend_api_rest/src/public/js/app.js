let auth0Client = null;

const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0Client = await createAuth0Client({
    domain: "dev-kh0lhtwlllczrtsu.eu.auth0.com",
    clientId: "WgEsijdV6MwNtbMFscOhmSlodTTL6T2V"
  });
};

window.onload = async () => {
  await configureClient();

  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  updateUI();
};

const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;

  if (isAuthenticated) {
    const user = await auth0Client.getUser();
    document.getElementById("user").innerHTML = `Hello, ${user.name}`;
    document.getElementById("gated-content").classList.remove("hidden");
    document.getElementById("ipt-access-token").innerHTML = await auth0Client.getTokenSilently();
    document.getElementById("ipt-user-profile").textContent = JSON.stringify(user);
  } else {
    document.getElementById("gated-content").classList.add("hidden");
  }
};

const login = async () => {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  });
};

const logout = () => {
  auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
};

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logout;
