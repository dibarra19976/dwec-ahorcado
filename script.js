// ELEMENTOS
const form = document.getElementById("form");
const select = document.getElementById("select");
const popupParent = document.getElementById("popup-parent");

//EVENTOS

form.addEventListener("submit", (event) => {
    event.preventDefault();
    togglePopup();
})

//funciones
function togglePopup(){
    popupParent.classList.toggle("d-none");
}