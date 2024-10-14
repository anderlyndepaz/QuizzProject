
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const form = document.getElementById("form");
const parrafo = document.getElementById("warnings");

form.addEventListener("submit", e => {
  e.preventDefault(); // Evita que se envíe el formulario automáticamente

  let warnings = "";
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let entrar = false; // Definición correcta de la variable

  // Limpiar mensajes anteriores
  parrafo.innerHTML = "";

  // Validar campo "nombre"
  if (nombre.value.length < 4) {
    warnings += 'El nombre no es válido.<br>';
    entrar = true; // Indica que hay errores
  }

  // Validar campo "apellido"
  if (apellido.value.length < 5 || apellido.value.length > 30) {
    warnings += 'El apellido no es válido.<br>';
    entrar = true; // Indica que hay errores
  }
  
  // Validar formato de correo electrónico
  if (!regexEmail.test(email.value)) {
    warnings += 'El correo no es válido.<br>';
    entrar = true; // Indica que hay errores
  }

  // Si hay advertencias, mostrar en el párrafo
  if (entrar) {
    parrafo.innerHTML = warnings;
  } else {
    parrafo.innerHTML = "Formulario enviado correctamente.";
    // Aquí puedes proceder con el envío del formulario o ejecutar alguna otra lógica.
  }
});
document.getElementById('comenzarBtn').addEventListener('click', function() {
    alert('¡Nuevo juego comenzado!');
    // Aquí puedes agregar la lógica para reiniciar el juego o redirigir a la pantalla inicial
});