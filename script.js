let a;
let operator;
let b;
let newState = false; //When "equal" is entered and followed by a number, a new state is triggered
                      // and reset display

const numButtons = document.querySelectorAll('.number');
const mathOperatorButtons = document.querySelectorAll('.operator.math');
const otherOperatorButtons = document.querySelectorAll('.operator.other');
const decimalOperatorButton = document.getElementById('decimal');
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

function updateDisplay(element, type) {
    const displayArr = display.textContent.trim().split(' ');

    switch (type) {
        case 'number':
            if (display.textContent === '0' || (newState && displayArr.length == 1)) {
                clearDisplay();

                if (newState) {
                    newState = false;
                }
            }

            display.textContent += element.textContent;

            break;
        case 'plus':
        case 'minus':
        case 'divide':
        case 'multiply':
            clearDisplay();

            if (displayArr.length == 3) {
                display.textContent = `${operate(displayArr[0], displayArr[2], displayArr[1])} 
                ${element.textContent} `;
            } else {
                display.textContent = `${displayArr[0]} ${element.textContent} `;
            }

            break;
        case 'equal':
            if (displayArr.length == 3) {
                clearDisplay();

                display.textContent = operate(displayArr[0], displayArr[2], displayArr[1]);

                newState = true;
            }

            break;
        case 'all-clear':
            clearDisplay();

            newState = false;
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