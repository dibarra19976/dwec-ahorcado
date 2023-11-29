/* ELEMENTOS DEL HTML*/

const form = document.getElementById("form");
const select = document.getElementById("select");
const popupParent = document.getElementById("popup-parent");
const attempts = document.getElementById("attempts");
const keys = document.getElementById("keys");
const word = document.getElementById("word");
const won = document.getElementById("won");
const loose = document.getElementById("loose");

/*VARIABLES*/

let remainingAttempts = 7;
let hiddenWord = "prueba";
let wordCharArray = [];
let wordBoolArray = [];

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
  endGame(wordBoolArray);
}

function endGame(boolArray) {
  if (gameWon(boolArray)) {
    togglePopup(true);
  } else if (!gameWon(boolArray) && remainingAttempts <= 0) {
    togglePopup(false);
  }
}

function startGame(){
  startWordArrays(hiddenWord);
  remainingAttempts = 7;
  restartKeyboard();
  updateInfo("_");
}

function restartKeyboard(){
  let keys = document.querySelectorAll(".key");
  keys.forEach((key) =>{
    key.classList.remove("wrong");
    key.classList.remove("correct");
  })
}
