// Función para obtener los datos desde el archivo JSON
const obtenerDatosDesdeJSON = (archivo, callback) => {
  const request = new XMLHttpRequest();

  request.addEventListener("readystatechange", () => {
    if (request.readyState == 4 && request.status == 200) {
      const respuesta = JSON.parse(request.responseText);
      callback(null, respuesta);
    } else if (request.readyState === 4) {
      callback("No se han podido obtener los datos", null);
    }
  });

  request.open("GET", archivo);
  request.send();
};

// Llamada a la función para obtener las temáticas desde el archivo JSON
obtenerDatosDesdeJSON("palabras.json", (error, datos) => {
  if (error) {
    console.error("Error al obtener las temáticas:", error);
  } else {
    palabras = datos;
  }
});



/* ELEMENTOS DEL HTML*/

const form = document.getElementById("form");
const select = document.getElementById("select");
const popupParent = document.getElementById("popup-parent");
const attempts = document.getElementById("attempts");
const keys = document.getElementById("keys");
const word = document.getElementById("word");
const won = document.getElementById("won");
const loose = document.getElementById("loose");
const tiempo = document.getElementById("tiempo");


/*VARIABLES*/

let remainingAttempts = 7;
let hiddenWord = "prueba";
let wordCharArray = [];
let wordBoolArray = [];

let intervalCrono;
let date = new Date();
date.setHours(0, 0, 0, 0);


/*EVENTOS*/

//Evento para la seleccion de categoria
form.addEventListener("submit", (e) => {
  e.preventDefault();
  togglePopup();
  startGame();
});

//Evento para registrar las teclas pulsadas

//El evento se ejecuta cuando se hace click en el div keys, que contiene otros divs con la clase key, que son las teclas que usara el jugador

keys.addEventListener("click", (e) => {
  //Revisa que el target tenga la clase key para evitar errores al darle click al parent
  if (e.target.classList.contains("key")) {
    advanceTurn(e.target);
  }
});

//FUNCIONES
function togglePopup(bool) {
  if (popupParent.classList.contains("d-animation")) {
    if(bool){
      won.classList.remove("d-none");
    }else{
      loose.classList.remove("d-none");
    }
    popupParent.classList.toggle("d-none");
    popupParent.classList.remove("d-animation");
  } else if (!popupParent.classList.contains("d-animation")) {
    popupParent.classList.add("d-animation");
    popupParent.addEventListener("animationend", function () {
      popupParent.classList.add("d-none");
      won.classList.add("d-none");
      loose.classList.add("d-none");
    });
  }
}

function startWordArrays(string) {
  wordCharArray =[];
  wordBoolArray =[];
  for (let i = 0; i < string.length; i++) {
    wordCharArray.push(string.toLowerCase()[i]);
    wordBoolArray.push(false);
  }
}

function showWord(char, booleanArray, charArray) {
  let string = "";
  for (let i = 0; i < charArray.length; i++) {
    if (charArray[i] === char.toLowerCase()) {
      booleanArray[i] = true;
    }
    if (booleanArray[i] === true) {
      string += charArray[i];
    } else {
      string += "_";
    }
  }
  return string;
}

function testLetter(char, word) {
  return word.toLowerCase().includes(char);
}

function updateAttempts() {
  attempts.innerHTML = remainingAttempts;
}

function updateInfo(char) {
  updateAttempts();
  word.innerHTML = showWord(char, wordBoolArray, wordCharArray);
}

function gameWon(boolArray) {
  let allGuessed = true;
  let i = 0;
  while (allGuessed && i < boolArray.length) {
    if (boolArray[i] == false) {
      allGuessed = false;
    }
    i++;
  }
  return allGuessed;
}

function advanceTurn(e) {
  //Guardamos el string del div key en una variable. El contenido sera una letra mayucula, asi que usamos la funcion toLowerCase para comparlo
  let letter = e.innerHTML.toLowerCase();
  //Uso una funcion que comprueba que la letra este dentro de la palabra
  if (testLetter(letter, hiddenWord)) {
    //Si esta dentro de la palabra
    e.classList.add("correct");
    updateInfo(letter);
  } else {
    e.classList.add("wrong");
    remainingAttempts--;
    updateAttempts();
  }
  reiniciarCrono();
  endGame(wordBoolArray);
}

function endGame(boolArray) {
  if (gameWon(boolArray)) {
    stop();
    togglePopup(true);
  } else if (!gameWon(boolArray) && remainingAttempts <= 0) {
    stop();
    togglePopup(false);
  }
}

function startGame(){
  hiddenWord = selectWord(select.value);
  console.log(hiddenWord);
  startWordArrays(hiddenWord);
  remainingAttempts = 7;
  restartKeyboard();
  updateInfo("_");
  reiniciarCrono();
  start();
  
}

function selectWord(word){
  let category = "";
  if(word === "any"){
    let categories = ["comida", "animales", "objetos", "lugares", "videojuegos"];
    category = categories[getRandomInt(0, categories.length)];
  }
  
  else{
    category = word;
  }
  let wordArray = palabras[category];
  let palabra = wordArray[getRandomInt(0, wordArray.length)];
  return palabra;
}

function restartKeyboard(){
  let keys = document.querySelectorAll(".key");
  keys.forEach((key) =>{
    key.classList.remove("wrong");
    key.classList.remove("correct");
  })
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}


function crono() {
  let horas = date.getHours();
  let minutos = date.getMinutes();
  let segundos = date.getSeconds();

  segundos += 1;

  date.setSeconds(segundos);
  date.setMinutes(minutos);
  date.setHours(horas);

  if (horas < 10) {
    horas = "0" + horas;
  }
  if (minutos < 10) {
    minutos = "0" + minutos;
  }
  if (segundos < 10) {
    segundos = "0" + segundos;
  }
  
  if (segundos==10){
    reiniciarCrono();
    remainingAttempts--;
    updateAttempts();
    tiempo.classList.add("penalty");
    tiempo.addEventListener("animationend", () => {
      tiempo.classList.remove("penalty");
    });
  }
  tiempo.innerHTML = horas + ":" + minutos + ":" + segundos;
}

function reiniciarCrono(){
  date.setHours(0, 0, 0, 0);
  tiempo.innerHTML = "00:00:00";
}

function start() {
  intervalCrono = setInterval(crono, 1000);
}

function stop() {
  clearInterval(intervalCrono);
}

let boton = document.getElementById("boton");
