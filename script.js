// ELEMENTOS
const form = document.getElementById("form");
const select = document.getElementById("select");
const popupParent = document.getElementById("popup-parent");
const attempts = document.getElementById("attempts");
//EVENTOS

form.addEventListener("submit", (event) => {
    event.preventDefault();
    togglePopup();
})

//FUNCIONES

function togglePopup(){
    popupParent.classList.toggle("d-none");
}