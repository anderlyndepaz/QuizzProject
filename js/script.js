
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

// realizamos la lectura (de momento) del array local
function getQuiz(url) {

    //const valorURL = url;
    const valorURL = `./js/quiz.json`;
    let arr_categorias = [
        9,  // General Knowledge
        11, // Films
        12, // Music
        25  // Arts
    ];
    const randomCategoria = Math.floor(Math.random() * arr_categorias.length);

    //https://opentdb.com/api.php?amount=10&category=${arr_categorias[randomCategoria]}&difficulty=easy&type=multiple
    //const url = `https://api.github.com/users/${username}`;

    let resultado = fetch(valorURL)
        .then(response => {
            if (!response.ok) {
                // si la respuesta no devuelve un ok
                throw new Error(`API no encontrada: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // devolvemos el objeto.results
            return data.results;
        })
        .catch(error => {
            console.error('Error al conectar:', error);
            const boxMensaje = document.getElementById('mensaje');
            let cadena = "";
            cadena += "Error al conectar con la BB.DD";
            //TODO: Crear un string en el que se llame a una imagen según el tipo de error
            // Ejemplo: 
            boxMensaje.innerHTML = cadena; // Mensaje de error en el DOM
        });
        return resultado;
}

/* ************************************* */
/* ************************************* */
/* ************************************* */
// Asignacion de eventos a los objetos del DOM

let btn_quiz = getById("btn_quiz");
let btn_jugar = getById("btn_jugar");
let btn_cancelar = getById("btn_cancelar");
let btn_nextQuestion = getById("btn_nextQuestion");
let form_quiz = getById("form_quiz");

btn_quiz.addEventListener("click", function (event) {
	event.preventDefault();

    mostrarSeccion('quiz');
})

form_quiz.addEventListener("submit", function (event) {
	event.preventDefault();

	let quiz_category = event.target.elements.quiz_category.value;
	let quiz_dificultad = event.target.elements.quiz_dificultad.value;

    mostarInfoJuego('block');
})

btn_jugar.addEventListener("click", function (event) {
	event.preventDefault();

    iniciarJuego();
    MO_objID("boxJuego", 'block');

})

btn_cancelar.addEventListener("click", function (event) {
	event.preventDefault();

    mostarInfoJuego('none');
})

btn_nextQuestion.addEventListener("click", function (event) {
	event.preventDefault();

    siguientePregunta();
})

btn_mostrarResultados.addEventListener("click", function (event) {
	event.preventDefault();

    mostrarResultados();
})


/* ************************************* */
/* ************************************* */
/* ************************************* */
// Funciones de la aplicacion

function mostarInfoJuego(modo){
    MO_objID("infoCapa", modo);
    MO_objID("fondoCapa", modo);
}

function iniciarJuego(){

    mostarInfoJuego('none');
    mostrarSeccion("quiz");

    MO_objQS(".boxFormulario", 'none');

    getQuiz().then(dataQuiz => {
        mApp.preguntaActual = 0;

        // asignamos a la variable global 
        // el valor del array de objetos de fetch
        mApp.arr_preguntas = dataQuiz; 

        pintarPregunta(mApp.preguntaActual);
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
        <div>
            <div class="question neutral" onclick="responderQuiz(event, ${numero});">${arr_preguntas_desordenadas[0]}</div>
            <div class="question neutral" onclick="responderQuiz(event, ${numero});">${arr_preguntas_desordenadas[1]}</div>
            <div class="question neutral" onclick="responderQuiz(event, ${numero});">${arr_preguntas_desordenadas[2]}</div>
            <div class="question neutral" onclick="responderQuiz(event, ${numero});">${arr_preguntas_desordenadas[3]}</div>
        </div>
    `;
    // en la capa padre 'box_cards' insertamos 
    // la capa 'card' ANTES del botón 'btn_nextQuestion'
    box_cards.insertBefore(card, btn_nextQuestion);
    json_datos.appendChild(box_cards);
}

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

        posiblesRespuestas[i].classList.remove("neutral");
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

function siguientePregunta(){

    let btn_nextQuestion = getById("btn_nextQuestion");

    mApp.preguntaActual++;
    pintarPregunta(mApp.preguntaActual);
    
    // ocultamos el boton de pregunta siguiente 'netxQuestion'
    MO_objID("btn_nextQuestion", 'none');
}

/* ************************************* */
/* ************************************* */
/* ************************************* */
// Funciones Utiles

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






