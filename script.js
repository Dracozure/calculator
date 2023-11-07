let newState = true; //When "equal" is entered and followed by a number, a new state is triggered and display is reset

const numButtons = document.querySelectorAll('.number');
const mathOperatorButtons = document.querySelectorAll('.operator');
const display = document.getElementById('display');

Array.from(numButtons).forEach(num => {
    num.addEventListener('click', () => {
        updateDisplay(num, 'number');
    });
});

Array.from(mathOperatorButtons).forEach(operator => {
    operator.addEventListener('click', () => {
        if (display.textContent.length >= 1) {
            updateDisplay(operator, operator.id);
        }
    });
});

let currentOperationString = '0';
let lastOperatorUsed = null;
let lastOperandUsed = null;
let percentValue = null; //Stores temporary value for when percent operator is used
let percentageIterations = 1; //Stores value of consecutive percent operator calculations for one operand

function updateDisplay(element, type) {
    let currentOperationArr = currentOperationString.trim().split(' ');

    switch (type) {
        case 'number':
            if (percentValue != null) {
                clearDisplay();

                if (currentOperationArr.length === 1 || currentOperationArr.length === 2) {
                    currentOperationString = '0';
                    currentOperationArr[0] = '0';

                } else if (currentOperationArr.length === 3) {
                    currentOperationString = 
                    currentOperationArr[0]
                    + ` ${currentOperationArr[1]} `;
                    currentOperationArr = currentOperationArr.slice(0, -1);
                }

                percentValue = null;
                percentageIterations = 1;
            }

            if (newState) {
                clearDisplay();

                if (currentOperationArr.length === 1) {
                    currentOperationString = '0';
                    currentOperationArr[0] = '0';
                }

                newState = false;
            }

            if (display.textContent == '-0') { //Handling of edge case where user press plus-minus operator before a number, resulting in a -0 result
                currentOperationString = currentOperationString.slice(0, -1);
                display.textContent = display.textContent.slice(0, -1);
            }

            if (currentOperationArr.length === 1) {
                if (currentOperationArr[0] == '0') {
                    clearDisplay();
                    
                    currentOperationString = '';
                }  
            } else if (currentOperationArr.length === 3) {
                if (currentOperationArr[2] == '0') {
                    clearDisplay();

                    currentOperationArr = currentOperationArr.slice(0, -1);
                }
            } 

            display.textContent += element.textContent;
            currentOperationString += element.textContent;

            break;
        case 'plus':
        case 'minus':
        case 'divide':
        case 'multiply':
            if (display.textContent === 'Error') {
                updateDisplay(null, 'all-clear');
                display.textContent = 'Error';
            }

            if (percentValue != null) {
                if (currentOperationArr.length === 1) {
                    currentOperationString = percentValue.toString();
                    currentOperationArr[0] = percentValue.toString();
                } else if (currentOperationArr.length === 3) {
                    currentOperationString = 
                    currentOperationArr[0]
                    + ` ${currentOperationArr[1]} `
                    + percentValue;
                    currentOperationArr[2] = percentValue;
                } else if (currentOperationArr.length === 2) {
                    clearDisplay();

                    percentValue = null;
                    percentageIterations = 1;

                    display.textContent = currentOperationArr[0];
                }

                percentValue = null;
                percentageIterations = 1;
            }

            if (currentOperationArr.length === 3) {
                const calcResult = operate(currentOperationArr[0], currentOperationArr[2], currentOperationArr[1]);

                if (display.textContent === 'Error') {
                    return;
                }

                clearDisplay();

                display.textContent = calcResult.toString();
                currentOperationString = calcResult.toString() + ` ${element.textContent} `;

                lastOperandUsed = currentOperationArr[2];
            } else if (currentOperationArr.length === 2) {
                currentOperationString =
                currentOperationArr[0]
                + ` ${element.textContent} `;
            } else if (currentOperationArr.length === 1) {
                currentOperationString += ` ${element.textContent} `;

                lastOperandUsed = currentOperationArr[0];
            }

            lastOperatorUsed = element.textContent;
            newState = true;

            break;
        case 'equal':
            if (display.textContent === 'Error') {
                updateDisplay(null, 'all-clear');
                display.textContent = 'Error';
            }

            if (percentValue != null) {
                if (currentOperationArr.length === 3) {
                    currentOperationString = 
                    currentOperationArr[0]
                    + ` ${currentOperationArr[1]} `
                    + percentValue;
                    currentOperationArr[2] = percentValue;
                } else if (currentOperationArr.length === 2) {
                    const tempArr = [currentOperationArr[0], currentOperationArr[1], percentValue];
                    currentOperationString += percentValue;
                    currentOperationArr = tempArr;
                }

                percentValue = null;
                percentageIterations = 1;
            }

            if (currentOperationArr.length === 3) {
                const calcResult = operate(currentOperationArr[0], currentOperationArr[2], currentOperationArr[1]);

                if (display.textContent === 'Error') {
                    return;
                }

                clearDisplay();

                display.textContent = calcResult.toString();
                currentOperationString = calcResult.toString();

                lastOperandUsed = currentOperationArr[2];
            } else if (currentOperationArr.length === 2) {
                const secondOperand = (display.textContent == '0' || display.textContent == '-0') ? 0 : currentOperationArr[0];
                const calcResult = operate(currentOperationArr[0], secondOperand, lastOperatorUsed);

                if (display.textContent === 'Error') {
                    return;
                }

                clearDisplay();

                display.textContent = calcResult.toString();
                currentOperationString = calcResult.toString();

                lastOperandUsed = secondOperand;
            } else if (currentOperationArr.length === 1) {
                if (lastOperatorUsed == null) {
                    currentOperationString = '0';

                    break;
                }

                const calcResult = operate(currentOperationArr[0], lastOperandUsed, lastOperatorUsed);

                if (display.textContent === 'Error') {
                    return;
                }

                clearDisplay();

                display.textContent = calcResult.toString();
                currentOperationString = calcResult.toString();
            }

            percentValue = null;
            percentageIterations = 1;

            newState = true;

            break;
        case 'all-clear':
            display.textContent = '0';
            currentOperationString = '0';
            lastOperatorUsed = null;
            lastOperandUsed = null;
            newState = true;
            percentValue = null;
            percentageIterations = 1;

            break;
        case 'plus-minus':
            if (display.textContent === 'Error') {
                return;
            }

            clearDisplay();

            if (percentValue != null) {
                if (currentOperationArr.length === 2) {
                    display.textContent = '-0';

                    percentValue = null;
                    percentageIterations = 1;

                    newState = true;

                    break;
                }
                if (!percentValue.toString().includes('-')) {
                    display.textContent = '-' + percentValue;
                    percentValue = '-' + percentValue;
                } else {
                    display.textContent = percentValue.toString().slice(1);
                    percentValue = percentValue.toString().slice(1);
                }

                newState = false;

                break;
            }

            if (currentOperationArr.length === 3) {
                if (currentOperationArr[2].includes('-')) {
                    currentOperationString = 
                    currentOperationArr[0]
                    + ` ${currentOperationArr[1]} `
                    + currentOperationArr[2].slice(1);

                    display.textContent = currentOperationArr[2].slice(1);
                }

                else {
                    currentOperationString = 
                    currentOperationArr[0]
                    + ` ${currentOperationArr[1]} `
                    + '-' + currentOperationArr[2];

                    display.textContent = '-' + currentOperationArr[2];
                }
            } else if (currentOperationArr.length === 2) {
                const isOperatorFirstIndex = typeof +currentOperationArr[0] != 'number';

                if (isOperatorFirstIndex) {
                    if (currentOperationArr[1].includes('-')) {
                        currentOperationString = ` ${currentOperationArr[0]} ${currentOperationArr[1].slice(1)}`;

                        display.textContent = currentOperationArr[1].slice(1);
                    } else {
                        currentOperationString = ` ${currentOperationArr[0]} -${currentOperationArr[1]}`;

                        display.textContent = '-' + currentOperationArr[1];
                    }
                } else {
                    currentOperationString = 
                    currentOperationArr[0]
                    + ` ${currentOperationArr[1]} `
                    + '-0';

                    display.textContent = '-0';
                }
            } else if (currentOperationArr.length === 1) {
                if (currentOperationArr[0].includes('-')) {
                    currentOperationString = currentOperationArr[0].slice(1);

                    display.textContent = currentOperationArr[0].slice(1);
                } else {
                    currentOperationString = '-' + currentOperationArr[0];

                    display.textContent = '-' + currentOperationArr[0];
                }
            }

            newState = false;

            break;
        case 'decimal':
            if (Math.abs(+display.textContent).toString().length >= 9) {
                return;
            }
            
            if (percentValue != null) {
                clearDisplay();
                percentageIterations = 1;
                percentValue = null;

                if (currentOperationArr.length === 1) {
                    currentOperationString = '';
                    currentOperationArr[0] = '0';
                } else if (currentOperationArr.length === 3) {
                    currentOperationString = 
                    currentOperationArr[0]
                    + ` ${currentOperationArr[1]} `;
                    currentOperationArr = currentOperationArr.slice(0, -1);
                }
            }

            if (currentOperationArr.length === 1) {
                if (newState) {
                    currentOperationArr[0] = '0';
                    currentOperationString = '0';
                }

                let numLength;

                if (currentOperationArr[0].includes('.')) {
                    return;
                }

                for (let char in currentOperationArr[0]) {
                    numLength += (typeof +char == 'number') ? 1 : 0;
                }

                if (numLength == 9) {
                    return;
                }
            } else if (currentOperationArr.length === 3) {
                let numLength;

                if (currentOperationArr[2].includes('.')) {
                    return;
                }

                for (let char in currentOperationArr[2]) {
                    numLength += (typeof +char == 'number') ? 1 : 0;
                }

                if (numLength == 9) {
                    return;
                }
            }

            clearDisplay();

            if (currentOperationArr.length === 1) {
                currentOperationString = currentOperationArr[0] + '.';

                display.textContent = currentOperationArr[0] + '.';
            } else if (currentOperationArr.length === 2) {
                currentOperationString = currentOperationString + '0.';

                display.textContent = '0.';
            } else if (currentOperationArr.length === 3) {
                currentOperationString = currentOperationString + '.';

                display.textContent = currentOperationArr[2] + '.';
            }

            newState = false;

            break;
        case 'percent':
            if (display.textContent === 'Error') {
                return;
            }

            clearDisplay();

            const negPosSign = (percentValue && percentValue.toString().includes('-')) ? -1 : 1;

            if (currentOperationArr.length === 1) {
                percentValue = currentOperationArr[0] / (100 ** percentageIterations);
            } else if (currentOperationArr.length === 2) {
                if (currentOperationArr[1] == '÷' || currentOperationArr[1] == '×') {
                    percentValue = currentOperationArr[0] / (100 ** percentageIterations);
                } else {
                    percentValue = operate((currentOperationArr[0] ** (percentageIterations + 1)), (10 ** (2 * percentageIterations)), '÷');
                }
            } else if (currentOperationArr.length === 3) {
                if (currentOperationArr[1] == '÷' || currentOperationArr[1] == '×') {
                    percentValue = currentOperationArr[2] / (100 ** percentageIterations);
                } else {
                    percentValue = operate((currentOperationArr[0] ** percentageIterations), (100 ** percentageIterations), '÷') * currentOperationArr[2];
                }
            }

            percentValue *= negPosSign;

            display.textContent = percentValue.toString();
            percentageIterations++;

            return;
    }
}

function operate(a, b, operator) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '−':
            return subtract(a, b);
        case '×':
            return multiply(a, b);
        case '÷':
            if (b == 0) {
                updateDisplay(null, 'all-clear');
                display.textContent = 'Error';
                return 'Error';
            }
            return divide(a, b);
    }
}

function add(a, b) {
    return +a + +b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function getDecimal(num) {
    return num + '.';
}

function getPercentage(num) {
    return +num / 100;
}

function clearDisplay() {
    display.textContent = '';
}