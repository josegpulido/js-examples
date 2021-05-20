
/**
 * Integración con Google Sign In. Cuando el
 * botón haga todo su procedimiento, el cual está
 * provisto por la etiqueta script agregado al 
 * final del archivo HTML, entonces el siguiente
 * método se disparará:
 */
function onSignIn(googleUser) {
  // Información que podría mostrarse en el frontend
  const profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
  // Enviando token de Google al servidor para validarlo
  const token = googleUser.getAuthResponse().id_token;
  // Verificando qué tipo de url usar (desarrollo o producción)
  const url = window.location.host.includes('localhost')
              ? 'http://localhost:5000/user/with-google'
              : 'https://node-marketplace-josegpulido.herokuapp.com/user/with-google';
  // Haciendo petición
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'google-token': token
    }
  })
  .then(response => {
    // Parseando el body de la respuesta del servidor
    return response.json();
  })
  .then(body => {
    console.log(body);
  });
}

// Método para salir de la sesión
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut()
  .then(() => {
    console.log('User signed out.');
  });
}