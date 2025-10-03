const socket = io();

let currentPage = 1;
const pageSize = 20;
let isLoading = false;

socket.on("connect", () => {
  loadServices(true); // primera carga
});

socket.on("respuesta", () => {
  currentPage = 1;
  loadServices(true);
});

async function loadServices(reset = false) {
  if (isLoading) return;
  isLoading = true;

  const tabla = document.getElementById("tabla");

  if (reset) {
    tabla.innerHTML = "<p style='text-align:center;'>Cargando...</p>";
  } else {
    document.getElementById("load-more-btn").innerText = "Cargando...";
  }

  const res = await fetch(
    `/api/services?populate=*&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&sort=id:desc`
  );
  const data = await res.json();
  const services = data.data;
  const pageCount = data.meta.pagination.pageCount;

  let btnTextMore = `Cargar más`;
  if (pageCount == currentPage) {
    btnTextMore = `Reiniciar`;
  }

  if (reset) {
    tabla.innerHTML = `
      <div class='table-responsive'>
        <table class='table' border='1' style='border-collapse: collapse; width: 100%;'>
          <thead class='table-light'>
            <tr>
              <th>ID</th>
              <th>N° orden</th>
              <th>Cliente</th>
              <th>Modelo</th>
              <th>Local</th>
              <th>Estado</th>
              <th>Fecha editado</th>
              <th>Fecha de ingreso</th>
            </tr>
          </thead>
          <tbody id="tabla-body"></tbody>
        </table>
      </div>
      <div class="text-center my-3">
        <button id="load-more-btn" class="btn btn-primary">${btnTextMore}</button>
      </div>
    `;
  }

  document.getElementById("load-more-btn").addEventListener("click", () => {
    if (pageCount == currentPage) {
      window.location.reload(); 
    }

    currentPage++;
    loadServices(false);
  });

  const tbody = document.getElementById("tabla-body");

  services.forEach((service) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${service.id}</td>
      <td>${service.numero_de_orden}</td>
      <td>${service.cliente}</td>
      <td>${ (service.modelo) ? service.modelo : "-"}</td>
      <td>${service.local ? service.local.nombre : "-"}</td>
      <td>
        <span class="badge" style="color:#000;background-color:${service.estado_de_service?.color}">
          ${service.estado_de_service ? service.estado_de_service.nombre : "-"}
        </span>
      </td>
      <td>${formatFecha(service.updatedAt)}</td>
      <td>${formatFecha(service.createdAt)}</td>
    `;
    tbody.appendChild(row);
  });

  if (!reset) {
    document.getElementById("load-more-btn").innerText = btnTextMore;
  }

  isLoading = false;
}

function formatFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  const segundos = String(fecha.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
}
