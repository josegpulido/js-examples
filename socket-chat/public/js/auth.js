// Recuperando entidades HTML del documento
const form = document.querySelector('form');
const lblError = document.querySelector('#lbl-error');

// Evento para iniciar sesión
form.addEventListener('submit', ev => {
  // Evitar hacer refresh en el navegador
  ev.preventDefault();
  // Limpiar interfaz
  lblError.textContent = '';
  // Capturando valor de los input de texto
  const formData = {
    email: form.elements[0].value,
    password: form.elements[1].value
  };
  // Ejecutando petición a ruta de servidor
  fetch('http://localhost:5000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(body => {
    // Procesando respuesta... Este código es muy básico y no está nada optimizado, NO USAR
    if (body.error || body.errors) {
      // ...Servidor retorno error
      const message = body.error || body.errors[0].msg;
      lblError.textContent = message;
    } else {
      // ...Todo OK, almacenando token en local storage
      const { token } = body;
      localStorage.setItem('token', token);
      // Redireccionando a sala de chats
      window.location = 'chat.html';
    }
  })
  .catch(err => {
    console.error(err);
    lblError.textContent = 'Ocurrió un error procesando la solicitud. Intentalo de nuevo.';
  })
  .finally(() => {
    // Limpiar interfaz
    form.elements[0].value = '';
    form.elements[1].value = '';
  });
});