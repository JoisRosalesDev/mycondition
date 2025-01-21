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

    // Ajustar según el objetivo
    switch (objetivo) {
        case 'perder peso':
            return Math.round(tmb * 0.8);
        case 'mantener peso':
            return Math.round(tmb);
        case 'ganar peso':
            return Math.round(tmb * 1.2);
        default:
            return Math.round(tmb);
    }
}

// Función para manejar el envío del formulario
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener valores del formulario
    const edad = parseInt(edadInput.value);
    const altura = parseInt(alturaInput.value);
    const peso = parseInt(pesoInput.value);
    const genero = Array.from(generoInputs).find(input => input.checked)?.value;
    const objetivo = objetivoSelect.value;

    if (!edad || !altura || !peso || !genero || !objetivo) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Calcular resultados
    const imc = calcularIMC(peso, altura);
    const calorias = calcularCalorias(edad, peso, altura, genero, objetivo);

    // Actualizar el DOM con los resultados
    resumenEdad.textContent = `${edad} años`;
    resumenAltura.textContent = `${altura} cm`;
    resumenPeso.textContent = `${peso} kg`;
    resumenGenero.textContent = genero;
    resumenObjetivo.textContent = objetivo;

    imcResultado.textContent = imc;
    caloriasResultado.textContent = `${calorias} kcal`;
});
