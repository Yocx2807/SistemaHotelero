import { consultarDatos } from "./api.js";

const API_HOTEL = "https://paginas-web-cr.com/Api/hotelApi/hotel/hotel.php";
const API_SEDE = "https://paginas-web-cr.com/Api/hotelApi/sede/sede.php";
const API_HABITACION = "https://paginas-web-cr.com/Api/hotelApi/habitacion/habitacion.php";
const API_CLIENTE = "https://paginas-web-cr.com/Api/hotelApi/cliente/cliente.php";
const API_RESERVACION = "https://paginas-web-cr.com/Api/hotelApi/reservacion/reservacion.php";
const API_PAGO = "https://paginas-web-cr.com/Api/hotelApi/pago/pago.php";

const btnHabitaciones = document.getElementById("btnHabitaciones");
const btnSedes = document.getElementById("btnSedes");
const btnClientes = document.getElementById("btnClientes");
const btnReservaciones = document.getElementById("btnReservaciones");
const btnPagos = document.getElementById("btnPagos");
const contenido = document.getElementById("contenido");
const btnDashboard = document.getElementById("btnDashboard");
const btnHoteles = document.getElementById("btnHoteles");

let listaHoteles = [];
let hotelSeleccionado = null;
let mostrarClientesActivos = true;

btnDashboard.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarDashboard();
});

btnHoteles.addEventListener("click", () => {
    cargarHoteles();
});

btnSedes.addEventListener("click", () => {
    cargarSedes();
});

btnHabitaciones.addEventListener("click", () => {
    cargarHabitaciones();
});

btnClientes.addEventListener("click", () => {
    mostrarClientesActivos = true;
    cargarClientes();
});

btnReservaciones.addEventListener("click", () => {
    cargarReservaciones();
});

btnPagos.addEventListener("click", () => {
    cargarPagos();
});

document
    .getElementById("btnGuardarHotel")
    .addEventListener("click", guardarHotel);

document
    .getElementById("btnGuardarCliente")
    .addEventListener("click", guardarCliente);

async function mostrarDashboard() {
    contenido.innerHTML = `
        <div class="dashboard-shell">
            <div class="dashboard-hero dashboard-skeleton">
                <div>
                    <span class="dashboard-eyebrow">Sistema Hotelero</span>
                    <h2>Operación hotelera con control total</h2>
                    <p>Gestiona hoteles, sedes, habitaciones, clientes, reservaciones y pagos desde un solo lugar, con una vista rápida de la operación real del día.</p>
                </div>

                <div class="dashboard-hero-card">
                    <div class="hero-card-badge">Resumen</div>
                    <h3>Movimiento diario</h3>
                    <div class="hero-mini-metrics" id="heroMiniMetrics"></div>
                </div>
            </div>

            <div class="dashboard-stats" id="dashboardStats"></div>

            <div class="dashboard-grid">
                <section class="dashboard-panel">
                    <div class="dashboard-panel-header">
                        <div>
                            <span class="dashboard-section-label">Accesos rápidos</span>
                            <h3>Mueve la operación sin abrir menús extras</h3>
                        </div>
                    </div>

                    <div class="dashboard-actions">
                        <button class="dashboard-action" data-module="hoteles">Hoteles</button>
                        <button class="dashboard-action" data-module="sedes">Sedes</button>
                        <button class="dashboard-action" data-module="habitaciones">Habitaciones</button>
                        <button class="dashboard-action" data-module="clientes">Clientes</button>
                        <button class="dashboard-action" data-module="reservaciones">Reservaciones</button>
                        <button class="dashboard-action" data-module="pagos">Pagos</button>
                    </div>
                </section>

                <section class="dashboard-panel dashboard-panel-wide">
                    <div class="dashboard-panel-header">
                        <div>
                            <span class="dashboard-section-label">Resumen visual</span>
                            <h3>Habitaciones y pagos</h3>
                        </div>
                    </div>

                    <div class="dashboard-visuals">
                        <article class="dashboard-chart-card">
                            <div class="dashboard-chart-header">
                                <div>
                                    <span class="dashboard-chart-label">Habitaciones</span>
                                    <h4>Estado actual</h4>
                                </div>
                                <strong id="habitacionesTotal"></strong>
                            </div>

                            <div class="dashboard-donut-wrap">
                                <div class="dashboard-donut" id="donutHabitaciones"></div>
                                <div class="dashboard-donut-center">
                                    <span>Disponibles</span>
                                    <strong id="habitacionesDisponibles"></strong>
                                </div>
                            </div>

                            <div class="dashboard-legend" id="legendHabitaciones"></div>
                        </article>

                        <article class="dashboard-chart-card">
                            <div class="dashboard-chart-header">
                                <div>
                                    <span class="dashboard-chart-label">Pagos</span>
                                    <h4>Distribución por estado</h4>
                                </div>
                                <strong id="pagosTotal"></strong>
                            </div>

                            <div class="dashboard-bars" id="barrasPagos"></div>
                            <div class="dashboard-legend" id="legendPagos"></div>
                        </article>
                    </div>
                </section>
            </div>

            <section class="dashboard-panel dashboard-panel-span">
                <div class="dashboard-panel-header">
                    <div>
                        <span class="dashboard-section-label">Actividad reciente</span>
                        <h3>Últimos registros creados</h3>
                    </div>
                </div>

                <div class="dashboard-activity" id="dashboardActividad"></div>
            </section>
        </div>
    `;

    document.querySelectorAll("[data-module]").forEach(button => {
        button.addEventListener("click", () => {
            const modulo = button.dataset.module;

            if (modulo === "hoteles") cargarHoteles();
            if (modulo === "sedes") cargarSedes();
            if (modulo === "habitaciones") cargarHabitaciones();
            if (modulo === "clientes") cargarClientes();
            if (modulo === "reservaciones") cargarReservaciones();
            if (modulo === "pagos") cargarPagos();
        });
    });

    try {
        const [hoteles, sedes, habitaciones, clientes, reservaciones, pagos] = await Promise.all([
            consultarDatos("hotel"),
            consultarDatos("sede"),
            consultarDatos("habitacion"),
            consultarDatos("cliente"),
            consultarDatos("reservacion"),
            consultarDatos("pago")
        ]);

        const stats = [
            { label: "Hoteles", value: hoteles.data.length, tone: "tone-indigo" },
            { label: "Sedes", value: sedes.data.length, tone: "tone-teal" },
            { label: "Habitaciones", value: habitaciones.data.length, tone: "tone-gold" },
            { label: "Clientes", value: clientes.data.length, tone: "tone-coral" },
            { label: "Reservaciones", value: reservaciones.data.length, tone: "tone-sky" },
            { label: "Pagos", value: pagos.data.length, tone: "tone-violet" }
        ];

        document.getElementById("dashboardStats").innerHTML = stats.map(item => `
            <article class="dashboard-stat-card ${item.tone}">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
            </article>
        `).join("");

        const habitacionesDisponibles = contarEstado(habitaciones.data, "estado", "Disponible");
        const habitacionesOcupadas = contarEstado(habitaciones.data, "estado", "Ocupada");
        const habitacionesMantenimiento = contarEstado(habitaciones.data, "estado", "Mantenimiento");

        const pagosPendientes = contarEstado(pagos.data, "estado", "Pendiente");
        const pagosRechazados = contarEstado(pagos.data, "estado", "Rechazado");
        const pagosPagados = contarEstado(pagos.data, "estado", "Pagado");

        const totalHabitaciones = habitacionesDisponibles + habitacionesOcupadas + habitacionesMantenimiento;
        const totalPagos = pagosPendientes + pagosRechazados + pagosPagados;
        const maxPago = Math.max(pagosPendientes, pagosRechazados, pagosPagados, 1);

        document.getElementById("heroMiniMetrics").innerHTML = `
            <div class="hero-mini-metric">
                <span>Disponibles</span>
                <strong>${habitacionesDisponibles}</strong>
            </div>
            <div class="hero-mini-metric">
                <span>Pendientes</span>
                <strong>${pagosPendientes}</strong>
            </div>
        `;

        document.getElementById("habitacionesTotal").textContent = `${totalHabitaciones} total`;
        document.getElementById("habitacionesDisponibles").textContent = habitacionesDisponibles;
        document.getElementById("donutHabitaciones").style.background = `conic-gradient(${construirConicGradient([
            { valor: habitacionesDisponibles, color: "#10b981" },
            { valor: habitacionesOcupadas, color: "#f59e0b" },
            { valor: habitacionesMantenimiento, color: "#ef4444" }
        ])})`;
        document.getElementById("legendHabitaciones").innerHTML = `
            <div class="legend-row"><span class="dot dot-green"></span><span>Disponibles</span><strong>${habitacionesDisponibles}</strong></div>
            <div class="legend-row"><span class="dot dot-amber"></span><span>Ocupadas</span><strong>${habitacionesOcupadas}</strong></div>
            <div class="legend-row"><span class="dot dot-red"></span><span>Mantenimiento</span><strong>${habitacionesMantenimiento}</strong></div>
        `;

        document.getElementById("pagosTotal").textContent = `${totalPagos} total`;
        document.getElementById("barrasPagos").innerHTML = `
            <div class="bar-item">
                <span>Pendiente</span>
                <div class="bar-track"><div class="bar-fill bar-pending" style="height:${Math.max(14, (pagosPendientes / maxPago) * 100)}%"></div></div>
                <strong>${pagosPendientes}</strong>
            </div>
            <div class="bar-item">
                <span>Rechazado</span>
                <div class="bar-track"><div class="bar-fill bar-rejected" style="height:${Math.max(14, (pagosRechazados / maxPago) * 100)}%"></div></div>
                <strong>${pagosRechazados}</strong>
            </div>
            <div class="bar-item">
                <span>Pagado</span>
                <div class="bar-track"><div class="bar-fill bar-paid" style="height:${Math.max(14, (pagosPagados / maxPago) * 100)}%"></div></div>
                <strong>${pagosPagados}</strong>
            </div>
        `;
        document.getElementById("legendPagos").innerHTML = `
            <div class="legend-row"><span class="dot dot-blue"></span><span>Pendientes</span><strong>${pagosPendientes}</strong></div>
            <div class="legend-row"><span class="dot dot-rose"></span><span>Rechazados</span><strong>${pagosRechazados}</strong></div>
            <div class="legend-row"><span class="dot dot-indigo"></span><span>Pagados</span><strong>${pagosPagados}</strong></div>
        `;

        const recientes = [
            {
                label: "Hotel",
                title: hoteles.data[0]?.nombre || "Sin hoteles",
                detail: hoteles.data[0]?.descripcion || "Todavía no hay registros recientes."
            },
            {
                label: "Reservación",
                title: reservaciones.data[0] ? `#${reservaciones.data[0].id} - ${reservaciones.data[0].estado}` : "Sin reservaciones",
                detail: reservaciones.data[0] ? `${reservaciones.data[0].fecha_entrada} a ${reservaciones.data[0].fecha_salida}` : "Aún no hay actividad reciente."
            },
            {
                label: "Pago",
                title: pagos.data[0] ? `${pagos.data[0].metodo} - ${pagos.data[0].estado}` : "Sin pagos",
                detail: pagos.data[0] ? `Monto ${pagos.data[0].monto}` : "Aún no se han registrado pagos."
            }
        ];

        document.getElementById("dashboardActividad").innerHTML = recientes.map(item => `
            <div class="activity-item">
                <div class="activity-dot"></div>
                <div>
                    <span>${item.label}</span>
                    <h4>${item.title}</h4>
                    <p>${item.detail}</p>
                </div>
            </div>
        `).join("");
    } catch (error) {
        document.getElementById("dashboardStats").innerHTML = `
            <div class="dashboard-error">
                No se pudo cargar el panel inicial.
            </div>
        `;
        document.getElementById("dashboardActividad").innerHTML = `
            <div class="dashboard-error">
                Revisa la conexión con la API.
            </div>
        `;
        console.error(error);
    }
}

function normalizarFechaInput(fecha) {
    return (fecha ?? "").toString().slice(0, 10);
}

function estadoActivo(registro) {
    return Number(registro?.activo) === 1;
}

function renderBadgeEstadoRegistro(registro) {
    return `
        <span class="badge ${estadoActivo(registro) ? "text-bg-success" : "text-bg-secondary"}">
            ${estadoActivo(registro) ? "Activo" : "Desactivado"}
        </span>
    `;
}

function contarEstado(lista, campo, valor) {
    return lista.filter(item => String(item?.[campo] ?? "").trim().toLowerCase() === valor.toLowerCase()).length;
}

function construirConicGradient(partes) {
    const total = partes.reduce((acumulado, parte) => acumulado + parte.valor, 0) || 1;
    let acumulado = 0;

    return partes.map(parte => {
        const inicio = (acumulado / total) * 100;
        acumulado += parte.valor;
        const fin = (acumulado / total) * 100;
        return `${parte.color} ${inicio}% ${fin}%`;
    }).join(", ");
}

function opcionesEstadoReservacion(seleccionado = "") {
    const opciones = ["Confirmada", "Finalizada", "Cancelada", "Pendiente"];

    return `
        <option value="">Seleccione un estado</option>
        ${opciones.map(opcion => `
            <option value="${opcion}" ${opcion === seleccionado ? "selected" : ""}>${opcion}</option>
        `).join("")}
    `;
}

function opcionesEstadoPago(seleccionado = "") {
    const opciones = ["Pendiente", "Rechazado", "Pagado"];

    return `
        <option value="">Seleccione un estado</option>
        ${opciones.map(opcion => `
            <option value="${opcion}" ${opcion === seleccionado ? "selected" : ""}>${opcion}</option>
        `).join("")}
    `;
}

function opcionesTipoHabitacion(seleccionado = "") {
    const opciones = ["Suite", "Doble", "Familiar", "Estandar"];

    return `
        <option value="">Seleccione un tipo</option>
        ${opciones.map(opcion => `
            <option value="${opcion}" ${opcion === seleccionado ? "selected" : ""}>${opcion}</option>
        `).join("")}
    `;
}

function opcionesEstadoHabitacion(seleccionado = "") {
    const opciones = ["Disponible", "Ocupada", "Mantenimiento"];

    return `
        <option value="">Seleccione un estado</option>
        ${opciones.map(opcion => `
            <option value="${opcion}" ${opcion === seleccionado ? "selected" : ""}>${opcion}</option>
        `).join("")}
    `;
}

async function cargarClientes() {
    const respuesta = await consultarDatos("cliente");
    const clientesFiltrados = respuesta.data.filter(cliente => {
        return mostrarClientesActivos ? Number(cliente.activo) === 1 : Number(cliente.activo) === 0;
    });

    contenido.innerHTML = `
        <h2>Clientes</h2>

        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <button class="btn btn-dark" id="btnNuevoCliente">
                Nuevo Cliente
            </button>

            <div class="form-check form-switch m-0">
                <input class="form-check-input" type="checkbox" role="switch" id="switchClientes">
                <label class="form-check-label" for="switchClientes">
                    Ver desactivados
                </label>
            </div>
        </div>

        <div class="mb-3 text-muted" id="textoFiltroClientes"></div>

        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Identificación</th>
                    <th>Usuario</th>
                    <th>Fecha Creación</th>
                    <th>Activo</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>

            <tbody id="tablaClientes"></tbody>
        </table>
    `;

    const tablaClientes = document.getElementById("tablaClientes");
    const switchClientes = document.getElementById("switchClientes");
    const textoFiltroClientes = document.getElementById("textoFiltroClientes");

    switchClientes.checked = !mostrarClientesActivos;
    textoFiltroClientes.textContent = mostrarClientesActivos
        ? "Mostrando clientes activos."
        : "Mostrando clientes desactivados.";

    if (clientesFiltrados.length === 0) {
        tablaClientes.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-muted py-4">
                    No hay clientes para mostrar en esta vista.
                </td>
            </tr>
        `;
    }

    clientesFiltrados.forEach(cliente => {
        const estaActivo = Number(cliente.activo) === 1;
        const puedeEditar = estaActivo;

        tablaClientes.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nombre ?? ""}</td>
                <td>${cliente.apellidos ?? ""}</td>
                <td>${cliente.correo ?? ""}</td>
                <td>${cliente.telefono ?? ""}</td>
                <td>${cliente.identificacion ?? ""}</td>
                <td>${cliente.usuario ?? ""}</td>
                <td>${cliente.fecha_creacion ?? ""}</td>
                <td>
                    <span class="badge ${estaActivo ? "text-bg-success" : "text-bg-secondary"}">
                        ${estaActivo ? "Activo" : "Desactivado"}
                    </span>
                </td>
                <td class="text-center">
                    <div class="d-flex gap-2 justify-content-center">
                        ${puedeEditar ? `
                            <button
                                class="btn btn-secondary btn-sm"
                                onclick='editarCliente(${JSON.stringify(cliente)})'>
                                Editar
                            </button>
                        ` : `
                            <button class="btn btn-outline-secondary btn-sm" disabled>
                                Editar
                            </button>
                        `}

                        ${estaActivo ? `
                            <button
                                class="btn btn-dark btn-sm"
                                onclick="abrirModalEliminarCliente(${cliente.id})">
                                Desactivar
                            </button>
                        ` : `
                            <button class="btn btn-outline-secondary btn-sm" disabled>
                                Desactivado
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    });

    switchClientes.addEventListener("change", () => {
        mostrarClientesActivos = !switchClientes.checked;
        cargarClientes();
    });

    document.getElementById("btnNuevoCliente").addEventListener("click", () => {
        limpiarFormularioCliente();

        const modal = new bootstrap.Modal(
            document.getElementById("modalCliente")
        );

        modal.show();
    });
}

function limpiarFormularioCliente() {
    document.getElementById("idCliente").value = "";
    document.getElementById("nombreCliente").value = "";
    document.getElementById("apellidosCliente").value = "";
    document.getElementById("correoCliente").value = "";
    document.getElementById("telefonoCliente").value = "";
    document.getElementById("identificacionCliente").value = "";
    document.getElementById("usuarioCliente").value = "";
    document.getElementById("mensajeCliente").innerHTML = "";

    document.getElementById("tituloModalCliente").textContent = "Nuevo Cliente";
    document.getElementById("btnGuardarCliente").textContent = "Guardar";
}

async function guardarCliente() {
    const idCliente = document.getElementById("idCliente").value;

    const cliente = {
        nombre: document.getElementById("nombreCliente").value.trim(),
        apellidos: document.getElementById("apellidosCliente").value.trim(),
        correo: document.getElementById("correoCliente").value.trim(),
        telefono: document.getElementById("telefonoCliente").value.trim(),
        identificacion: document.getElementById("identificacionCliente").value.trim(),
        usuario: document.getElementById("usuarioCliente").value.trim()
    };

    const error = validarCliente(cliente);

    if (error !== "") {
        mostrarMensajeCliente(error, "danger");
        return;
    }

    if (idCliente === "") {
        crearCliente(cliente);
    } else {
        actualizarCliente(idCliente, cliente);
    }
}

async function crearCliente(cliente) {
    try {
        const respuesta = await fetch(API_CLIENTE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionCliente(datos.message || "Cliente creado correctamente");
        } else {
            mostrarMensajeCliente(datos.message || "No se pudo crear el cliente.", "danger");
        }

    } catch (error) {
        mostrarMensajeCliente("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

async function actualizarCliente(idCliente, cliente) {
    try {
        cliente.id = idCliente;

        const respuesta = await fetch(API_CLIENTE, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionCliente(datos.message || "Cliente actualizado correctamente");
        } else {
            mostrarMensajeCliente(datos.message || "No se pudo actualizar el cliente.", "danger");
        }

    } catch (error) {
        mostrarMensajeCliente("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

function validarCliente(cliente) {
    if (
        cliente.nombre === "" ||
        cliente.apellidos === "" ||
        cliente.correo === "" ||
        cliente.telefono === "" ||
        cliente.identificacion === "" ||
        cliente.usuario === ""
    ) {
        return "Todos los campos son obligatorios.";
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(cliente.correo)) {
        return "Debe ingresar un correo válido.";
    }

    return "";
}

function mostrarMensajeCliente(mensaje, tipo) {
    document.getElementById("mensajeCliente").innerHTML = `
        <div class="alert alert-${tipo}">
            ${mensaje}
        </div>
    `;
}

function finalizarAccionCliente(mensaje) {
    mostrarMensajeCliente(mensaje, "success");

    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalCliente")
        );

        modal.hide();
        limpiarFormularioCliente();
        cargarClientes();
    }, 1000);
}

async function cargarReservaciones() {
    const respuesta = await consultarDatos("reservacion");
    const reservacionesFiltradas = respuesta.data.filter(reservacion => estadoActivo(reservacion));

    contenido.innerHTML = `
        <h2>Reservaciones</h2>

        <button class="btn btn-dark mb-4" id="btnNuevaReservacion">
            Nueva Reservación
        </button>

        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ID Cliente</th>
                    <th>ID Habitación</th>
                    <th>Fecha Entrada</th>
                    <th>Fecha Salida</th>
                    <th>Personas</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Registro</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>

            <tbody id="tablaReservaciones"></tbody>
        </table>
    `;

    const tablaReservaciones = document.getElementById("tablaReservaciones");

    if (reservacionesFiltradas.length === 0) {
        tablaReservaciones.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-muted py-4">
                    No hay reservaciones para mostrar.
                </td>
            </tr>
        `;
    }

    reservacionesFiltradas.forEach(reservacion => {
        tablaReservaciones.innerHTML += `
            <tr>
                <td>${reservacion.id}</td>
                <td>${reservacion.id_cliente}</td>
                <td>${reservacion.id_habitacion}</td>
                <td>${reservacion.fecha_entrada}</td>
                <td>${reservacion.fecha_salida}</td>
                <td>${reservacion.cantidad_personas}</td>
                <td>${reservacion.estado}</td>
                <td>${reservacion.total}</td>
                <td>${renderBadgeEstadoRegistro(reservacion)}</td>
                <td class="text-center">
                    <div class="d-flex gap-2 justify-content-center">
                        <button
                            class="btn btn-secondary btn-sm"
                            onclick='editarReservacion(${JSON.stringify(reservacion)})'>
                            Editar
                        </button>

                        <button
                            class="btn btn-dark btn-sm"
                            onclick="abrirModalEliminarReservacion(${reservacion.id})">
                            Desactivar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    document.getElementById("btnNuevaReservacion").addEventListener("click", () => {
        limpiarFormularioReservacion();

        const modal = new bootstrap.Modal(
            document.getElementById("modalReservacion")
        );

        modal.show();
    });
}

function limpiarFormularioReservacion() {
    document.getElementById("idReservacion").value = "";
    document.getElementById("idClienteReservacion").value = "";
    document.getElementById("idHabitacionReservacion").value = "";
    document.getElementById("fechaEntradaReservacion").value = "";
    document.getElementById("fechaSalidaReservacion").value = "";
    document.getElementById("cantidadPersonasReservacion").value = "";
    document.getElementById("estadoReservacion").value = "";
    document.getElementById("totalReservacion").value = "";
    document.getElementById("mensajeReservacion").innerHTML = "";

    document.getElementById("tituloModalReservacion").textContent = "Nueva Reservación";
    document.getElementById("btnGuardarReservacion").textContent = "Guardar";
}

document
    .getElementById("btnGuardarReservacion")
    .addEventListener("click", guardarReservacion);

async function guardarReservacion() {
    const idReservacion = document.getElementById("idReservacion").value;

    const reservacion = {
        id_cliente: document.getElementById("idClienteReservacion").value.trim(),
        id_habitacion: document.getElementById("idHabitacionReservacion").value.trim(),
        fecha_entrada: document.getElementById("fechaEntradaReservacion").value.trim(),
        fecha_salida: document.getElementById("fechaSalidaReservacion").value.trim(),
        cantidad_personas: document.getElementById("cantidadPersonasReservacion").value.trim(),
        estado: document.getElementById("estadoReservacion").value.trim(),
        total: document.getElementById("totalReservacion").value.trim()
    };

    const error = validarReservacion(reservacion);

    if (error !== "") {
        mostrarMensajeReservacion(error, "danger");
        return;
    }

    if (idReservacion === "") {
        crearReservacion(reservacion);
    } else {
        actualizarReservacion(idReservacion, reservacion);
    }
}

async function crearReservacion(reservacion) {
    try {
        const respuesta = await fetch(API_RESERVACION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reservacion)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionReservacion(datos.message || "Reservación creada correctamente");
        } else {
            mostrarMensajeReservacion(datos.message || "No se pudo crear la reservación.", "danger");
        }

    } catch (error) {
        mostrarMensajeReservacion("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

async function actualizarReservacion(idReservacion, reservacion) {
    try {
        reservacion.id = idReservacion;

        const respuesta = await fetch(API_RESERVACION, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reservacion)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionReservacion(datos.message || "Reservación actualizada correctamente");
        } else {
            mostrarMensajeReservacion(datos.message || "No se pudo actualizar la reservación.", "danger");
        }

    } catch (error) {
        mostrarMensajeReservacion("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

function validarReservacion(reservacion) {
    if (
        reservacion.id_cliente === "" ||
        reservacion.id_habitacion === "" ||
        reservacion.fecha_entrada === "" ||
        reservacion.fecha_salida === "" ||
        reservacion.cantidad_personas === "" ||
        reservacion.estado === "" ||
        reservacion.total === ""
    ) {
        return "Todos los campos son obligatorios.";
    }

    return "";
}

function mostrarMensajeReservacion(mensaje, tipo) {
    document.getElementById("mensajeReservacion").innerHTML = `
        <div class="alert alert-${tipo}">
            ${mensaje}
        </div>
    `;
}

function finalizarAccionReservacion(mensaje) {
    mostrarMensajeReservacion(mensaje, "success");

    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalReservacion")
        );

        modal.hide();
        limpiarFormularioReservacion();
        cargarReservaciones();
    }, 1000);
}

window.editarReservacion = function (reservacion) {
    document.getElementById("idReservacion").value = reservacion.id;
    document.getElementById("idClienteReservacion").value = reservacion.id_cliente ?? "";
    document.getElementById("idHabitacionReservacion").value = reservacion.id_habitacion ?? "";
    document.getElementById("fechaEntradaReservacion").value = normalizarFechaInput(reservacion.fecha_entrada);
    document.getElementById("fechaSalidaReservacion").value = normalizarFechaInput(reservacion.fecha_salida);
    document.getElementById("cantidadPersonasReservacion").value = reservacion.cantidad_personas ?? "";
    document.getElementById("estadoReservacion").value = reservacion.estado ?? "";
    document.getElementById("totalReservacion").value = reservacion.total ?? "";

    document.getElementById("tituloModalReservacion").textContent = "Editar Reservación";
    document.getElementById("btnGuardarReservacion").textContent = "Actualizar";
    document.getElementById("mensajeReservacion").innerHTML = "";

    const modal = new bootstrap.Modal(
        document.getElementById("modalReservacion")
    );

    modal.show();
};

window.abrirModalEliminarReservacion = function (idReservacion) {
    document.getElementById("idReservacionEliminar").value = idReservacion;

    const modal = new bootstrap.Modal(
        document.getElementById("modalEliminarReservacion")
    );

    modal.show();
};

document
    .getElementById("btnConfirmarEliminarReservacion")
    .addEventListener("click", eliminarReservacion);

async function eliminarReservacion() {
    const idReservacion = document.getElementById("idReservacionEliminar").value;

    try {
        const respuesta = await fetch(API_RESERVACION, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idReservacion
            })
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarReservacion")
            );

            modal.hide();

            mostrarMensajeReservacion(
                datos.message || "Reservación desactivada correctamente",
                "success"
            );

            setTimeout(() => {
                cargarReservaciones();
            }, 1000);

        } else {
            mostrarMensajeReservacion(
                datos.message || "No se pudo desactivar la reservación.",
                "danger"
            );
        }

    } catch (error) {
        mostrarMensajeReservacion("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

async function cargarPagos() {
    const respuesta = await consultarDatos("pago");
    const pagosFiltrados = respuesta.data.filter(pago => estadoActivo(pago));

    contenido.innerHTML = `
        <h2>Pagos</h2>

        <button class="btn btn-dark mb-4" id="btnNuevoPago">
            Nuevo Pago
        </button>

        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ID Reservación</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Detalle</th>
                    <th>Estado</th>
                    <th>Fecha Pago</th>
                    <th>Registro</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>

            <tbody id="tablaPagos"></tbody>
        </table>
    `;

    const tablaPagos = document.getElementById("tablaPagos");

    if (pagosFiltrados.length === 0) {
        tablaPagos.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-muted py-4">
                    No hay pagos para mostrar.
                </td>
            </tr>
        `;
    }

    pagosFiltrados.forEach(pago => {
        tablaPagos.innerHTML += `
            <tr>
                <td>${pago.id}</td>
                <td>${pago.id_reservacion}</td>
                <td>${pago.monto}</td>
                <td>${pago.metodo}</td>
                <td>${pago.detalle}</td>
                <td>${pago.estado}</td>
                <td>${pago.fecha_pago}</td>
                <td>${renderBadgeEstadoRegistro(pago)}</td>
                <td class="text-center">
                    <div class="d-flex gap-2 justify-content-center">
                        <button
                            class="btn btn-secondary btn-sm"
                            onclick='editarPago(${JSON.stringify(pago)})'>
                            Editar
                        </button>

                        <button
                            class="btn btn-dark btn-sm"
                            onclick="abrirModalEliminarPago(${pago.id})">
                            Desactivar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    document.getElementById("btnNuevoPago").addEventListener("click", () => {
        limpiarFormularioPago();

        const modal = new bootstrap.Modal(
            document.getElementById("modalPago")
        );

        modal.show();
    });
}

function limpiarFormularioPago() {
    document.getElementById("idPago").value = "";
    document.getElementById("idReservacionPago").value = "";
    document.getElementById("montoPago").value = "";
    document.getElementById("metodoPago").value = "";
    document.getElementById("detallePago").value = "";
    document.getElementById("estadoPago").value = "";
    document.getElementById("fechaPago").value = "";
    document.getElementById("mensajePago").innerHTML = "";

    document.getElementById("tituloModalPago").textContent = "Nuevo Pago";
    document.getElementById("btnGuardarPago").textContent = "Guardar";
}

document
    .getElementById("btnGuardarPago")
    .addEventListener("click", guardarPago);

async function guardarPago() {
    const idPago = document.getElementById("idPago").value;

    const pago = {
        id_reservacion: document.getElementById("idReservacionPago").value.trim(),
        monto: document.getElementById("montoPago").value.trim(),
        metodo: document.getElementById("metodoPago").value.trim(),
        detalle: document.getElementById("detallePago").value.trim(),
        estado: document.getElementById("estadoPago").value.trim(),
        fecha_pago: document.getElementById("fechaPago").value.trim()
    };

    const error = validarPago(pago);

    if (error !== "") {
        mostrarMensajePago(error, "danger");
        return;
    }

    if (idPago === "") {
        crearPago(pago);
    } else {
        actualizarPago(idPago, pago);
    }
}

async function crearPago(pago) {
    try {
        const respuesta = await fetch(API_PAGO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pago)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionPago(datos.message || "Pago creado correctamente");
        } else {
            mostrarMensajePago(datos.message || "No se pudo crear el pago.", "danger");
        }

    } catch (error) {
        mostrarMensajePago("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

async function actualizarPago(idPago, pago) {
    try {
        pago.id = idPago;

        const respuesta = await fetch(API_PAGO, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pago)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionPago(datos.message || "Pago actualizado correctamente");
        } else {
            mostrarMensajePago(datos.message || "No se pudo actualizar el pago.", "danger");
        }

    } catch (error) {
        mostrarMensajePago("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

function validarPago(pago) {
    if (
        pago.id_reservacion === "" ||
        pago.monto === "" ||
        pago.metodo === "" ||
        pago.detalle === "" ||
        pago.estado === "" ||
        pago.fecha_pago === ""
    ) {
        return "Todos los campos son obligatorios.";
    }

    return "";
}

function mostrarMensajePago(mensaje, tipo) {
    document.getElementById("mensajePago").innerHTML = `
        <div class="alert alert-${tipo}">
            ${mensaje}
        </div>
    `;
}

function finalizarAccionPago(mensaje) {
    mostrarMensajePago(mensaje, "success");

    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalPago")
        );

        modal.hide();
        limpiarFormularioPago();
        cargarPagos();
    }, 1000);
}

window.editarPago = function (pago) {
    document.getElementById("idPago").value = pago.id;
    document.getElementById("idReservacionPago").value = pago.id_reservacion ?? "";
    document.getElementById("montoPago").value = pago.monto ?? "";
    document.getElementById("metodoPago").value = pago.metodo ?? "";
    document.getElementById("detallePago").value = pago.detalle ?? "";
    document.getElementById("estadoPago").value = pago.estado ?? "";
    document.getElementById("fechaPago").value = normalizarFechaInput(pago.fecha_pago);

    document.getElementById("tituloModalPago").textContent = "Editar Pago";
    document.getElementById("btnGuardarPago").textContent = "Actualizar";
    document.getElementById("mensajePago").innerHTML = "";

    const modal = new bootstrap.Modal(
        document.getElementById("modalPago")
    );

    modal.show();
};

window.abrirModalEliminarPago = function (idPago) {
    document.getElementById("idPagoEliminar").value = idPago;

    const modal = new bootstrap.Modal(
        document.getElementById("modalEliminarPago")
    );

    modal.show();
};

document
    .getElementById("btnConfirmarEliminarPago")
    .addEventListener("click", eliminarPago);

async function eliminarPago() {
    const idPago = document.getElementById("idPagoEliminar").value;

    try {
        const respuesta = await fetch(API_PAGO, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idPago
            })
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarPago")
            );

            modal.hide();

            mostrarMensajePago(
                datos.message || "Pago desactivado correctamente",
                "success"
            );

            setTimeout(() => {
                cargarPagos();
            }, 1000);

        } else {
            mostrarMensajePago(
                datos.message || "No se pudo desactivar el pago.",
                "danger"
            );
        }

    } catch (error) {
        mostrarMensajePago("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

window.editarCliente = function (cliente) {
    document.getElementById("idCliente").value = cliente.id;
    document.getElementById("nombreCliente").value = cliente.nombre ?? "";
    document.getElementById("apellidosCliente").value = cliente.apellidos ?? "";
    document.getElementById("correoCliente").value = cliente.correo ?? "";
    document.getElementById("telefonoCliente").value = cliente.telefono ?? "";
    document.getElementById("identificacionCliente").value = cliente.identificacion ?? "";
    document.getElementById("usuarioCliente").value = cliente.usuario ?? "";

    document.getElementById("tituloModalCliente").textContent = "Editar Cliente";
    document.getElementById("btnGuardarCliente").textContent = "Actualizar";
    document.getElementById("mensajeCliente").innerHTML = "";

    const modal = new bootstrap.Modal(
        document.getElementById("modalCliente")
    );

    modal.show();
};

window.abrirModalEliminarCliente = function (idCliente) {
    document.getElementById("idClienteEliminar").value = idCliente;

    const modal = new bootstrap.Modal(
        document.getElementById("modalEliminarCliente")
    );

    modal.show();
};

document
    .getElementById("btnConfirmarEliminarCliente")
    .addEventListener("click", eliminarCliente);

async function eliminarCliente() {
    const idCliente = Number(document.getElementById("idClienteEliminar").value);

    try {
        const respuesta = await fetch(API_CLIENTE, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idCliente
            })
        });

        const textoRespuesta = await respuesta.text();
        let datos = {};

        try {
            datos = textoRespuesta ? JSON.parse(textoRespuesta) : {};
        } catch (errorParseo) {
            console.error("La API de clientes no devolvió JSON válido:", textoRespuesta);
        }

        if (!respuesta.ok) {
            console.error("Error HTTP al desactivar cliente:", respuesta.status, textoRespuesta);
            mostrarMensajeCliente(
                `La API respondió con estado ${respuesta.status}. Revisa la consola para más detalles.`,
                "danger"
            );
            return;
        }

        if (datos.code === 200) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarCliente")
            );

            modal.hide();

            mostrarMensajeCliente(
                datos.message || "Cliente desactivado correctamente",
                "success"
            );

            setTimeout(() => {
                cargarClientes();
            }, 1000);

        } else {
            console.error("Respuesta inesperada al desactivar cliente:", datos, textoRespuesta);
            mostrarMensajeCliente(
                datos.message || "No se pudo desactivar el cliente. Revisa la consola.",
                "danger"
            );
        }

    } catch (error) {
        console.error("Excepción al desactivar cliente:", error);
        mostrarMensajeCliente("Error al conectar con la API.", "danger");
    }
}

async function cargarHoteles() {
    const respuesta = await consultarDatos("hotel");
    
    listaHoteles = respuesta.data;

    contenido.innerHTML = `
        <h2>Hoteles</h2>

        <button class="btn btn-dark mb-4" id="btnNuevoHotel">
            Nuevo Hotel
        </button>

        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Sitio Web</th>
                    <th>Estado</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>

            <tbody id="tablaHoteles"></tbody>
        </table>
    `;

    const tablaHoteles = document.getElementById("tablaHoteles");

    respuesta.data.forEach(hotel => {
        tablaHoteles.innerHTML += `
            <tr>
                <td>${hotel.id}</td>
                <td>${hotel.nombre}</td>
                <td>${hotel.descripcion}</td>
                <td>${hotel.telefono}</td>
                <td>${hotel.correo}</td>
                <td>${hotel.sitio_web}</td>
                <td>${hotel.estado}</td>
                <td class="text-center">
                    <div class="d-flex gap-2 justify-content-center">

                        <button
                            class="btn btn-secondary btn-sm"
                            onclick='editarHotel(${JSON.stringify(hotel)})'>
                            Editar
                        </button>

                        <button
                            class="btn btn-dark btn-sm"
                            onclick="abrirModalEliminarHotel(${hotel.id})">
                            Desactivar
                        </button>

                    </div>
                </td>
            </tr>
        `;
    });

    document.getElementById("btnNuevoHotel").addEventListener("click", () => {
        limpiarFormularioHotel();

        const modal = new bootstrap.Modal(
            document.getElementById("modalHotel")
        );

        modal.show();
    });
}

function limpiarFormularioHotel() {
    document.getElementById("idHotel").value = "";
    document.getElementById("nombreHotel").value = "";
    document.getElementById("descripcionHotel").value = "";
    document.getElementById("telefonoHotel").value = "";
    document.getElementById("correoHotel").value = "";
    document.getElementById("sitioWebHotel").value = "";
    document.getElementById("mensajeHotel").innerHTML = "";

    document.querySelector(".modal-title").textContent = "Nuevo Hotel";
    document.getElementById("btnGuardarHotel").textContent = "Guardar";
}

async function guardarHotel() {
    const idHotel = document.getElementById("idHotel").value;

    const hotel = {
        nombre: document.getElementById("nombreHotel").value.trim(),
        descripcion: document.getElementById("descripcionHotel").value.trim(),
        telefono: document.getElementById("telefonoHotel").value.trim(),
        correo: document.getElementById("correoHotel").value.trim(),
        sitio_web: document.getElementById("sitioWebHotel").value.trim()
    };

    const error = validarHotel(hotel);

    if (error !== "") {
        mostrarMensajeHotel(error, "danger");
        return;
    }

    if (idHotel === "") {
        crearHotel(hotel);
    } else {
        actualizarHotel(idHotel, hotel);
    }
}

async function crearHotel(hotel) {
    try {
        const respuesta = await fetch(API_HOTEL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(hotel)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionHotel(datos.message || "Hotel creado correctamente");
        } else {
            mostrarMensajeHotel(datos.message || "No se pudo crear el hotel.", "danger");
        }

    } catch (error) {
        mostrarMensajeHotel("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

async function actualizarHotel(idHotel, hotel) {
    try {
        hotel.id = idHotel;

        const respuesta = await fetch(API_HOTEL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(hotel)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionHotel(datos.message || "Hotel actualizado correctamente");
        } else {
            mostrarMensajeHotel(datos.message || "No se pudo actualizar el hotel.", "danger");
        }

    } catch (error) {
        mostrarMensajeHotel("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

function validarHotel(hotel) {
    if (
        hotel.nombre === "" ||
        hotel.descripcion === "" ||
        hotel.telefono === "" ||
        hotel.correo === "" ||
        hotel.sitio_web === ""
    ) {
        return "Todos los campos son obligatorios.";
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(hotel.correo)) {
        return "Debe ingresar un correo válido.";
    }

    return "";
}

function mostrarMensajeHotel(mensaje, tipo) {
    document.getElementById("mensajeHotel").innerHTML = `
        <div class="alert alert-${tipo}">
            ${mensaje}
        </div>
    `;
}

function finalizarAccionHotel(mensaje) {
    mostrarMensajeHotel(mensaje, "success");

    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalHotel")
        );

        modal.hide();
        limpiarFormularioHotel();
        cargarHoteles();
    }, 1000);
}

window.abrirModalEliminarHotel = function (idHotel) {
    document.getElementById("idHotelEliminar").value = idHotel;

    const modal = new bootstrap.Modal(
        document.getElementById("modalEliminarHotel")
    );

    modal.show();
};

document
    .getElementById("btnConfirmarEliminarHotel")
    .addEventListener("click", eliminarHotel);

async function eliminarHotel() {
    const idHotel = document.getElementById("idHotelEliminar").value;

    try {
        const respuesta = await fetch(API_HOTEL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idHotel
            })
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarHotel")
            );

            modal.hide();

            mostrarMensajeHotel(
                datos.message || "Hotel desactivado correctamente",
                "success"
            );

            setTimeout(() => {
                cargarHoteles();
            }, 1000);

        } else {
            mostrarMensajeHotel(
                datos.message || "No se pudo desactivar el hotel.",
                "danger"
            );
        }

    } catch (error) {
        mostrarMensajeHotel("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

window.editarHotel = function (hotel) {
    document.getElementById("idHotel").value = hotel.id;
    document.getElementById("nombreHotel").value = hotel.nombre;
    document.getElementById("descripcionHotel").value = hotel.descripcion;
    document.getElementById("telefonoHotel").value = hotel.telefono;
    document.getElementById("correoHotel").value = hotel.correo;
    document.getElementById("sitioWebHotel").value = hotel.sitio_web;

    document.querySelector(".modal-title").textContent = "Editar Hotel";
    document.getElementById("btnGuardarHotel").textContent = "Actualizar";
    document.getElementById("mensajeHotel").innerHTML = "";

    const modal = new bootstrap.Modal(
        document.getElementById("modalHotel")
    );

    modal.show();
};

async function cargarSedes() {
    const respuesta = await consultarDatos("sede");

    contenido.innerHTML = `
        <h2>Sedes</h2>

        <button class="btn btn-dark mb-4" id="btnNuevaSede">
            Nueva Sede
        </button>

        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ID Hotel</th>
                    <th>Nombre</th>
                    <th>País</th>
                    <th>Provincia</th>
                    <th>Ciudad</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Habitaciones</th>
                    <th>Estado</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaSedes"></tbody>
        </table>
    `;

    const tablaSedes = document.getElementById("tablaSedes");

    respuesta.data.forEach(sede => {
        tablaSedes.innerHTML += `
            <tr>
                <td>${sede.id}</td>
                <td>${sede.id_hotel}</td>
                <td>${sede.nombre}</td>
                <td>${sede.pais}</td>
                <td>${sede.provincia}</td>
                <td>${sede.ciudad}</td>
                <td>${sede.direccion}</td>
                <td>${sede.telefono}</td>
                <td>${sede.correo}</td>
                <td>${sede.cantidad_habitaciones}</td>
                <td>${sede.estado}</td>
                <td class="text-center">
                    <div class="d-flex gap-2 justify-content-center">
                        <button
                            class="btn btn-secondary btn-sm"
                            onclick='editarSede(${JSON.stringify(sede)})'>
                            Editar
                        </button>

                        <button
                            class="btn btn-dark btn-sm"
                            onclick="abrirModalEliminarSede(${sede.id})">
                            Desactivar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    document.getElementById("btnNuevaSede").addEventListener("click", () => {
        limpiarFormularioSede();

        const modal = new bootstrap.Modal(
            document.getElementById("modalSede")
        );

        modal.show();
    });
}

function limpiarFormularioSede() {
    document.getElementById("idSede").value = "";
    document.getElementById("idHotelSede").value = "";
    document.getElementById("nombreSede").value = "";
    document.getElementById("paisSede").value = "";
    document.getElementById("provinciaSede").value = "";
    document.getElementById("ciudadSede").value = "";
    document.getElementById("direccionSede").value = "";
    document.getElementById("telefonoSede").value = "";
    document.getElementById("correoSede").value = "";
    document.getElementById("cantidadHabitacionesSede").value = "";
    document.getElementById("mensajeSede").innerHTML = "";

    document.getElementById("tituloModalSede").textContent = "Nueva Sede";
    document.getElementById("btnGuardarSede").textContent = "Guardar";
}

document
    .getElementById("btnGuardarSede")
    .addEventListener("click", guardarSede);

async function guardarSede() {
    const idSede = document.getElementById("idSede").value;

    const sede = {
        id_hotel: document.getElementById("idHotelSede").value.trim(),
        nombre: document.getElementById("nombreSede").value.trim(),
        pais: document.getElementById("paisSede").value.trim(),
        provincia: document.getElementById("provinciaSede").value.trim(),
        ciudad: document.getElementById("ciudadSede").value.trim(),
        direccion: document.getElementById("direccionSede").value.trim(),
        telefono: document.getElementById("telefonoSede").value.trim(),
        correo: document.getElementById("correoSede").value.trim(),
        cantidad_habitaciones: document.getElementById("cantidadHabitacionesSede").value.trim()
    };

    const error = validarSede(sede);

    if (error !== "") {
        mostrarMensajeSede(error, "danger");
        return;
    }

    if (idSede === "") {
        crearSede(sede);
    } else {
        actualizarSede(idSede, sede);
    }
}

async function crearSede(sede) {
    try {
        const respuesta = await fetch(API_SEDE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sede)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionSede(datos.message || "Sede creada correctamente");
        } else {
            mostrarMensajeSede(datos.message || "No se pudo crear la sede.", "danger");
        }

    } catch (error) {
        mostrarMensajeSede("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

async function actualizarSede(idSede, sede) {
    try {
        sede.id = idSede;

        const respuesta = await fetch(API_SEDE, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sede)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionSede(datos.message || "Sede actualizada correctamente");
        } else {
            mostrarMensajeSede(datos.message || "No se pudo actualizar la sede.", "danger");
        }

    } catch (error) {
        mostrarMensajeSede("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

function validarSede(sede) {
    if (
        sede.id_hotel === "" ||
        sede.nombre === "" ||
        sede.pais === "" ||
        sede.provincia === "" ||
        sede.ciudad === "" ||
        sede.direccion === "" ||
        sede.telefono === "" ||
        sede.correo === "" ||
        sede.cantidad_habitaciones === ""
    ) {
        return "Todos los campos son obligatorios.";
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(sede.correo)) {
        return "Debe ingresar un correo válido.";
    }

    return "";
}

function mostrarMensajeSede(mensaje, tipo) {
    document.getElementById("mensajeSede").innerHTML = `
        <div class="alert alert-${tipo}">
            ${mensaje}
        </div>
    `;
}

function finalizarAccionSede(mensaje) {
    mostrarMensajeSede(mensaje, "success");

    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalSede")
        );

        modal.hide();
        limpiarFormularioSede();
        cargarSedes();
    }, 1000);
}

window.editarSede = function (sede) {
    document.getElementById("idSede").value = sede.id;
    document.getElementById("idHotelSede").value = sede.id_hotel;
    document.getElementById("nombreSede").value = sede.nombre;
    document.getElementById("paisSede").value = sede.pais;
    document.getElementById("provinciaSede").value = sede.provincia;
    document.getElementById("ciudadSede").value = sede.ciudad;
    document.getElementById("direccionSede").value = sede.direccion;
    document.getElementById("telefonoSede").value = sede.telefono;
    document.getElementById("correoSede").value = sede.correo;
    document.getElementById("cantidadHabitacionesSede").value = sede.cantidad_habitaciones;

    document.getElementById("tituloModalSede").textContent = "Editar Sede";
    document.getElementById("btnGuardarSede").textContent = "Actualizar";
    document.getElementById("mensajeSede").innerHTML = "";

    const modal = new bootstrap.Modal(
        document.getElementById("modalSede")
    );

    modal.show();
};

window.abrirModalEliminarSede = function (idSede) {
    document.getElementById("idSedeEliminar").value = idSede;

    const modal = new bootstrap.Modal(
        document.getElementById("modalEliminarSede")
    );

    modal.show();
};

document
    .getElementById("btnConfirmarEliminarSede")
    .addEventListener("click", eliminarSede);

async function eliminarSede() {
    const idSede = document.getElementById("idSedeEliminar").value;

    try {
        const respuesta = await fetch(API_SEDE, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idSede
            })
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarSede")
            );

            modal.hide();

            mostrarMensajeSede(
                datos.message || "Sede desactivada correctamente",
                "success"
            );

            setTimeout(() => {
                cargarSedes();
            }, 1000);

        } else {
            mostrarMensajeSede(
                datos.message || "No se pudo desactivar la sede.",
                "danger"
            );
        }

    } catch (error) {
        mostrarMensajeSede("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

async function cargarHabitaciones() {
    const respuesta = await consultarDatos("habitacion");

    contenido.innerHTML = `
        <h2>Habitaciones</h2>

        <button class="btn btn-dark mb-4" id="btnNuevaHabitacion">
            Nueva Habitación
        </button>

        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ID Sede</th>
                    <th>Número</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Capacidad</th>
                    <th>Estado</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaHabitaciones"></tbody>
        </table>
    `;

    const tablaHabitaciones = document.getElementById("tablaHabitaciones");

    respuesta.data.forEach(habitacion => {
        tablaHabitaciones.innerHTML += `
            <tr>
                <td>${habitacion.id}</td>
                <td>${habitacion.id_sede}</td>
                <td>${habitacion.numero}</td>
                <td>${habitacion.tipo}</td>
                <td>${habitacion.descripcion}</td>
                <td>${habitacion.precio}</td>
                <td>${habitacion.capacidad}</td>
                <td>${habitacion.estado}</td>
                <td class="text-center">
                    <div class="d-flex gap-2 justify-content-center">
                        <button
                            class="btn btn-secondary btn-sm"
                            onclick='editarHabitacion(${JSON.stringify(habitacion)})'>
                            Editar
                        </button>

                        <button
                            class="btn btn-dark btn-sm"
                            onclick="abrirModalEliminarHabitacion(${habitacion.id})">
                            Desactivar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    document.getElementById("btnNuevaHabitacion").addEventListener("click", () => {
        limpiarFormularioHabitacion();

        const modal = new bootstrap.Modal(
            document.getElementById("modalHabitacion")
        );

        modal.show();
    });
}

function limpiarFormularioHabitacion() {
    document.getElementById("idHabitacion").value = "";
    document.getElementById("idSedeHabitacion").value = "";
    document.getElementById("numeroHabitacion").value = "";
    document.getElementById("tipoHabitacion").value = "";
    document.getElementById("estadoHabitacion").value = "";
    document.getElementById("descripcionHabitacion").value = "";
    document.getElementById("precioHabitacion").value = "";
    document.getElementById("capacidadHabitacion").value = "";
    document.getElementById("mensajeHabitacion").innerHTML = "";

    document.getElementById("tituloModalHabitacion").textContent = "Nueva Habitación";
    document.getElementById("btnGuardarHabitacion").textContent = "Guardar";
}

document
    .getElementById("btnGuardarHabitacion")
    .addEventListener("click", guardarHabitacion);

async function guardarHabitacion() {
    const idHabitacion = document.getElementById("idHabitacion").value;

    const habitacion = {
        id_sede: document.getElementById("idSedeHabitacion").value.trim(),
        numero: document.getElementById("numeroHabitacion").value.trim(),
        tipo: document.getElementById("tipoHabitacion").value.trim(),
        estado: document.getElementById("estadoHabitacion").value.trim(),
        descripcion: document.getElementById("descripcionHabitacion").value.trim(),
        precio: document.getElementById("precioHabitacion").value.trim(),
        capacidad: document.getElementById("capacidadHabitacion").value.trim()
    };

    const error = validarHabitacion(habitacion);

    if (error !== "") {
        mostrarMensajeHabitacion(error, "danger");
        return;
    }

    if (idHabitacion === "") {
        crearHabitacion(habitacion);
    } else {
        actualizarHabitacion(idHabitacion, habitacion);
    }
}

async function crearHabitacion(habitacion) {
    try {
        const respuesta = await fetch(API_HABITACION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(habitacion)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionHabitacion(datos.message || "Habitación creada correctamente");
        } else {
            mostrarMensajeHabitacion(datos.message || "No se pudo crear la habitación.", "danger");
        }

    } catch (error) {
        mostrarMensajeHabitacion("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

async function actualizarHabitacion(idHabitacion, habitacion) {
    try {
        habitacion.id = idHabitacion;

        const respuesta = await fetch(API_HABITACION, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(habitacion)
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            finalizarAccionHabitacion(datos.message || "Habitación actualizada correctamente");
        } else {
            mostrarMensajeHabitacion(datos.message || "No se pudo actualizar la habitación.", "danger");
        }

    } catch (error) {
        mostrarMensajeHabitacion("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

function validarHabitacion(habitacion) {
    if (
        habitacion.id_sede === "" ||
        habitacion.numero === "" ||
        habitacion.tipo === "" ||
        habitacion.estado === "" ||
        habitacion.descripcion === "" ||
        habitacion.precio === "" ||
        habitacion.capacidad === ""
    ) {
        return "Todos los campos son obligatorios.";
    }

    return "";
}

function mostrarMensajeHabitacion(mensaje, tipo) {
    document.getElementById("mensajeHabitacion").innerHTML = `
        <div class="alert alert-${tipo}">
            ${mensaje}
        </div>
    `;
}

function finalizarAccionHabitacion(mensaje) {
    mostrarMensajeHabitacion(mensaje, "success");

    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalHabitacion")
        );

        modal.hide();
        limpiarFormularioHabitacion();
        cargarHabitaciones();
    }, 1000);
}

window.editarHabitacion = function (habitacion) {
    document.getElementById("idHabitacion").value = habitacion.id;
    document.getElementById("idSedeHabitacion").value = habitacion.id_sede;
    document.getElementById("numeroHabitacion").value = habitacion.numero;
    document.getElementById("tipoHabitacion").value = habitacion.tipo;
    document.getElementById("estadoHabitacion").value = habitacion.estado ?? "";
    document.getElementById("descripcionHabitacion").value = habitacion.descripcion;
    document.getElementById("precioHabitacion").value = habitacion.precio;
    document.getElementById("capacidadHabitacion").value = habitacion.capacidad;

    document.getElementById("tituloModalHabitacion").textContent = "Editar Habitación";
    document.getElementById("btnGuardarHabitacion").textContent = "Actualizar";
    document.getElementById("mensajeHabitacion").innerHTML = "";

    const modal = new bootstrap.Modal(
        document.getElementById("modalHabitacion")
    );

    modal.show();
};

window.abrirModalEliminarHabitacion = function (idHabitacion) {
    document.getElementById("idHabitacionEliminar").value = idHabitacion;

    const modal = new bootstrap.Modal(
        document.getElementById("modalEliminarHabitacion")
    );

    modal.show();
};

document
    .getElementById("btnConfirmarEliminarHabitacion")
    .addEventListener("click", eliminarHabitacion);

async function eliminarHabitacion() {
    const idHabitacion = document.getElementById("idHabitacionEliminar").value;

    try {
        const respuesta = await fetch(API_HABITACION, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idHabitacion
            })
        });

        const datos = await respuesta.json();

        if (datos.code === 200) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalEliminarHabitacion")
            );

            modal.hide();

            mostrarMensajeHabitacion(
                datos.message || "Habitación desactivada correctamente",
                "success"
            );

            setTimeout(() => {
                cargarHabitaciones();
            }, 1000);

        } else {
            mostrarMensajeHabitacion(
                datos.message || "No se pudo desactivar la habitación.",
                "danger"
            );
        }

    } catch (error) {
        mostrarMensajeHabitacion("Error al conectar con la API.", "danger");
        console.error(error);
    }
}

void mostrarDashboard();