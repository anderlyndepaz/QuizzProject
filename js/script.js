const firebaseConfig = {
  apiKey: "AIzaSyCkRqwzMdrSnXbbatuEZQfFBCJGAfh-2k0",
  authDomain: "quizz-2024.firebaseapp.com",
  projectId: "quizz-2024",
  storageBucket: "quizz-2024.appspot.com",
  messagingSenderId: "374142806124",
  appId: "1:374142806124:web:fb045d8b8ea75599d81049"
};

// Inicializar Firebase con la configuración adecuada
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const formdb = firebase.firestore();

// Registro de usuario
const signUpUser = (email, password, nombre) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let user = userCredential.user;
      console.log(`Usuario registrado: ${user.email} ID:${user.uid}`);
      alert(`Usuario registrado: ${user.email}`);

      // Guardar el nombre y el email en Firestore, usando el UID del usuario
      createUser({
        id: user.uid,
        nombre: nombre,
        email: user.email
      });
    })
    .catch((error) => {
      console.error("Error en el registro:", error.message);
    });
};

// Guardar usuario en Firestore
const createUser = (user) => {
  formdb.collection("usuario").doc(user.id).set({
    nombre: user.nombre,
    email: user.email
  })
  .then(() => {
    console.log("Usuario guardado en Firestore");
  })
  .catch((error) => {
    console.error("Error al guardar el usuario en Firestore:", error);
  });
};

// Formulario de registro
document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const nombre = document.getElementById('nombre').value;
  const password = document.getElementById('pass').value;

  signUpUser(email, password, nombre);
});

// Función de inicio de sesión
const loginUser = (email, password) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let user = userCredential.user;
      console.log(`Usuario ha iniciado sesión: ${user.email} ID:${user.uid}`);
      alert(`Bienvenido ${user.email}`);
      
      // Puedes redirigir al usuario a otra página o mostrar algún mensaje adicional
    })
    .catch((error) => {
      console.error("Error en el inicio de sesión:", error.message);
      alert("Error en el inicio de sesión: " + error.message);
    });
};

// Formulario de login
document.getElementById('form2').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email2').value;
  const password = document.getElementById('pass3').value;

  loginUser(email, password);
});

// Función de logout
const logoutUser = () => {
  firebase.auth().signOut().then(() => {
    console.log("Usuario ha cerrado sesión");
    alert("Has cerrado sesión correctamente");
    // Redirigir al usuario a la página de login o página de inicio
  }).catch((error) => {
    console.error("Error al cerrar sesión:", error.message);
    alert("Error al cerrar sesión: " + error.message);
  });
};

// Escuchar el clic en el botón de logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  logoutUser();
});


// Variable global
const mApp = {};
mApp.usuario = "";
mApp.categoria = "";
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
window.addEventListener('load', function () {
	// mostramos la seccion "home"
	mostrarSeccion("home");

	let user = leer_localStorage("quizGame");

    if(user == null){
        localStorage.removeItem("quizGame");
        // inicializamos el localStorage 'user' a vacio
        localStorage.setItem(
            "quizGame",
            JSON.stringify([])
        );
    }
});

mostrarSeccion()

/* ************************************* */
/* ************************************* */

// Validación de formulario
const nombre = getById("nombre");
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

let btn_quiz = getById("btn_quiz");
btn_quiz.addEventListener("click", function (event) {
	event.preventDefault();

	crearBotonesTema();
    mostrarSeccion("quiz");
});

// Datos de los temas
const temas = [
	{ nombre: "Cine", imagen: "./assets/img/palomitas.png", value: 11, data: "cine" },
	{ nombre: "Música", imagen: "./assets/img/micro.png", value: 12, data: "musica" },
	{ nombre: "Conocimiento General", imagen: "./assets/img/libro.png", value: 9, data: "congeneral" },
	{ nombre: "Videojuegos", imagen: "./assets/img/game.png", value: 15, data: "videojuegos" }
];

// funcion que crea y pinta los botones en el id 'categorias'
function crearBotonesTema(){
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

	// Crear cada botón basado en los datos de los temas
	temas.forEach(tema => {
		const button = document.createElement('div');
		button.classList.add('button');
		button.onclick = () => chooseTopic(tema.value, tema.data);

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
	})
	// Agregar todo al DOM
	categorias.appendChild(container);
}

// Función para manejar la selección de un tema
function chooseTopic(topic, dt) {
	// llamada al ENDPOINT

	iniciarJuego(topic, dt);
}

let mensajesError = getById("mensajesError");

// realizamos la lectura del ENDPOINT
function getQuiz(categoria) {

    //const valorURL = url;
    //const valorURL = `./js/quiz.json`;
	const valorURL = `https://opentdb.com/api.php?amount=10&category=${categoria}&difficulty=easy&type=multiple`;
    //https://opentdb.com/api.php?amount=10&category=${arr_categorias[randomCategoria]}&difficulty=easy&type=multiple

	console.log(valorURL)
    let resultado = fetch(valorURL)
		.then(response => {
			if (!response.ok) {
				if (response.status === 429) {
					throw new Error('Demasiadas solicitudes, intentalo más tarde');
				} else {
					throw new Error(`API no encontrada: ${response.status}`);
				}
			}
			return response.json();
		})
        .then(data => {
            // devolvemos el objeto.results
            return data.results;
        })
		.catch(error => {
            console.error('Error al conectar:', error);
            let cadena = "Error al conectar con la BB.DD";
            
            // Si es un error 429, avisamos al usuario y esperamos antes de reintentar
            if (error.message.includes('Demasiadas solicitudes')) {
                cadena += ". Has realizado demasiadas solicitudes. Espera unos segundos.";
                
                // Intentamos nuevamente después de unos segundos (ej. 5 segundos)
                setTimeout(() => {
                    getQuiz(categoria);  // Volvemos a intentar después del tiempo definido
                }, 5000); // 5 segundos

				window.location.reload();
            }
            mensajesError.innerHTML = cadena;
        });
        return resultado;
}

// Iniciamos el juego y
// Controlamos si se reciben las respuestas del servidor
function iniciarJuego(numTema, tema) {

    MO_objID("categorias", 'none');
	MO_objID("box_cards", "block");
	MO_objID("boxJuego", "flex");
	MO_objID("btn_mostrarResultados", "none");
    
    getQuiz(numTema).then(dataQuiz => {
        if (!dataQuiz || dataQuiz.length === 0) {
			let mensaje = "No se recibieron preguntas del servidor"
            console.warn(mensaje);
			
			mensajesError.innerHTML = mensaje;
            return;  // Salimos de la función si no hay datos válidos
        }

		// reiniciamos y establecemos datos
        mApp.puntos = 0;
        mApp.acertadas = 0;
        mApp.fallidas = 0;
        mApp.preguntaActual = 0;

		mApp.usuario = "Equipo JAAR";
		mApp.categoria = tema;

        // asignamos a la variable global 
        mApp.arr_preguntas = dataQuiz; 

        pintarPregunta(mApp.preguntaActual);
    }).catch(error => {
        console.error("Error en la obtención de las preguntas:", error);
    });
}

function pintarPregunta(numero){

    let totalPreguntas = mApp.arr_preguntas.length;
    let arr = mApp.arr_preguntas[numero]; // accedemos a la pregunta actual

    // añadimos el reasultado al DOM
    const json_datos = document.getElementById('json_datos');
    const box_cards = document.getElementById('box_cards');
    const btn_nextQuestion = document.getElementById('btn_nextQuestion');

    let card = document.querySelector('.card');
    card.innerHTML = "";
    
    let arr_incorrectas = arr.incorrect_answers;
    arr_incorrectas.push(arr.correct_answer);

    // Llamamos a la función para obtener el array desordenado
    arr_preguntas_desordenadas = randomizeArray(arr_incorrectas);

    card.innerHTML = `
        <h3><strong>Question ${numero + 1}/${totalPreguntas}:</strong></h3>
        <label><strong>Acertadas: </strong></label>
        <label><strong>Fallidas: </strong></label>

        <h3>${arr.category}</h3>
        <label><strong>Dificultad:</strong> <span class="difficulty">${arr.difficulty}</span></label>

        <label><strong>Pregunta:</strong> ${arr.question}</label>
        <div class="containerQuestions">
            <div class="question neutral naranja" onclick="responderQuiz(event, ${numero});">${arr_preguntas_desordenadas[0]}</div>
            <div class="question neutral azul" onclick="responderQuiz(event, ${numero});">${arr_preguntas_desordenadas[1]}</div>
            <div class="question neutral rosa" onclick="responderQuiz(event, ${numero});">${arr_preguntas_desordenadas[2]}</div>
            <div class="question neutral amarillo" onclick="responderQuiz(event, ${numero});">${arr_preguntas_desordenadas[3]}</div>
        </div>
    `;
    // en la capa padre 'box_cards' insertamos 
    // la capa 'card' ANTES del botón 'btn_nextQuestion'
    box_cards.insertBefore(card, btn_nextQuestion);
    json_datos.appendChild(box_cards);
}

// funcion que controla la respuesta pulsada
function responderQuiz(event, numero){

    let btn_nextQuestion = getById("btn_nextQuestion");

    let hidden_answer = getById("hidden_answer");
    hidden_answer.innerHTML = mApp.arr_preguntas[numero].correct_answer;

    let respuesta = event.target.textContent;
    let respuestaCorrecta = hidden_answer.textContent;

    let posiblesRespuestas = document.querySelectorAll("#box_cards > div.card .question");

    // si el usuario pulsa sobre una respuesta incorrecta
    // buscamos la respuesta correcta y la ponemos resaltada
    for (let i = 0; i < posiblesRespuestas.length; i++) {
        console.log(posiblesRespuestas[i].textContent)

        // deshabilitamos la funcionalidad onclick de todas las opciones
        posiblesRespuestas[i].onclick = null;

        // borramos todas las clases de color
		posiblesRespuestas[i].classList.remove('azul', 'amarillo', 'naranja', 'rosa');
        posiblesRespuestas[i].classList.add("disabled");

        if(posiblesRespuestas[i].textContent == respuestaCorrecta){
            posiblesRespuestas[i].classList.remove("disabled");
            posiblesRespuestas[i].classList.add("correcta");
        }
    }

    // si el usuario pulsa sobre la respuesta correcta,
    // la respuesta correcta la ponemos resaltada
    if (respuesta !== respuestaCorrecta) {
        console.log("Respuesta incorrecta!");
        mApp.fallidas++;
    
        // resaltar la opción pulsada como incorrecta
        event.target.classList.remove("disabled");
        event.target.classList.add("incorrecta");
    } else {
        // resaltar la opción seleccionada como correcta
        console.log("Respuesta correcta!");
        mApp.puntos += 100;
        mApp.acertadas++;
        hidden_answer.textContent = "";
    }

    // mostramos el boton de pregunta siguiente 'netxQuestion'
    MO_objID("btn_nextQuestion", 'block');

    if( numero >= 9){
        MO_objID("btn_nextQuestion", 'none');
        MO_objID("btn_mostrarResultados", 'block');
    }
    else{
        btn_nextQuestion.textContent = "Ir a Pregunta " + (numero+2);
    }
}

let btn_nextQuestion = getById("btn_nextQuestion");
btn_nextQuestion.addEventListener("click", function (event) {
	event.preventDefault();

    siguientePregunta();
});

function siguientePregunta(){

    mApp.preguntaActual++;
    pintarPregunta(mApp.preguntaActual);
    
    // ocultamos el boton de pregunta siguiente 'netxQuestion'
    MO_objID("btn_nextQuestion", 'none');
}

let btn_mostrarResultados = getById("btn_mostrarResultados");
btn_mostrarResultados.addEventListener("click", function (event) {
	event.preventDefault();

    resultadoPartida();
})

function resultadoPartida(){

    mostrarSeccion("results");
    guardarDatosPartida(mApp.usuario, mApp.categoria, mApp.puntos, mApp.acertadas, mApp.fallidas);
    pintarPartidas(mApp.usuario, mApp.categoria, mApp.puntos, mApp.acertadas, mApp.fallidas);

    // ocultamos el boton de pregunta siguiente 'netxQuestion'
    MO_objID("btn_nextQuestion", 'none');
}

// función que obtiene los valores del localStorage 
// del identificador pasado por parametro
function leer_localStorage(identificador){
    let datos = localStorage.getItem(identificador);
    return JSON.parse(datos);
}

function guardarDatosPartida(usuario, categoria, puntos, aciertos, fallos) {

    let user = leer_localStorage("quizGame");

    const quizData = {
        "usuario": usuario,
        "email": "email",
		"partidas": [
			{
				categoria: categoria,
				puntos: puntos,
				aciertos: aciertos,
				fallos: fallos,
				fecha: new Date().toLocaleString()
			}
		]
    };

    // inserto el objeto 'quizData' dentro del array 'user'
    user.push(quizData);

    // guardamos los valores del array 'user' en el localStorage 'user'
    localStorage.setItem(
        "quizGame",
        JSON.stringify(user)
    );
}

function getNombreCategoria(valor) {
    // Utilizamos el método find() para buscar el primer objeto que coincida con el data proporcionado
    const temaEncontrado = temas.find(tema => tema.data === valor);
    return temaEncontrado.nombre;
}

function pintarPartidas(usuario, categoria, puntos, aciertos, fallos) {
    let quizGame = leer_localStorage("quizGame");
    let partidasUsuario = quizGame.filter(user => user.usuario === usuario);

	let nombreCategoria = getNombreCategoria(categoria);

    // Verificar si el usuario fue encontrado
    if (partidasUsuario.length === 0) {
        console.log(`Usuario ${usuario} no encontrado`);
        return [];
    }
	console.log("partidasUsuario", partidasUsuario);

    // Referencia al contenedor en el HTML
    let ranking = document.getElementById('ranking');
    ranking.innerHTML = ''; // Limpiar contenido previo

    const container = document.createElement('div');
    container.className = 'container';

    // Título
    const title = document.createElement('h1');
    title.textContent = 'Quiz Finalizado';
    container.appendChild(title);

    // Logo Quiz
    const questionBox = document.createElement('div');
    questionBox.className = 'question-box';
    const logoImg = document.createElement('img'); // Cambio de nombre para evitar conflicto
    logoImg.src = './assets/img/cuboQuiz.png';
    logoImg.alt = 'logo Quiz';
    questionBox.appendChild(logoImg);
    container.appendChild(questionBox);

    // Nombre Jugador
    const jugador = document.createElement('h4');
    jugador.textContent = 'JUGADOR: ' + usuario;
    container.appendChild(jugador);

	const pCategoria = document.createElement('h4');
    pCategoria.textContent = 'Categoría Jugada: ' + nombreCategoria;
    container.appendChild(pCategoria);

	// Puntos
    const pPuntos = document.createElement('h4');
    pPuntos.textContent = 'Puntos de partida: ' + puntos;
    container.appendChild(pPuntos);

	// Aciertos
    const pAciertos = document.createElement('h4');
    pAciertos.textContent = 'Preguntas Acertadas: ' + aciertos;
    container.appendChild(pAciertos);

	// Fallos
    const pFallos = document.createElement('h4');
    pFallos.textContent = 'Preguntas Fallidas: ' + fallos;
    container.appendChild(pFallos);

    // unimos todas las partidas de todas las categorías
    let todasPartidas = [];
    partidasUsuario.forEach(partidaUsuario => {
        todasPartidas = todasPartidas.concat(partidaUsuario.partidas);
    });

    // ordenamos las partidas por puntos (descendente) y luego por fecha (descendente)
    todasPartidas.sort((a, b) => {
        // comparamos primero por puntos de manera descendente
        if (b.puntos !== a.puntos) {
            return b.puntos - a.puntos; // Orden descendente por puntos
        }
        // si los puntos son iguales, ordenamos por fecha de manera descendente
        return new Date(b.fecha) - new Date(a.fecha); // Orden descendente por fecha
    });

    // Recorrer todas las partidas y pintar en el ranking
    todasPartidas.slice(0, 5).forEach((partida, index) => {
        // Tabla de posiciones
        const leaderboard = document.createElement('div');
        leaderboard.className = 'leaderboard';

        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.style.backgroundColor = (index % 2 === 0) ? '#FFD700' : '#FF69B4';

        const img = document.createElement('img');
        img.src = './assets/img/cuboQuiz.png';
        img.className = 'ranking-icon';
        rankingItem.appendChild(img);

        const pPuntos = document.createElement('span');
        pPuntos.textContent = `${partida.puntos} Puntos`;
        rankingItem.appendChild(pPuntos);

		// Fecha
        const pFecha = document.createElement('span');
        pFecha.innerHTML = `
			<label>Fecha:</label>
			<label>${partida.fecha}</label>
		`;
		rankingItem.appendChild(pFecha);

		// Categoria
		/* const pCategoria = document.createElement('span');
		pCategoria.innerHTML = `
			<label>Categoría:</label>
			<label>${getNombreCategoria(partida.categoria)}</label>
		`;
        rankingItem.appendChild(pCategoria); */

        leaderboard.appendChild(rankingItem);
        container.appendChild(leaderboard);
    });

    // Agregar el contenedor a la sección #ranking
    ranking.appendChild(container);

	// Botón de volver a jugar
	const btn_volverJugar = document.createElement('button');
	btn_volverJugar.id = 'btn_volverJugar';
	btn_volverJugar.textContent = 'Volver a jugar';
	btn_volverJugar.style.margin = '0 5px';
	btn_volverJugar.addEventListener('click', () => {

		mostrarSeccion("quiz");
		MO_objID("boxJuego", "none");
		MO_objID("categorias", "block");
	});
	container.appendChild(btn_volverJugar)

	// Botón de volver a jugar
	const btn_irInicio = document.createElement('button');
	btn_irInicio.id = 'btn_irInicio';
	btn_irInicio.textContent = 'Ir a Inicio';
	btn_irInicio.style.margin = '0 5px';
	btn_irInicio.addEventListener('click', () => {

		window.location.reload();
	});
	container.appendChild(btn_irInicio)
}

// función para desordenar el array de manera aleatoria
// y no aparezcan las respuestas siempre en el mismo orden
function randomizeArray(array) {
    let randomizedArray = [];
    let originalArray = [...array]; // Crear una copia del array original

    for (let i = 0; i < array.length; i++) {
        // elegimos un índice aleatorio
        const randomIndex = Math.floor(Math.random() * originalArray.length);

        // extraemos el elemento del índice aleatorio y lo añadimos al nuevo array
        randomizedArray.push(originalArray[randomIndex]);

        // eliminamos el elemento del array 'originalArray'
        originalArray.splice(randomIndex, 1);
    }
    return randomizedArray;
}

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
// Ejemplo de uso de la función
// renderQuizFinalizado(15000, 5, 5, 'Ken');
pintarGrafica();




