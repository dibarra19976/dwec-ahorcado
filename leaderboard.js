const tbody = document.getElementById("tbody");

for (var i = 0; i < localStorage.length; i++) {
  let obj = localStorage.getItem(localStorage.key(i));
  obj = JSON.parse(obj);
  let palabra = obj.palabra;
  let tiempo = new Date(obj.tiempo);

  let horas = tiempo.getHours();
  let minutos = tiempo.getMinutes();
  let segundos = tiempo.getSeconds();

  
  if (horas < 10) {
    horas = "0" + horas;
  }
  if (minutos < 10) {
    minutos = "0" + minutos;
  }
  if (segundos < 10) {
    segundos = "0" + segundos;
  }

  tiempo = horas + ":" + minutos + ":" + segundos;

  let intentos = obj.intentos;
  tbody.innerHTML += `<tr><td>${palabra}</td><td>${intentos}</td><td>${tiempo}</td></tr>`;
}
