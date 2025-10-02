const socket = io();

//const log = (msg) => {
  //document.getElementById("tabla").innerHTML += `<p>${msg}</p>`;
//};

socket.on("connect", () => {
  //log("🔗 Conectado al servidor con ID: " + socket.id);
  loadServices()
});

socket.on("respuesta", (msg) => {
  //log("📩 Servidor dice: " + msg);  
  loadServices()
});

async function loadServices() {
  const res = await fetch("/api/services?populate=*&sort=id:desc");
  const data = await res.json();
  const services = data.data;
  console.log(services)
  
  document.getElementById("tabla").innerHTML = "";

  let html = "<div class='table-responsive'><table class='table' border='1' style='border-collapse: collapse; width: 100%;'>";
  html += "<thead class='table-light'><tr><th>ID</th><th>N° orden</th><th>Cliente</th><th>Local</th><th>Estado</th><th>Fecha editado</th><th>Fecha de ingreso</th></tr></thead>";
  html += "<tbody>";

  services.forEach(service => {
    html += `<tr>
      <td>${service.id}</td>
      <td>${service.numero_de_orden}</td>
      <td>${service.cliente}</td>
      <td>${( service.local ) ? service.local?.nombre : `-`}</td>
      <td><span class="badge" style="color:#000;background-color: ${service.estado_de_service?.color}"> ${( service.estado_de_service ) ? service.estado_de_service?.nombre : `-` }</span></td>
      <td>${formatFecha(service.updatedAt)}</td>
      <td>${formatFecha(service.createdAt)}</td>
    </tr>`;
  });

  html += "</tbody></table></div>";

  document.getElementById("tabla").innerHTML = html;

}

function formatFecha(fechaISO) {
  const fecha = new Date(fechaISO);

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // meses van de 0-11
  const anio = fecha.getFullYear();

  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  const segundos = String(fecha.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
}
