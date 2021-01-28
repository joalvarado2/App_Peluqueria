document.addEventListener("DOMContentLoaded", function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();
};

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