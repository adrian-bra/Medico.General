document.addEventListener("DOMContentLoaded", function () {

    // Mostrar el año actual en los pies de página.
    const elementoAnio = document.getElementById("anio");

    if (elementoAnio) {
        elementoAnio.textContent = new Date().getFullYear();
    }

    // Abrir y cerrar el menú en teléfonos.
    const botonMenu = document.getElementById("botonMenu");
    const navegacion = document.getElementById("navegacion");

    if (botonMenu && navegacion) {
        botonMenu.addEventListener("click", function () {
            const estaAbierto = navegacion.classList.toggle("abierto");

            botonMenu.setAttribute("aria-expanded", String(estaAbierto));
            botonMenu.setAttribute(
                "aria-label",
                estaAbierto ? "Cerrar menú" : "Abrir menú"
            );
        });
    }

    // Evitar seleccionar fechas anteriores al día actual.
    const campoFecha = document.getElementById("fecha");

    if (campoFecha) {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        campoFecha.min = `${anio}-${mes}-${dia}`;
    }

    // Formulario de solicitud de cita.
    const formularioCita = document.getElementById("formularioCita");
    const mensajeCita = document.getElementById("mensajeCita");

    if (formularioCita && mensajeCita) {
        formularioCita.addEventListener("submit", function (evento) {
            evento.preventDefault();

            mensajeCita.textContent = "";
            mensajeCita.className = "mensaje";

            if (!formularioCita.checkValidity()) {
                formularioCita.reportValidity();
                return;
            }

            const fechaSeleccionada = document.getElementById("fecha").value;
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const fechaElegida = new Date(fechaSeleccionada + "T00:00:00");

            if (fechaElegida < hoy) {
                mensajeCita.textContent =
                    "Selecciona una fecha igual o posterior a hoy.";
                mensajeCita.classList.add("error");
                return;
            }

            const solicitud = {
                nombre: document.getElementById("nombre").value.trim(),
                correo: document.getElementById("correo").value.trim(),
                telefono: document.getElementById("telefono").value.trim(),
                fecha: fechaSeleccionada,
                hora: document.getElementById("hora").value,
                tipo: document.getElementById("tipo").value,
                fechaRegistro: new Date().toISOString()
            };

            if (
                !solicitud.nombre ||
                !solicitud.correo ||
                !solicitud.fecha ||
                !solicitud.hora ||
                !solicitud.tipo
            ) {
                mensajeCita.textContent =
                    "Completa todos los campos obligatorios.";
                mensajeCita.classList.add("error");
                return;
            }

            try {
                const clave = "saludCercaSolicitudes";
                const solicitudesGuardadas =
                    JSON.parse(localStorage.getItem(clave) || "[]");

                if (!Array.isArray(solicitudesGuardadas)) {
                    throw new Error("Formato de datos incorrecto");
                }

                solicitudesGuardadas.push(solicitud);

                localStorage.setItem(
                    clave,
                    JSON.stringify(solicitudesGuardadas)
                );

                mensajeCita.textContent =
                    "Solicitud de demostración guardada en este navegador. " +
                    "No es una cita confirmada ni se ha enviado al consultorio.";

                mensajeCita.classList.add("exito");
                formularioCita.reset();

            } catch (error) {
                mensajeCita.textContent =
                    "No se pudo guardar la solicitud en este navegador.";

                mensajeCita.classList.add("error");
            }
        });
    }

    // Formulario de contacto de demostración.
    const formularioContacto =
        document.getElementById("formularioContacto");

    const resultadoContacto =
        document.getElementById("mensajeContactoResultado");

    if (formularioContacto && resultadoContacto) {
        formularioContacto.addEventListener("submit", function (evento) {
            evento.preventDefault();

            resultadoContacto.textContent = "";
            resultadoContacto.className = "mensaje";

            if (!formularioContacto.checkValidity()) {
                formularioContacto.reportValidity();
                return;
            }

            resultadoContacto.textContent =
                "Formulario validado correctamente. Esta demostración " +
                "no envía el mensaje a un servidor.";

            resultadoContacto.classList.add("exito");
            formularioContacto.reset();
        });
    }

});