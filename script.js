// Selección de elementos del DOM
const form = document.querySelector('#form-calculadora');
const edadInput = document.getElementById('edad');
const alturaInput = document.getElementById('altura');
const pesoInput = document.getElementById('peso');
const generoInputs = document.getElementsByName('genero');
const objetivoSelect = document.getElementById('objetivo');
const resumenEdad = document.getElementById('resumen-edad');
const resumenAltura = document.getElementById('resumen-altura');
const resumenPeso = document.getElementById('resumen-peso');
const resumenGenero = document.getElementById('resumen-genero');
const resumenObjetivo = document.getElementById('resumen-objetivo');
const imcResultado = document.getElementById('resultado-imc');
const caloriasResultado = document.getElementById('resultado-calorias');
const productosContainer = document.getElementById('productos');

// Inicializar animaciones con AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true
    });
});

// Función para calcular el IMC
function calcularIMC(peso, altura) {
    const alturaEnMetros = altura / 100;
    return (peso / (alturaEnMetros ** 2)).toFixed(2);
}

// Función para calcular calorías diarias
function calcularCalorias(edad, peso, altura, genero, objetivo) {
    let tmb;

    if (genero === 'masculino') {
        tmb = 10 * peso + 6.25 * altura - 5 * edad + 5;
    } else {
        tmb = 10 * peso + 6.25 * altura - 5 * edad - 161;
    }

    switch (objetivo) {
        case 'Perder peso':
            return Math.round(tmb * 0.8);
        case 'Aumentar energía':
            return Math.round(tmb * 1.1);
        case 'Fortalecer Sistema Inmunológico':
            return Math.round(tmb);
        case 'Mejorar Salud Digestiva':
            return Math.round(tmb);
        case 'Mejora Concentración y Memoria':
            return Math.round(tmb * 1.05);
        default:
            return Math.round(tmb);
    }
}

// Función para cargar y filtrar productos
async function cargarProductos(objetivoUsuario) {
    try {
        const response = await fetch('./productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }

        const productos = await response.json();
        const productosFiltrados = productos.filter(producto => producto.objetivo === objetivoUsuario);

        mostrarProductos(productosFiltrados);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        productosContainer.innerHTML = '<p>Error al cargar los productos. Inténtalo de nuevo más tarde.</p>';
    }
}

// Función para mostrar productos en el DOM
function mostrarProductos(productos) {
    productosContainer.innerHTML = ''; // Limpiar el contenedor

    if (productos.length === 0) {
        productosContainer.innerHTML = '<p>No se encontraron productos para este objetivo.</p>';
        return;
    }

    productos.forEach(producto => {
        const productCard = `
        <div class="producto bg-white rounded-md shadow-lg transition-transform transform hover:scale-105">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-32 object-cover rounded-md drop-shadow-md">
            <h2 class="mt-4 p-2 text-lg font-bold text-gray-800">${producto.nombre}</h2>
            <p class="mt-2 text-sm text-gray-700 descripcion">${producto.descripcion}</p>
            <a href="${producto.link}" target="_blank" 
               class=" text-white w-full bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
               Más información
            </a>
        </div>
    `;
        productosContainer.innerHTML += productCard;
    });
}

// Manejar el envío del formulario
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const edad = parseInt(edadInput.value);
    const altura = parseInt(alturaInput.value);
    const peso = parseInt(pesoInput.value);
    const genero = Array.from(generoInputs).find(input => input.checked)?.value;
    const objetivo = objetivoSelect.value;

    if (!edad || !altura || !peso || !genero || !objetivo) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const imc = calcularIMC(peso, altura);
    const calorias = calcularCalorias(edad, peso, altura, genero, objetivo);

    resumenEdad.textContent = `${edad} años`;
    resumenAltura.textContent = `${altura} cm`;
    resumenPeso.textContent = `${peso} kg`;
    resumenGenero.textContent = genero;
    resumenObjetivo.textContent = objetivo;

    imcResultado.textContent = imc;
    caloriasResultado.textContent = `${calorias} kcal`;

    // Cargar y mostrar productos relacionados al objetivo
    cargarProductos(objetivo);
});
