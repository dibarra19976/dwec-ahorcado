// ELEMENTOS DEL HTML
const form = document.getElementById("form");
const select = document.getElementById("select");
const popupParent = document.getElementById("popup-parent");
const attempts = document.getElementById("attempts");
const keys = document.getElementById("keys");
const word = document.getElementById("word");

//VARIABLES
let usedAttempts = 0;
let hiddenWord = "prueba";
let hiddenWordCharArray = [];
let hiddenWordBooleanArray =[];
//EVENTOS
//Evento para la seleccion de categoria
form.addEventListener("submit", (e) => {
  e.preventDefault();
  togglePopup();
});

//Evento para registrar las teclas pulsadas
keys.addEventListener("click", (e) => {
    if(e.target.classList.contains("key")){
        console.log(e.target.innerHTML);
    }
});

//FUNCIONES
function togglePopup() {
  popupParent.classList.toggle("d-animation");
  popupParent.addEventListener("animationend", function () {
    popupParent.classList.toggle("d-none");
  });
}

function showWord(){
    for(let i = 0; i<hiddenWord.length; i++){
        hiddenWordCharArray.push(hiddenWord[i]);
        hiddenWordBooleanArray.push(false);
    }
    console.log(hiddenWord);
    console.log(hiddenWordBooleanArray);
    console.log(hiddenWordCharArray);
}

showWord();