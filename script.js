let a;
let operator;
let b;
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

let currentOperationString = '';
let lastOperatorUsed = null;
let lastOperandUsed = null;

function updateDisplay(element, type) {
    const currentOperationArr = currentOperationString.trim().split(' ');

    switch (type) {
        case 'number':
            if (newState) {
                clearDisplay();

                newState = false;
            }

            display.textContent += element.textContent;
            currentOperationString += element.textContent;

            break;
        case 'plus':
        case 'minus':
        case 'divide':
        case 'multiply':
            if (currentOperationArr.length === 3) {
                const calcResult = operate(currentOperationArr[0], currentOperationArr[2], currentOperationArr[1]);

                clearDisplay();

                display.textContent = calcResult.toString();
                currentOperationString = calcResult.toString() + ` ${element.textContent} `;

                lastOperandUsed = currentOperationArr[2];
            } else if (currentOperationArr.length === 1) {
                currentOperationString += ` ${element.textContent} `;

                lastOperandUsed = currentOperationArr[0];
            }

            lastOperatorUsed = element.textContent;
            newState = true;

            break;
        case 'equal':
            if (currentOperationArr.length === 3) {
                const calcResult = operate(currentOperationArr[0], currentOperationArr[2], currentOperationArr[1]);

                clearDisplay();

                display.textContent = calcResult.toString();
                currentOperationString = calcResult.toString();

                lastOperandUsed = currentOperationArr[2];
            } else if (currentOperationArr.length === 2) {
                const calcResult = operate(currentOperationArr[0], currentOperationArr[0], lastOperatorUsed);

                clearDisplay();

                display.textContent = calcResult.toString();
                currentOperationString = calcResult.toString();

                lastOperandUsed = currentOperationArr[0];
            } else if (currentOperationArr.length === 1) {
                if (lastOperandUsed == null) {
                    return;
                }

                const calcResult = operate(currentOperationArr[0], lastOperandUsed, lastOperatorUsed);

                clearDisplay();

                display.textContent = calcResult.toString();
                currentOperationString = calcResult.toString();
            }

            newState = true;

            break;
        case 'all-clear':
            display.textContent = '0';
            currentOperationString = '';
            lastOperatorUsed = null;
            lastOperandUsed = null;
            newState = true;

            break;
        case 'plus-minus':
            clearDisplay();

            if (displayArr.length == 1 && typeNum1 != number) {
                display.textContent = '−' + displayArr[0];
            } else if (displayArr.length == 3 && typeNum2 != number) {
                display.textContent = '−' + displayArr[2];
            }

            break;
        case 'percent':
            clearDisplay();

            if (displayArr.length == 1 && typeNum1 != number) {
                display.textContent = '−' + displayArr[0];
            } else if (displayArr.length == 3 && typeNum2 != number) {
                display.textContent = '−' + displayArr[2];
            }

            break;
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