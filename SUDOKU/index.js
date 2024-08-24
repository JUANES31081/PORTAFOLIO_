let board = new Array(16).fill(0).map(() => new Array(16).fill(0));
let originalBoard = new Array(16).fill(0).map(() => new Array(16).fill(0));

let rowHas = new Array(16).fill(null).map(() => new Array(16).fill(false));
let colHas = new Array(16).fill(null).map(() => new Array(16).fill(false));
let boxHas = new Array(16).fill(null).map(() => new Array(16).fill(false));

const hexScale = '123456789ABCDEF0'.split(''); // Mover la definición de hexScale aquí

function generateSudoku() {
    // Llenar el tablero con números aleatorios
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            board[i][j] = 0; // Inicializar el tablero con ceros
        }
    }

    // Llenar el tablero con backtracking
    fillBoard(0, 0);
    originalBoard = Array.from(board, row => [...row]);
}

function fillBoard(i, j) {
    if (i == 16) {
        return true; // Si hemos llenado todas las celdas, hemos terminado
    }

    let nextI = j == 15 ? i + 1 : i;
    let nextJ = j == 15 ? 0 : j + 1;

    let shuffledHexScale = hexScale.sort(() => Math.random() - 0.5);
    for (let num of shuffledHexScale) {
        let numIndex = parseInt(num, 16);
        if (isSafe(board, i, j, num)) {
            board[i][j] = num;

            // Actualizar las matrices rowHas, colHas y boxHas
            let boxIndex = (i - i % 4) + Math.floor(j / 4);
            rowHas[i][numIndex] = true;
            colHas[j][numIndex] = true;
            boxHas[boxIndex][numIndex] = true;

            if (fillBoard(nextI, nextJ)) {
                return true;
            }

            // Si llegamos a este punto, el número que hemos colocado ha llevado a un callejón sin salida, así que lo quitamos y probamos el siguiente número
            board[i][j] = 0;
            rowHas[i][numIndex] = false;
            colHas[j][numIndex] = false;
            boxHas[boxIndex][numIndex] = false;
        }
    }

    return false; // Si hemos probado todos los números y ninguno funciona, volvemos atrás
}

//console.log(originalBoard);

function isSafe(board, row, col, num) {
    let numIndex = parseInt(num, 16);
    let boxStartRow = row - row % 4;
    let boxStartCol = col - col % 4;
    let boxIndex = boxStartRow + Math.floor(boxStartCol / 4);

    if (rowHas[row][numIndex] || colHas[col][numIndex] || boxHas[boxIndex][numIndex]) {
        return false;
    }

    return true;
}

function isSafeWithOriginal(row, col, num) {
    const originalValue = originalBoard[row][col];
    const inputValue = num.toUpperCase();

    //console.log(originalValue, inputValue);

    // Verificar si los valores coinciden y son válidos en la escala especial
    return originalValue === inputValue && hexScale.includes(inputValue);
}

function generateHints(board, numHints) {
    // Asegurar un número mínimo de pistas
    numHints = Math.max(numHints, 17);

    let count = 0;
    while (count < numHints) {
        let row = Math.floor(Math.random() * 16);
        let col = Math.floor(Math.random() * 16);

        if (board[row][col] !== 0) {
            count++;
            board[row][col] = 0;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const boardContainer = document.getElementById('sudoku-board');

    // Generar la cuadrícula
    function generateSudokuBoard() {
        generateSudoku(); // Genera el tablero de Sudoku completo
        generateHints(board, 170); // Genera 40 ayudas
    
        for (let i = 0; i < 16; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 16; j++) {
                const cell = document.createElement('td');
                if (board[i][j] === 0) {
                    const input = document.createElement('input');
                    input.classList.add('sud');
                    input.type = 'text';
                    input.maxLength = 1;
                    // Agrega estas líneas aquí
                    input.dataset.row = i;
                    input.dataset.col = j;
                    input.addEventListener('input', function () {
                        const value = this.value;
                    
                        const rowIndex = parseInt(this.dataset.row);
                        const colIndex = parseInt(this.dataset.col);
                    
                        //console.log(rowIndex, colIndex, value);
                    
                        if (!isNaN(rowIndex) && !isNaN(colIndex)) {
                            if (!isSafeWithOriginal(rowIndex, colIndex , value)) {
                                this.style.backgroundColor = 'lightcoral';
                                //console.log('Incorrecto');
                            } else {
                                this.style.backgroundColor = 'white';
                                board[rowIndex][colIndex] = value.toUpperCase();
                            }
                        } else {
                            console.log('Error: rowIndex or colIndex is NaN');
                        }
                    });
                    
                    cell.appendChild(input);
                } else {
                    cell.textContent = board[i][j];
                }
                row.appendChild(cell);
            }
            boardContainer.appendChild(row);
        }
        //console.log(originalBoard);
    }
    generateSudokuBoard();
});