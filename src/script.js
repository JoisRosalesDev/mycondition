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
const productosRecomendadosContainer = document.getElementById('productos-recomendados');

// Inicializar animaciones con AOS
document.addEventListener("DOMContentLoaded", function () {
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
        case 'perder peso':
            return Math.round(tmb * 0.8);
        case 'Aumentar energía':
            return Math.round(tmb * 1.1);
        case 'Fortalecer el Sistema Inmunológico':
            return Math.round(tmb);
        case 'Mejorar la Salud Digestiva':
            return Math.round(tmb);
        case 'Detoxificación':
            return Math.round(tmb * 0.9);
        case 'Salud Cardiovascular':
            return Math.round(tmb * 1);
        case 'Mejora de la Concentración y Memoria':
            return Math.round(tmb * 1.05);
        default:
            return Math.round(tmb);
    }
}

// Función para procesar los datos del archivo JSON
function procesarProductos() {
    // Obtener el archivo JSON
    fetch('./productos.json')
        .then(response => response.json())
        .then(data => {
            // Crear un elemento para contener los productos
            const productosElement = document.getElementById('productos');

            // Recorrer los productos y crear un elemento para cada uno
            data.forEach(producto => {
                const productoElement = document.createElement('div');
                productoElement.classList.add('producto');

                // Crear un elemento para la imagen
                const imagenElement = document.createElement('img');
                imagenElement.src = producto.imagen;
                productoElement.appendChild(imagenElement);

                // Crear un elemento para la descripción
                const descripcionElement = document.createElement('p');
                descripcionElement.classList.add('descripcion');
                descripcionElement.textContent = producto.descripcion;
                productoElement.appendChild(descripcionElement);

                // Crear un elemento para el enlace
                const enlaceElement = document.createElement('a');
                enlaceElement.href = producto.link;
                enlaceElement.textContent = 'Ver más';
                productoElement.appendChild(enlaceElement);

                // Agregar el producto al contenedor
                productosElement.appendChild(productoElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Llamar a la función para procesar los productos
procesarProductos();

// Función para manejar el envío del formulario
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

    cargarProductos(objetivo);
});
