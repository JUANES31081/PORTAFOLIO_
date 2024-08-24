console.log('Script loaded')
// Tamaño del tablero
const boardWidth = 10;
const boardHeight = 20;
const cellSize = 40;

let currentX = 0;
let currentY = 0;


let boardDiv = null;

let puntuacion = 0;

let score = 0;
let level = 1;
let lines = 0;
const linesPerLevel = 10; // Incrementar el nivel cada 10 líneas
const speedIncrement = 0.3; // Incrementar la velocidad en un 10% cada nivel

let dropInterval = null;
let speed = 1000; // Tiempo en milisegundos entre cada caída de la forma


let tetrominoes = [
    // I
    {
        shape: [
            [1, 1, 1, 1]
        ],
        color: 'cyan'
    },
    // O
    {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 'yellow'
    },
    // T
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: 'purple'
    },
    // S
    {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: 'green'
    },
    // Z
    {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: 'red'
    },
    // J
    {
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        color: 'blue'
    },
    // L
    {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        color: 'orange'
    }
];

// Variable para almacenar la forma actual
let currentTetromino = null;

// Crear una matriz para representar el tablero
let board = Array(boardHeight).fill().map(() => Array(boardWidth).fill(null));

function drawBoard() {
    // Obtener el elemento del tablero del DOM
    boardDiv = document.getElementById('Tablero');
    console.log(boardDiv)
    // Establecer el tamaño del div del tablero
    boardDiv.style.width = `${boardWidth * cellSize}px`;

    // Limpiar el tablero
    boardDiv.innerHTML = '';

    // Dibujar el tablero
    for (let y = 0; y < boardHeight; y++) {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        for (let x = 0; x < boardWidth; x++) {
            let cellDiv = document.createElement('div');
            cellDiv.className = 'cell';

            // Si la celda del tablero no está vacía, colorear la celda
            if (board[y][x] !== null) {
                cellDiv.style.backgroundColor = board[y][x];
            }

            rowDiv.appendChild(cellDiv);
        }

        boardDiv.appendChild(rowDiv);
    }
}


// Función para dibujar una forma en el tablero
function drawTetromino(tetromino, x, y) {
    for (let i = 0; i < tetromino.shape.length; i++) {
        for (let j = 0; j < tetromino.shape[i].length; j++) {
            if (tetromino.shape[i][j] === 1) {
                // Comprobar si la celda está dentro del tablero
                if (x + j >= 0 && x + j < boardWidth && y + i >= 0 && y + i < boardHeight) {
                    let cellDiv = boardDiv.children[y + i].children[x + j];
                    cellDiv.style.backgroundColor = tetromino.color;
                    cellDiv.classList.add('tetromino-cell'); // Agrega la clase 'tetromino-cell'
                } else {
                    // La celda está fuera del tablero, por lo que deberías manejar esto de alguna manera
                    // Por ejemplo, podrías detener el juego y mostrar un mensaje de error
                    console.error('Tetromino is out of bounds!');
                    return;
                }
            }
        }
    }
}


function hasCollided() {
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            // Si la celda está vacía, la omitimos
            if (currentTetromino.shape[y][x] === 0) continue;

            // Las coordenadas del tetromino después del movimiento
            let newX = currentX + x;
            let newY = currentY + y;

            // Comprobar si el movimiento haría que el tetromino se saliera del tablero
            if (newX < 0 || newX >= boardWidth || newY >= boardHeight) return true;

            // Comprobar si el movimiento haría que el tetromino chocara con otro tetromino
            if (board[newY][newX] !== null) return true;
        }
    }

    return false;
}

function fixTetromino() {
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            // Si la celda está vacía, la omitimos
            if (currentTetromino.shape[y][x] === 0) continue;

            // Comprobar si la posición ya está ocupada
            if (currentY + y < 0 || currentY + y >= board.length || currentX + x < 0 || currentX + x >= board[0].length || board[currentY + y][currentX + x] !== null) {
                // Si es así, mover el tetromino hacia arriba
                if (currentY > 0) {
                    currentY--;
                }
                y = -1; // Reiniciar el bucle externo
                break;
            }

            // Fijar el tetromino en su lugar en el tablero
            board[currentY + y][currentX + x] = currentTetromino.color;
        }
    }
}

function clearBoard() {
    // Limpiar el tablero
    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            board[y][x] = null;
        }
    }
}

function dropTetromino() {
    // Mover el tetromino hacia abajo
    currentY++;

    // Comprobar si el tetromino ha chocado con el fondo del tablero o con otro tetromino
    if (hasCollided()) {
        // Si es así, mover el tetromino de vuelta hacia arriba
        currentY--;

        // Fijar el tetromino en su lugar en el tablero
        fixTetromino();

        // Seleccionar un nuevo tetromino y empezar a moverlo desde la parte superior del tablero
        currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
        currentX = boardWidth / 2;
        currentY = 0;

        // Comprobar si el nuevo tetromino ha chocado inmediatamente después de ser seleccionado
        // Si es así, el juego ha terminado
        if (hasCollided()) {
            console.log('Game over');
            clearInterval(dropInterval); // Detener el juego
        
            // Mostrar el mensaje de "Game Over" y el botón de reinicio
            document.getElementById('LOSE').innerText = 'GAME OVER!';
            document.getElementById('restartButton').style.display = 'block';
        
            // Oscurecer el tablero
            let overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = 1;
            document.getElementById('Tablero').appendChild(overlay);
        
            return;
        }
    }

    removeCompleteRows();
    
    // Redibujar el tablero y el tetromino en la nueva posición
    drawBoard();
    drawTetromino(currentTetromino, currentX, currentY);
}

// Función para mover una forma
function moveTetromino(direction) {
    // Guardar la posición actual
    let oldX = currentX;
    let oldY = currentY;

    if (direction === 'left' && currentX > 0) {
        currentX--;
    } else if (direction === 'right' && currentX < boardWidth - 1) {
        currentX++;
    } else if (direction === 'down') {
        // Mover el tetromino hacia abajo más de una vez
        for (let i = 0; i < 2; i++) {
            currentY++;
            if (hasCollided()) {
                currentY--;
                break;
            }
        }
    }

    // Comprobar si el movimiento resulta en una colisión
    if (hasCollided()) {
        // Si es así, deshacer el movimiento
        currentX = oldX;
        currentY = oldY;
    }

    // Redibujar el tablero y el tetromino en la nueva posición
    drawBoard();
    drawTetromino(currentTetromino, currentX, currentY);
}

// Función para rotar una forma
function rotateTetromino(clockwise) {
    // Guardar el estado actual del tetromino
    const currentShape = currentTetromino.shape;

    // Transponer la matriz
    let transposed = currentTetromino.shape[0].map((_, i) => currentTetromino.shape.map(row => row[i]));

    // Invertir las filas para una rotación en sentido horario
    if (clockwise) {
        currentTetromino.shape = transposed.map(row => row.reverse());
    } 
    // Invertir las columnas para una rotación en sentido antihorario
    else {
        currentTetromino.shape = transposed.reverse();
    }

    // Comprobar si la rotación resulta en una colisión
    if (hasCollided()) {
        // Si es así, deshacer la rotación
        currentTetromino.shape = currentShape;
    }

    // Redibujar el tablero y el tetromino en la nueva posición
    drawBoard();
    drawTetromino(currentTetromino, currentX, currentY);
}

function updateUI() {
    document.getElementById('puntuacion').innerText = score;
    document.getElementById('lineas').innerText = lines;
    document.getElementById('nivel').innerText = level;
}

function removeCompleteRows() {
    let linesCompleted = 0;

    for (let y = 0; y < boardHeight; y++) {
        let isRowComplete = true;

        // Verificar si la fila está completa
        for (let x = 0; x < boardWidth; x++) {
            if (board[y][x] === null) {
                isRowComplete = false;
                break;
            }
        }

        // Si la fila está completa, eliminarla y añadir una nueva fila en la parte superior
        if (isRowComplete) {
            board.splice(y, 1);
            board.unshift(Array(boardWidth).fill(null));
            linesCompleted++;
        }
    }

    // Otorgar puntos basados en cuántas líneas se completaron
    if (linesCompleted > 0) {
        score += 100 * (2 ** (linesCompleted - 1));
        lines += linesCompleted;

        // Si se han eliminado suficientes líneas, incrementar el nivel y la velocidad
        if (lines >= linesPerLevel) {
            level++;
            lines = 0;
            clearInterval(dropInterval);
            if(level%2 == 0){
                speed *= (1 - speedIncrement);
            }
            dropInterval = setInterval(dropTetromino, speed);
        }

        // Actualizar la interfaz de usuario
        updateUI();
    }
}

function restartGame() {
    // Reiniciar las variables del juego
    currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    currentX = boardWidth / 2;
    currentY = 0;

    // Limpiar el tablero
    clearBoard();

    // Ocultar el mensaje de "Game Over" y el botón de reinicio
    document.getElementById('LOSE').innerText = '';
    document.getElementById('restartButton').style.display = 'none';

    // Eliminar el overlay oscuro
    let overlay = document.querySelector('#Tablero > div');
    if (overlay) {
        overlay.remove();
    }

    // Reiniciar el intervalo de caída
    dropInterval = setInterval(dropTetromino, 1000);
}

addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveTetromino('left');
    } else if (event.key === 'ArrowRight') {
        moveTetromino('right');
    } else if (event.key === 'ArrowDown') {
        moveTetromino('down');
    } else if (event.key === 'd' || event.key === 'D') {
        rotateTetromino(true);
    } else if (event.key === 'a' || event.key === 'A') {
        rotateTetromino(false);
    }
});

document.getElementById('restartButton').addEventListener('click', restartGame);

function startGame() {
    console.log('Game started')
    // Inicializar currentTetromino aquí
    currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];

    // Limpiar el tablero
    clearBoard();

    // Dibujar el tablero
    drawBoard();

    // Inicializar las coordenadas del tetromino
    currentX = boardWidth / 2;
    currentY = 0;

    // Dibujar la forma en la parte superior del tablero
    drawTetromino(currentTetromino, currentX, currentY);

    // Llamar a dropTetromino cada segundo
    dropInterval = setInterval(dropTetromino, speed);
}


window.onload = function() {
    startGame();
};
