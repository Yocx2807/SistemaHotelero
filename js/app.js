import { consultarDatos } from "./api.js";

const API_HOTEL = "https://paginas-web-cr.com/Api/hotelApi/hotel/hotel.php";

const contenido = document.getElementById("contenido");
const btnDashboard = document.getElementById("btnDashboard");
const btnHoteles = document.getElementById("btnHoteles");

btnDashboard.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarDashboard();
});

btnHoteles.addEventListener("click", () => {
    cargarHoteles();
});

document
    .getElementById("btnGuardarHotel")
    .addEventListener("click", guardarHotel);

function mostrarDashboard() {
    contenido.innerHTML = `
        <h2>Bienvenido al Sistema Hotelero</h2>
        <p>Seleccione un módulo para comenzar.</p>
    `;
}

async function cargarHoteles() {
    const respuesta = await consultarDatos("hotel");

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
                            Eliminar
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

window.eliminarHotel = async function (idHotel) {
    const confirmar = confirm("¿Está seguro de que desea desactivar este hotel?");

    if (!confirmar) {
        return;
    }

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
            mostrarMensajeHotel(
                datos.message || "Hotel eliminado correctamente",
                "success"
            );  
            
            cargarHoteles();

        } else {
            mostrarMensajeHotel(datos.message || "No se pudo desactivar el hotel.", 
                "danger");
        }

    } catch (error) {
        mostrarMensajeHotel("Error al conectar con la API.", "danger");
        console.error(error);
    }
};

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
                datos.message || "Hotel eliminado correctamente",
                "success"
            );

            setTimeout(() => {
                cargarHoteles();
            }, 1000);

        } else {
            mostrarMensajeHotel(
                datos.message || "No se pudo eliminar el hotel.",
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

mostrarDashboard();