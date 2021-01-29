let pagina = 1;

const cita = {
    nombre: "",
    fecha: "",
    hora: "",
    servicios: []
}

document.addEventListener("DOMContentLoaded", function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // resalta el div actual segun al tab que se presiona
    mostrarSeccion();
    // oculta o muestra una seccion segun el tab que se presiona
    cambiarSeccion();

    // paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    // comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // muestra el resumen de la cita (o mensaje de error en caso de no pasar  la validacion)
    mostrarResumen();
};

function mostrarSeccion() {

    // Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if( seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
   
    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch("./servicios.json");
        const db = await resultado.json();
        
        const {servicios} = db;

        //Generar HTML
        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio

            // DOM Scripting
            // Generar nombre de servicio
            const nombreServicio =  document.createElement("P");
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add("nombre-servicio");

            // Generar precio del servicio
            const precioServicio = document.createElement("P");
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add("precio-servicio");

            //Generar DIV contenedor de servicio
            const servicioDiv = document.createElement("DIV");
            servicioDiv.classList.add("servicio");
            servicioDiv.dataset.idServicio = id;

            // selecciona un servicio para la cita
            servicioDiv.onclick = selecionarServicio;

            //Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectando al HTML
            document.querySelector("#servicios").appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error);
    };
};

function selecionarServicio(e) {
    let elemento;
    // forzar que el elemento al cual damos click sea el div
    if(e.target.tagName === "P") {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");
    } else {
        elemento.classList.add("seleccionado");
    }
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina  === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la página 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la sección que se muestra por la de la página
}

function mostrarResumen() {
    // destructuring
    const {nombre, fecha, hora, servicios} = cita;

    // seleccionar el resumen
    const resumenDiv = document.querySelector(".contenido-resumen");

     // Limpia el HTML previo
     while( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }
    // validación de objeto
    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        // agregar a resumen Div
        resumenDiv.appendChild(noServicios);

        return;
    }
} 