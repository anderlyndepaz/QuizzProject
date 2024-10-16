// Variable global
const mApp = {};
mApp.arr_preguntas = [];
mApp.preguntaActual = 0;
mApp.acertadas = 0;
mApp.fallidas = 0;

/* ************************************* */
/* ************************************* */
/* ************************************* */
// Funciones de manejo del DOM

// Funcion corta para llamar a 'document.getElementById'
function getById(obj) {
    return document.getElementById(obj);
}

// Funcion corta para llamar a 'document.querySelector'
function qSelector(obj) {
    return document.querySelector(obj);
}

/* ************************************* */


// Funcion para mostrar u ocultar objetos HTML por ID
function MO_objID(obj, modo) {
    let objHTML = getById(obj);
    if (objHTML) {
        objHTML.style.display = modo;
    }
}

// Funcion para mostrar u ocultar objetos HTML por querySelector
function MO_objQS(obj, modo) {
    let objHTML = qSelector(obj);
    if (objHTML) {
        objHTML.style.display = modo;
    }
}

/* ************************************* */


// Funcion para controlar la visibilidad de las tres secciones principales: boxHome, boxQuiz y boxResults
function mostrarSeccion(seccion) {
    // Ocultamos todas las secciones
    MO_objID("boxHome", 'none');
    MO_objID("boxQuiz", 'none');
    MO_objID("boxResults", 'none');


    // Mostramos solo la seccion pasada como argumento
    switch (seccion) {
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
    mostrarSeccion("quiz");
});

/* ************************************* */
/* ************************************* */

// Validación de formulario
const nombre = getById("nombre");
const apellido = getById("apellido");
const email = getById("email");
const form = getById("form");
const parrafo = getById("warnings");


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

/* ************************************* */

// Datos de los temas
const temas = [
  { nombre: "Cine", imagen: "./assets/img/palomitas.png", value: 11},
  { nombre: "Música", imagen: "./assets/img/micro.png", value: 12},
  { nombre: "Conocimiento General", imagen: "./assets/img/libro.png", value: 9},
  { nombre: "Videojuegos", imagen: "./assets/img/game.png", value: 15}
];

// Crear el contenedor principal
const categorias = document.getElementById('categorias');

// Crear el contenedor de la aplicación
const container = document.createElement('div');
container.classList.add('container');

// Agregar el título
const titulo = document.createElement('h1');
titulo.textContent = 'ELIGE TEMA';
container.appendChild(titulo);

// Crear el contenedor de los botones
const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('buttons');

// Función para manejar la selección de un tema
function chooseTopic(topic) {
  alert("Has elegido el tema: " + topic);
  // Aquí podrías añadir la lógica para redirigir a otra página o cargar contenido específico.
}

// Crear cada botón basado en los datos de los temas
temas.forEach(tema => {
  const button = document.createElement('div');
  button.classList.add('button');
  button.onclick = () => chooseTopic(tema.value);

  const img = document.createElement('img');
  img.src = tema.imagen;
  img.alt = tema.nombre;
  
// Agregar el contenedor de botones al contenedor principal
container.appendChild(buttonsContainer);
  
  const text = document.createElement('p');
  text.textContent = tema.nombre;

  button.appendChild(img);
  button.appendChild(text);
  buttonsContainer.appendChild(button);





// Agregar todo al DOM
categorias.appendChild(container);

/* ************************************* */

// Función para renderizar el HTML en el DOM dentro de la sección #boxResults
function renderQuizFinalizado(puntos, aciertos, fallos, nombre) {
    // Obtener la sección donde se insertará el contenido
    const ranking = getById('ranking');
    if (!ranking) {
        console.error('No se encontró el elemento con id "ranking"');
        return;
    }
    
    // Limpiar el contenido anterior (opcional)
    ranking.innerHTML = '';

    // Crear el contenedor principal
    const container = document.createElement('div');
    container.className = 'container';

    // Título
    const title = document.createElement('h1');
    title.textContent = 'Quiz Finalizado';
    container.appendChild(title);

    // Logo Quiz
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

    // Crear ítems de la tabla de posiciones
    const rankingItem1 = createRankingItem('#FFD700', 'Primer Lugar', puntos, nombre);
    const rankingItem2 = createRankingItem('#FF69B4', 'Segundo Lugar', puntos, nombre);
    const rankingItem3 = createRankingItem('#FFD700', 'Tercer Lugar', puntos, nombre);
    leaderboard.appendChild(rankingItem1);
    leaderboard.appendChild(rankingItem2);
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
    ranking.appendChild(container);

    // Guardar los datos en localStorage
    guardarEnLocalStorage(puntos, aciertos, fallos, nombre);
  
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

// Ejemplo de uso de la función
renderQuizFinalizado(15000, 5, 5, 'Ken');


function pintarGrafica() {
  const ctx = document.getElementById('myChart'); // Accede al canvas con ID "myChart"

  // Verifica si el elemento canvas existe
  if (ctx) {
    new Chart(ctx, {
      type: 'bar', // Tipo de gráfico: barra
      data: {
        // Etiquetas en formato de fecha
        labels: [
          '2024-10-01',
          '2024-10-02',
          '2024-10-03',
          '2024-10-04',
          '2024-10-05',
          '2024-10-06'
        ],
        datasets: [{
          label: 'RANKING',
          data: [12, 19, 3, 5, 2, 3], // Datos de puntuación
          borderWidth: 5,
          borderColor: '#ff69b4', // Color del borde de las barras (rosa fuerte)
          backgroundColor: '#ff69b4', // Color de las barras (rosa fuerte)
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time', // Tipo de eje X: tiempo
            time: {
              unit: 'day' // Unidad de tiempo
            },
            title: {
              display: true,
              text: 'FECHA' // Título del eje X
            }
          },
          y: {
            beginAtZero: true, // Comenzar el eje Y desde 0
            title: {
              display: true,
              text: 'PUNTUACION' // Título del eje Y
            }
          }
        }
      }
    });
  } else {
    alert("Canvas not found");
  }
}

pintarGrafica();
