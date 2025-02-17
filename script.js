// Selección de elementos del DOM
const form = document.querySelector("#form-calculadora");
const edadInput = document.getElementById("edad");
const alturaInput = document.getElementById("altura");
const pesoInput = document.getElementById("peso");
const generoInputs = document.getElementsByName("genero");
const objetivoSelect = document.getElementById("objetivo");
const resumenEdad = document.getElementById("resumen-edad");
const resumenAltura = document.getElementById("resumen-altura");
const resumenPeso = document.getElementById("resumen-peso");
const resumenGenero = document.getElementById("resumen-genero");
const resumenObjetivo = document.getElementById("resumen-objetivo");
const imcResultado = document.getElementById("resultado-imc");
const caloriasResultado = document.getElementById("resultado-calorias");
const productosContainer = document.getElementById("productos");

// Crear y agregar elemento para la categoría del IMC
const imcCategoria = document.createElement("p");
imcCategoria.id = "imc-categoria";
imcCategoria.classList.add("mt-2", "text-lg", "font-semibold", "py-1", "px-4", "rounded-md", "inline-block");
imcResultado.parentNode.appendChild(imcCategoria);

// Inicializar animaciones con AOS
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({ duration: 1000, once: true });
});

// Función para calcular el IMC
const calcularIMC = (peso, altura) => (peso / (altura / 100) ** 2).toFixed(2);

// Función para obtener la categoría del IMC con estilos de botón
const obtenerCategoriaIMC = (imc) => {
    if (imc < 18.5) return { texto: "Bajo peso", color: "bg-yellow-500 text-white border-yellow-600" };
    if (imc < 24.9) return { texto: "Peso ideal", color: "bg-green-600 text-white border-green-700" };
    return { texto: "Sobrepeso", color: "bg-red-600 text-white border-red-700" };
};

// Función para calcular calorías diarias
const calcularCalorias = (edad, peso, altura, genero, objetivo) => {
    let tmb = (genero === "masculino")
        ? (10 * peso + 6.25 * altura - 5 * edad + 5)
        : (10 * peso + 6.25 * altura - 5 * edad - 161);

    const ajustes = {
        "Perder peso": 0.8,
        "Aumentar energía": 1.1,
        "Fortalecer Sistema Inmunológico": 1.0,
        "Mejorar Salud Digestiva": 1.0,
        "Mejora Concentración y Memoria": 1.05,
    };

    return Math.round(tmb * (ajustes[objetivo] || 1));
};

// Función para cargar y filtrar productos según el objetivo
const cargarProductos = async (objetivoUsuario) => {
    try {
        const response = await fetch("./productos.json");
        if (!response.ok) throw new Error("Error al cargar el archivo JSON");

        const productos = await response.json();
        mostrarProductos(productos.filter(p => p.objetivo === objetivoUsuario));
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        productosContainer.innerHTML = "<p class='text-red-500'>Error al cargar los productos. Inténtalo más tarde.</p>";
    }
};

// Función para mostrar productos en el DOM
const mostrarProductos = (productos) => {
    productosContainer.innerHTML = productos.length
        ? productos.map(producto => `
            <div class="producto bg-white rounded-md shadow-lg transition-transform transform hover:scale-105 p-4">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-32 object-cover rounded-md drop-shadow-md">
                <h2 class="mt-4 p-2 text-lg font-bold text-gray-800">${producto.nombre}</h2>
                <p class="mt-2 text-sm text-gray-700 descripcion">${producto.descripcion}</p>
                <a href="${producto.link}" target="_blank" 
                   class="block text-white text-center w-full bg-blue-600 rounded-md hover:bg-blue-700 transition-colors py-2 mt-2">
                   Más información
                </a>
            </div>
        `).join("")
        : "<p class='text-gray-500'>No se encontraron productos para este objetivo.</p>";
};

// Manejar el envío del formulario
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const edad = parseInt(edadInput.value);
    const altura = parseInt(alturaInput.value);
    const peso = parseInt(pesoInput.value);
    const genero = Array.from(generoInputs).find(input => input.checked)?.value;
    const objetivo = objetivoSelect.value;

    if (!edad || !altura || !peso || !genero || !objetivo) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Calcular IMC y su categoría
    const imc = calcularIMC(peso, altura);
    const categoriaIMC = obtenerCategoriaIMC(imc);

    // Calcular calorías recomendadas
    const calorias = calcularCalorias(edad, peso, altura, genero, objetivo);

    // Actualizar el DOM con los resultados
    resumenEdad.textContent = `${edad} años`;
    resumenAltura.textContent = `${altura} cm`;
    resumenPeso.textContent = `${peso} kg`;
    resumenGenero.textContent = genero;
    resumenObjetivo.textContent = objetivo;
    imcResultado.textContent = imc;
    caloriasResultado.textContent = `${calorias} kcal`;

    // Mostrar la categoría del IMC con estilo de botón
    imcCategoria.textContent = categoriaIMC.texto;
    imcCategoria.className = `mt-4 px-4 py-2 rounded-md text-center font-bold border ${categoriaIMC.color}`;

    // Cargar productos relacionados al objetivo
    cargarProductos(objetivo);
});