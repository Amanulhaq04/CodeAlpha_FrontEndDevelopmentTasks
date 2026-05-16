class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
            return;
        }
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.currentOperand === '') {
            if (this.previousOperand !== '') {
                this.operation = operation;
                this.updateDisplay();
            }
            return;
        }
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '−': case '-': computation = prev - current; break;
            case '×': case '*': computation = prev * current; break;
            case '÷': case '/': 
                if (current === 0) {
                    alert("Math Error: Division by Zero");
                    this.clear();
                    return;
                }
                computation = prev / current; 
                break;
            default: return;
        }
        
        computation = Math.round(computation * 100000000) / 100000000;
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand) || '0';
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const introPage = document.getElementById('intro-page');
const calculatorPage = document.getElementById('calculator-page');
const launchBtn = document.getElementById('launch-btn');
const backBtn = document.getElementById('back-btn');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event Listeners
launchBtn.addEventListener('click', () => {
    introPage.classList.add('hidden');
    calculatorPage.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
    calculatorPage.classList.add('hidden');
    introPage.classList.remove('hidden');
});

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        animateBtn(button);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
        animateBtn(button);
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    animateBtn(equalsButton);
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    animateBtn(allClearButton);
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    animateBtn(deleteButton);
});

function animateBtn(btn) {
    btn.classList.add('keyboard-active');
    setTimeout(() => btn.classList.remove('keyboard-active'), 100);
}

// Keyboard Support
document.addEventListener('keydown', e => {
    if (calculatorPage.classList.contains('hidden')) {
        if (e.key === 'Enter') launchBtn.click();
        return;
    }

    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
        highlightKey('[data-delete]');
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
        highlightKey('[data-all-clear]');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
        highlightKey('[data-equals]');
    } else if (/[0-9\.]/.test(e.key)) {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
        highlightKey('[data-number]', e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        let op = e.key;
        if (op === '*') op = '×';
        if (op === '/') op = '÷';
        if (op === '-') op = '−';
        calculator.chooseOperation(op);
        calculator.updateDisplay();
        highlightKey('[data-operation]', op);
    }
});

function highlightKey(selector, value) {
    let btn;
    if (value) {
        document.querySelectorAll(selector).forEach(b => {
            if (b.innerText === value) btn = b;
        });
    } else {
        btn = document.querySelector(selector);
    }
    if (btn) animateBtn(btn);
}
