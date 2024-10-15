
// Variable global
const mApp = {}
mApp.arr_preguntas = [];
mApp.preguntaActual = 0;
mApp.acertadas = 0;
mApp.fallidas = 0;

/* ************************************* */
/* ************************************* */
/* ************************************* */
// Funciones de manejo del DOM

// funcion corta para llamar a 'document.getElementById'
function getById(obj){
    return document.getElementById(obj);
}

// funcion corta para llamar a 'document.querySelector'
function qSelector(obj){
    return document.querySelector(obj);
}

/* ************************************* */

// funcion para mostrar u ocultar objetos HTML por ID
function MO_objID(obj, modo){

    let objHTML = getById(obj);

    if(objHTML){
        objHTML.style.display = modo;
    }
}

// funcion para mostrar u ocultar objetos HTML por querySelector
function MO_objQS(obj, modo){

    let objHTML = qSelector(obj);

    if(objHTML){
        objHTML.style.display = modo;
    }
}

/* ************************************* */

// funcion para controlar la visibilidad
// de las tres secciones principales:
// boxHome, boxQuiz y boxResults
function mostrarSeccion(seccion) {

    // ocultamos todas las secciones
    MO_objID("boxHome", 'none');
    MO_objID("boxQuiz", 'none');
    MO_objID("boxResults", 'none');

    // mostramos solo la sección pasada como argumento
    switch(seccion) {
        case "home":
            MO_objID("boxHome", 'block');
            break;
        case "quiz":
            MO_objID("boxQuiz", 'block');
            break;
        case "results":
            MO_objID("boxResults", 'block');
            break;
        default:
            console.warn("Sección no válida: " + seccion);
    }
}

/* ************************************* */
/* ************************************* */
/* ************************************* */
// Iniciamos la App

// En el evento onload llamamos a las funciones de inicio
window.addEventListener('load', function() {
    // mostramos la seccion "home"
    mostrarSeccion("home");
});

/* ************************************* */
/* ************************************* */
/* ************************************* */

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
// Función para renderizar el HTML en el DOM dentro de la sección #boxResults
function renderQuizFinalizado(puntos, aciertos, fallos, nombre) {
  // Obtener la sección donde se insertará el contenido
  const boxResults = document.getElementById('boxResults');
  if (!boxResults) {
      console.error('No se encontró el elemento con id "boxResults"');
      return;
  }
  
  // Limpiar el contenido anterior (opcional)
  boxResults.innerHTML = '';

  // Crear el contenedor principal
  const container = document.createElement('div');
  container.className = 'container';

  // Título
  const title = document.createElement('h1');
  title.textContent = 'Quiz Finalizado';
  container.appendChild(title);

  // logo Quiz
  const questionBox = document.createElement('div');
  questionBox.className = 'question-box';
  const img = document.createElement('img');
  img.src = './assets/img/cuboQuiz.png';
  img.alt = 'logo Quiz';
  questionBox.appendChild(img);
  container.appendChild(questionBox);

  // Tabla de posiciones
  const leaderboard = document.createElement('div');
  leaderboard.className = 'leaderboard';

  // Primer lugar
  const rankingItem1 = createRankingItem('#FFD700', 'Primer Lugar', puntos, nombre);
  leaderboard.appendChild(rankingItem1);

  // Segundo lugar
  const rankingItem2 = createRankingItem('#FF69B4', 'Segundo Lugar', puntos, nombre);
  leaderboard.appendChild(rankingItem2);

  // Tercer lugar
  const rankingItem3 = createRankingItem('#FFD700', 'Tercer Lugar', puntos, nombre);
  leaderboard.appendChild(rankingItem3);

  container.appendChild(leaderboard);

  // Puntuación total
  const scoreTitle = document.createElement('h2');
  scoreTitle.textContent = `${puntos} Puntos`;
  container.appendChild(scoreTitle);

  // Resumen de aciertos y fallos
  const summary = document.createElement('p');
  summary.innerHTML = `ACIERTOS: ${aciertos}<br>FALLOS: ${fallos}`;
  container.appendChild(summary);

  // Botón de volver a jugar
  const button = document.createElement('button');
  button.id = 'comenzarBtn';
  button.textContent = 'volver a jugar';
  button.addEventListener('click', () => {
      // Acción para volver a jugar
      window.location.reload();
  });
  container.appendChild(button);

  // Agregar el contenedor a la sección #boxResults
  boxResults.appendChild(container);

  // Guardar los datos en localStorage
  guardarEnLocalStorage(puntos, aciertos, fallos, nombre);
}

// Función para crear un ítem de la tabla de posiciones
function createRankingItem(color, lugar, puntos, nombre) {
  const rankingItem = document.createElement('div');
  rankingItem.className = 'ranking-item';
  rankingItem.style.backgroundColor = color;

  const img = document.createElement('img');
  img.src = './assets/img/cuboQuiz.png';
  img.alt = lugar;
  img.className = 'ranking-icon';
  rankingItem.appendChild(img);

  const puntosSpan = document.createElement('span');
  puntosSpan.textContent = `${puntos} Puntos`;
  rankingItem.appendChild(puntosSpan);

  const nombreSpan = document.createElement('span');
  nombreSpan.textContent = nombre;
  rankingItem.appendChild(nombreSpan);

  return rankingItem;
}

// Función para guardar en localStorage
function guardarEnLocalStorage(puntos, aciertos, fallos, nombre) {
  const quizData = {
      puntos: puntos,
      aciertos: aciertos,
      fallos: fallos,
      nombre: nombre,
      fecha: new Date().toLocaleString()
  };

  // Obtener los datos existentes en localStorage o crear uno nuevo
  const historial = JSON.parse(localStorage.getItem('quizHistorial')) || [];
  historial.push(quizData);

  // Guardar el nuevo historial en localStorage
  localStorage.setItem('quizHistorial', JSON.stringify(historial));
}

// Ejemplo de uso de la función
renderQuizFinalizado(15000, 5, 5, 'Ken');
