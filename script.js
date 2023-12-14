// Funcion para obtener los datos almacenados en un archivo JSON
const getJSON = (source, callback) => {
  const request = new XMLHttpRequest();

  request.addEventListener("readystatechange", () => {
    if (request.readyState == 4 && request.status == 200) {
      const respuesta = JSON.parse(request.responseText);
      callback(null, respuesta);
    } else if (request.readyState === 4) {
      callback("Error", null);
    }
  });

  request.open("GET", source);
  request.send();
};

// Llamada a la funcion JSON
getJSON("palabras.json", (error, datos) => {
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
const message = document.getElementById("message");
const tiempo = document.getElementById("tiempo");

/*VARIABLES*/

let usedAttempts = 0;
let remainingAttempts = 7;
let hiddenWord = "prueba";
let wordCharArray = [];
let wordBoolArray = [];

let intervalCrono;
let date = new Date(0);
date.setHours(0, 0, 0, 0);
let segundosPenalizacion = 0;

/*EVENTOS*/

//Evento para la seleccion de categoria y que comience el juego
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

/* FUNCIONES */

//Funcion para enseñar y esconder el popup
function togglePopup(bool) {
  //Si el popup contiene la animacion de desaparecer es porque el juego se ha terminado
  if (popupParent.classList.contains("d-animation")) {
    let h1 = message.querySelector("h1");
    let p = message.querySelector("p");
    message.classList.remove("d-none");
    //Con la variable que se pasa por parametro se indica si se gano o perdio la partida
    if (bool) {
      h1.innerText = `Has ganado en ${usedAttempts} intentos!`;
      p.innerText = `Has consegido adivinar la palabra con ${remainingAttempts} intentos restantes en ${tiempo.innerHTML} `;
    } else {
      h1.innerText = `Has perdido! La palabra oculta era "${hiddenWord}"`;
      p.innerText = `Has usado ${usedAttempts} intentos en ${tiempo.innerHTML} `;
    }
    //se vuelve a mostrar el popup y se quita la animacion
    popupParent.classList.toggle("d-none");
    popupParent.classList.remove("d-animation");
    //Si aun no tiene la animacion
  } else if (!popupParent.classList.contains("d-animation")) {
    //Se añade la animacion y cuando se termina es cuando se esconde el div por completo
    popupParent.classList.add("d-animation");
    popupParent.addEventListener("animationend", function () {
      popupParent.classList.add("d-none");
      message.classList.add("d-none");
    });
  }
}

//Funcion para inicializar los arrays de caracter y booleans
function startWordArrays(string) {
  wordCharArray = [];
  wordBoolArray = [];
  //Se hace un bucle igual de largo que la palabra oculta
  for (let i = 0; i < string.length; i++) {
    //se convierte en minusculas todas las letras para asegurar que todos los caracteres se comparan correcamente
    wordCharArray.push(string.toLowerCase()[i]);
    //en el array de booleans se establece todo como false
    wordBoolArray.push(false);
  }
}

//Funcion hacer un string que muestra solo los caracteres adivinados
function showWord(char, booleanArray, charArray) {
  let string = "";
  //el bucle compara que los caracteres sean iguales o que ya se haya adivinado antes
  //si no se remplaza la letra por un guin bajo
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

//Funcion para ver si la palabra contiene el caracter
function testLetter(char, word) {
  return word.toLowerCase().includes(char);
}

//Funcion que actualiza los intentos de la pagina
function updateAttempts() {
  attempts.innerHTML = remainingAttempts;
}

//funcion que actualiza toda la informacion de la pagina
function updateInfo(char) {
  updateAttempts();
  word.innerHTML = showWord(char, wordBoolArray, wordCharArray);
}

//funcion que mira si el juego fue ganado
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

//Funcion para ejecutar todo lo que pasa cuando el jugador introduce una tecla
function advanceTurn(e) {
  //Guardamos el caracter del div en lowercase en una variable.
  let letter = e.innerHTML.toLowerCase();
  //Usamos la funcion que comprueba que la letra este dentro de la palabra
  if (testLetter(letter, hiddenWord)) {
    //Si esta dentro de la palabra
    //Aumentamos los intentos usados
    usedAttempts++;
    //Hacemos que la tecla se establezca como correcta
    e.classList.add("correct");
    //Actualizamos la informacion
    updateInfo(letter);
    //restablecemos la penalizacion por inactividad
    segundosPenalizacion = 0;
  } else {
    //Si no esta dentro de la palabra
    //Aumentamos los intentos usados
    usedAttempts++;
    //Hacemos que la tecla se establezca como incorrecta
    e.classList.add("wrong");
    //Quitamos uno a los intentos disponibles
    remainingAttempts--;
    //Actualizamos la informacion
    updateAttempts();
    //restablecemos la penalizacion por inactividad
    segundosPenalizacion = 0;
  }
  //Usamos la funcion que mira si el juego se tiene que acabar
  endGame(wordBoolArray);
}

function endGame(boolArray) {
  //Si todas han sido adivinadas
  if (gameWon(boolArray)) {
    //Miramos si ya hay una puntuacion
    var obj = localStorage.getItem(hiddenWord);
    //creamos un objeto para la puntuacion actual
    let objeto = { palabra: hiddenWord, intentos: usedAttempts, tiempo: date };
    //si no hay otra puntacion se convierte en string y se guarda la actual
    if (obj == null || obj === "") {
      objeto = JSON.stringify(objeto);
      localStorage.setItem(hiddenWord, objeto);
      //si ya habia otra puntuacion
    } else {
      //el string se transforma en objeto de vuelta
      obj = JSON.parse(obj);
      //guardamos la informacion del objeto en variables
      let intentos = obj.intentos;
      let tiempo = new Date(obj.tiempo);
      //Comparamos los objetos
      if (date < tiempo) {
        obj = JSON.stringify(obj);
        localStorage.setItem(hiddenWord, obj);
      } else if (date > tiempo) {
        objeto = JSON.stringify(objeto);
        localStorage.setItem(hiddenWord, objeto);
      } else if (usedAttempts > intentos) {
        obj = JSON.stringify(obj);
        localStorage.setItem(hiddenWord, obj);
      } else if (usedAttempts < intentos) {
        objeto = JSON.stringify(objeto);
        localStorage.setItem(hiddenWord, objeto);
      }
    }
    stop();
    togglePopup(true);
    //Si no hay intentos disponibles
  } else if (!gameWon(boolArray) && remainingAttempts <= 0) {
    //se para el temporizador y se muestra el popup
    stop();
    togglePopup(false);
  }
}

// Funcion para empezar la partida
function startGame() {
  //seleccionamos una palabra nueva dependiendo de la categoria seleccionada
  hiddenWord = selectWord(select.value);
  console.log(hiddenWord);
  //inicializamos los arrays
  startWordArrays(hiddenWord);
  //reiniciamos los contadores de los intentos
  usedAttempts = 0;
  remainingAttempts = 7;
  //reiniciamos el teclado
  restartKeyboard();
  //hacemos que se muestre los espacios en blanco de la palabra a adivinar
  updateInfo("_");
  //hacemos que los espacios en blanco se "adivinen" por defecto
  updateInfo(" ");
  //reiniciamos y empezamos el cronometro
  reiniciarCrono();
  start();
}

//funcion para seleccionar una palabra aleatoria
function selectWord(word) {
  let category = "";
  //si la categoria es any (cualquiera) se hace un array con las categorias y se selecciona una aleatoria
  if (word === "any") {
    let categories = [
      "comida",
      "animales",
      "objetos",
      "lugares",
      "videojuegos",
    ];
    category = categories[getRandomInt(0, categories.length)];
    //si no la categoria es la que se le pasa por parametro
  } else {
    category = word;
  }
  // guardamos el array de la categoria
  let wordArray = palabras[category];
  //con una funcion seleccionamos un indice random
  let palabra = wordArray[getRandomInt(0, wordArray.length)];
  return palabra;
}

//seleccionamos todas las teclas y les quitamos las clases que dicen si estan bien o mal
function restartKeyboard() {
  let keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    key.classList.remove("wrong");
    key.classList.remove("correct");
  });
}

//funcion que devuelve un int entre 2 numeros
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

//funcion que maneja el reloj y la penalizacion de inacticida
function crono() {
  let horas = date.getHours();
  let minutos = date.getMinutes();
  let segundos = date.getSeconds();

  segundos += 1;

  date.setSeconds(segundos);
  date.setMinutes(minutos);
  date.setHours(horas);

  if (segundos == 60) {
    segundos = 0;
    minutos += 1;
  }

  if (minutos == 60) {
    minutos = 0;
    horas += 1;
  }

  if (horas < 10) {
    horas = "0" + horas;
  }
  if (minutos < 10) {
    minutos = "0" + minutos;
  }
  if (segundos < 10) {
    segundos = "0" + segundos;
  }

  //si pasan 10 segundos desde que se hizo una accion
  segundosPenalizacion++;
  if (segundosPenalizacion == 10) {
    //se reinicia el contador y se quita un intento
    segundosPenalizacion = 0;
    remainingAttempts--;
    //se actualizan los intentos
    updateAttempts();
    //se añade una animacion
    tiempo.classList.add("penalty");
    tiempo.addEventListener("animationend", () => {
      tiempo.classList.remove("penalty");
    });
    endGame(wordBoolArray);
  }
  tiempo.innerHTML = horas + ":" + minutos + ":" + segundos;
}

//funcion que reinicia el cronometor
function reiniciarCrono() {
  date.setHours(0, 0, 0, 0);
  tiempo.innerHTML = "00:00:00";
}

//funcion que inicia el cronometro
function start() {
  intervalCrono = setInterval(crono, 1000);
}

//funcion que para el cronometro
function stop() {
  clearInterval(intervalCrono);
}
