let solucion = [];

function generarNonogramaAleatorio(filas, columnas) {
    const nonograma = document.getElementById('nonograma');
    nonograma.innerHTML = '';
    solucion = [];

    // Generar la cuadrícula del nonograma y la solución
    for (let i = 0; i < filas; i++) {
        const row = document.createElement('tr');
        const filaSolucion = [];
        for (let j = 0; j < columnas; j++) {
            const cell = document.createElement('td');
            const bloque = Math.round(Math.random());
            filaSolucion.push(bloque); // Agregar a la solución
            row.appendChild(cell);
        }
        solucion.push(filaSolucion); // Agregar la fila de la solución
        nonograma.appendChild(row);
    }

    // Generar las pistas para las filas y las columnas basándose en la solución
    const pistasFilas = solucion.map(fila => generarPistas(fila));
    const pistasColumnas = transponer(solucion).map(columna => generarPistas(columna));

    // Agregar las pistas al HTML
    for (let i = 0; i < filas; i++) {
        const row = nonograma.rows[i];
        const cell = document.createElement('td');
        cell.innerHTML = [].concat(...pistasFilas[i]).join(' '); // Aplana el array y une los números con espacios
        cell.classList.add('pista'); // Agrega la clase 'pista'
        row.insertBefore(cell, row.firstChild);
    }

    const headerRow = document.createElement('tr');
    // Agregar una celda vacía al principio de la fila de las pistas de las columnas
    headerRow.appendChild(document.createElement('td'));
    for (let i = 0; i < columnas; i++) {
        const cell = document.createElement('td');
        cell.innerHTML = pistasColumnas[i].join('<br>'); // Pistas de las columnas
        cell.classList.add('pista'); // Agrega la clase 'pista'
        headerRow.appendChild(cell);
    }
    nonograma.insertBefore(headerRow, nonograma.firstChild);
}

// Generar las pistas para una fila o columna
function generarPistas(array) {
    const pistas = [];
    let sumaConsecutiva = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === 1) {
            sumaConsecutiva++;
            if (i === array.length - 1 || array[i + 1] === 0) {
                pistas.push(sumaConsecutiva);
                sumaConsecutiva = 0;
            }
        } else {
            if (sumaConsecutiva !== 0) {
                pistas.push(sumaConsecutiva);
                sumaConsecutiva = 0;
            }
        }
    }
    return pistas;
}

// Transponer una matriz
function transponer(matriz) {
    return matriz[0].map((_, i) => matriz.map(row => row[i]));
}


console.log(window.location.pathname);

if(window.location.pathname.includes('Dificultades/Facil.html')){
    generarNonogramaAleatorio(6, 6);
}
else if(window.location.pathname.includes('Dificultades/Medio.html')){
    generarNonogramaAleatorio(12, 12);
}
else if(window.location.pathname.includes('Dificultades/Dificil.html')){
    generarNonogramaAleatorio(20, 20);
}



document.addEventListener('DOMContentLoaded', function() {
    const nonograma = document.getElementById('nonograma');

    nonograma.addEventListener('click', function(e) {
        const cell = e.target;

        // Obtener la posición de la celda clicada
        const rowIndex = cell.parentNode.rowIndex - 1; // Considera la fila de pistas
        const cellIndex = cell.cellIndex - 1; // Considera la columna de pistas

        // Verificar si la celda clicada coincide con la solución
        if (cell.tagName === 'TD' && rowIndex >= 0 && cellIndex >= 0) {
            if (solucion[rowIndex][cellIndex] === 1) {
                // La celda clicada es correcta según la solución
                cell.classList.add('llena-correcta');
                cell.textContent = '✓';

                // Verificar si todas las celdas correctas en la fila y la columna ya han sido llenadas
                const filaCompleta = solucion[rowIndex].every((bloque, i) => bloque === 0 || nonograma.rows[rowIndex + 1].cells[i + 1].classList.contains('llena-correcta'));
                const columnaCompleta = solucion.every((fila, i) => fila[cellIndex] === 0 || nonograma.rows[i + 1].cells[cellIndex + 1].classList.contains('llena-correcta'));

                if (filaCompleta) {
                    // Llenar las celdas restantes en la fila con la casilla de incorrecta
                    for (let i = 0; i < solucion[rowIndex].length; i++) {
                        const celda = nonograma.rows[rowIndex + 1].cells[i + 1];
                        if (!celda.classList.contains('llena-correcta')) {
                            celda.classList.add('llena-incorrecta');
                            celda.textContent = '✗';
                        }
                    }
                }

                if (columnaCompleta) {
                    // Llenar las celdas restantes en la columna con la casilla de incorrecta
                    for (let i = 0; i < solucion.length; i++) {
                        const celda = nonograma.rows[i + 1].cells[cellIndex + 1];
                        if (!celda.classList.contains('llena-correcta')) {
                            celda.classList.add('llena-incorrecta');
                            celda.textContent = '✗';
                        }
                    }
                }
            } else {
                // La celda clicada es incorrecta según la solución
                cell.classList.add('llena-incorrecta');
                cell.textContent = '✗';
            }
            verificarCompletado();
        }
    });
});

function mostrarSolucion() {
    const nonograma = document.getElementById('nonograma');

    for (let i = 0; i < solucion.length; i++) {
        for (let j = 0; j < solucion[i].length; j++) {
            const cell = nonograma.rows[i + 1].cells[j + 1];
            if (solucion[i][j] === 1) {
                cell.classList.add('llena-correcta');
                cell.textContent = '✓';
            } else {
                cell.classList.add('llena-incorrecta');
                cell.textContent = '✗';
            }
        }
    }
}

function reiniciar() {
    if(window.location.pathname.includes('Dificultades/Facil.html')){
        generarNonogramaAleatorio(6, 6);
    }
    else if(window.location.pathname.includes('Dificultades/Medio.html')){
        generarNonogramaAleatorio(12, 12);
    }
    else if(window.location.pathname.includes('Dificultades/Dificil.html')){
        generarNonogramaAleatorio(20, 20);
    }
}

document.getElementById('mostrar-solucion').addEventListener('click', mostrarSolucion);
document.getElementById('reiniciar-nivel').addEventListener('click', reiniciar);


function verificarCompletado() {
    const nonograma = document.getElementById('nonograma').rows;

    for (let i = 0; i < nonograma.length - 1; i++) {
        for (let j = 0; j < nonograma[i].cells.length - 1; j++) {
            const cell = nonograma[i + 1].cells[j + 1];
            if (solucion[i][j] === 1 && !cell.classList.contains('llena-correcta')) {
                // Si la celda debería estar llena pero no lo está, el nivel no está completado
                return false;
            }
            if (solucion[i][j] === 0 && !cell.classList.contains('llena-incorrecta')) {
                // Si la celda no debería estar llena pero lo está, el nivel no está completado
                return false;
            }
        }
    }
    // Si todas las celdas coinciden con la solución, el nivel está completado
    alert('¡Felicitaciones, has completado el nivel!');
    return true;
}
