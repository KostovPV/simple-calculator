import { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareRootVariable } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [previousInput, setPreviousInput] = useState('');
  const [operator, setOperator] = useState('');
  const [runningTotal, setRunningTotal] = useState(null);
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);
  const [history, setHistory] = useState('');
  const [memory, setMemory] = useState(0);

  const handleNumberClick = (value) => {
    if (isResultDisplayed) {
      setPreviousInput('');
      setOperator('');
      setRunningTotal(null);
      setCurrentInput(value);
      setIsResultDisplayed(false);
    } else {
      setCurrentInput(currentInput + value);
    }
  };

  const handleOperationClick = (op) => {
    if (currentInput === '' && op === '-') {
      setCurrentInput('-');
      return;
    }

    if (currentInput !== '') {
      if (runningTotal !== null) {
        const result = calculateResult(runningTotal, parseFloat(currentInput), operator);
        setRunningTotal(result);
        setCurrentInput('');
        setOperator(op);
        setIsResultDisplayed(false);
        setHistory(prevHistory => `${prevHistory} ${currentInput} ${op}`);
      } else {
        setRunningTotal(parseFloat(currentInput));
        setPreviousInput(currentInput);
        setCurrentInput('');
        setOperator(op);
        setIsResultDisplayed(false);
        setHistory(prevHistory => `${currentInput} ${op}`);
      }
    } else if (operator !== '') {
      setOperator(op);
      setHistory(prevHistory => prevHistory.slice(0, -1) + op);
    }
  };

  const calculateResult = (num1, num2, op) => {
    switch (op) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case 'x':
        return num1 * num2;
      case '/':
        return num2 === 0 ? 'Error' : num1 / num2;
      case '%':
        return num1 * (num2 / 100);
      default:
        return num1;
    }
  };

  const handleEqualsClick = () => {
    if (operator === '' || currentInput === '') return;

    const result = calculateResult(runningTotal, parseFloat(currentInput), operator);
    setRunningTotal(result);
    setCurrentInput(result.toString());
    setPreviousInput('');
    setOperator('');
    setIsResultDisplayed(true);
    setHistory(prevHistory => `${prevHistory} ${currentInput} = ${result}\n`);
  };

  const handleClear = () => {
    setCurrentInput('');
    setPreviousInput('');
    setOperator('');
    setRunningTotal(null);
    setIsResultDisplayed(false);
    setHistory('');
  };

  const handleDelClick = () => {
    setCurrentInput(currentInput.slice(0, -1));
  };

  const handleDecimalClick = () => {
    if (!currentInput.includes('.')) {
      setCurrentInput(currentInput + '.');
    }
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleMemoryRecall = () => {
    setCurrentInput(memory.toString());
    setIsResultDisplayed(false);
  };

  const handleMemoryAdd = () => {
    const currentValue = parseFloat(currentInput || '0');
    setMemory(memory + currentValue);
    setIsResultDisplayed(false);
  };

  const handleMemorySubtract = () => {
    const currentValue = parseFloat(currentInput || '0');
    setMemory(memory - currentValue);
    setIsResultDisplayed(false);
  };

  const handleMemoryStore = () => {
    if (currentInput) {
      setMemory(parseFloat(currentInput));
      setIsResultDisplayed(false);
    }
  };

  const handleSpecialOperation = (operation) => {
    const value = parseFloat(currentInput);
    let result;
    let historyEntry;
  
    switch (operation) {
      case '1/x':
        result = value ? (1 / value) : 'Error';
        setCurrentInput(result.toString());
        setIsResultDisplayed(true);
        historyEntry = `1/${value}`;
        setHistory(prevHistory => `${prevHistory} (${historyEntry})`);
        break;
      case 'x²':
        result = value * value;
        historyEntry = `${value}²`;
        setCurrentInput(result.toString());
        setIsResultDisplayed(true);
        setHistory(prevHistory => `${prevHistory} (${historyEntry})`);
        break;
      case '√':
        result = value >= 0 ? Math.sqrt(value) : 'Error';
        setCurrentInput(result.toString());
        setIsResultDisplayed(true);
        historyEntry = `${value}`;
        setHistory(prevHistory => `${prevHistory} (√${historyEntry})`);
        break;
      default:
        result = '';
        historyEntry = '';
    }
  };
  
  

  const getLastTwoRows = (history) => {
    const rows = history.trim().split('\n').filter(row => row !== '');
    return rows.slice(-2).join('\n');
  };

  return (
    <section className="calculator-container">
      <div className="name-bar">
        <div className="menu">Calculator</div>
      </div>

      <div className="top-bar">
        <div className="menu">Standard </div>
        <div className="record"><FontAwesomeIcon icon={faClockRotateLeft} /></div>
      </div>

      {/* Display */}
      <div className="display">
        <div className="history">
          {getLastTwoRows(history)}
        </div>
        <div className="result">
          {currentInput}
        </div>
      </div>

      <div className="calculator-top-row">
        <div className="single-button" onClick={handleMemoryClear}>MC</div>
        <div className="single-button" onClick={handleMemoryRecall}>MR</div>
        <div className="single-button" onClick={handleMemoryAdd}>M+</div>
        <div className="single-button" onClick={handleMemorySubtract}>M-</div>
        <div className="single-button" onClick={handleMemoryStore}>MS</div>
      </div>

      <div className="calculator-row">
        <button className="single-button" onClick={() => handleOperationClick('%')}>%</button>
        <button className="single-button">CE</button>
        <button className="single-button" onClick={handleClear}>C</button>
        <button className="single-button" onClick={handleDelClick}>Del</button>
      </div>
      <div className="calculator-row">
        <button className="single-button" onClick={() => handleSpecialOperation('1/x')}>1/x</button>
        <button className="single-button" onClick={() => handleSpecialOperation('x²')}>x²</button>
        <button className="single-button" onClick={() => handleSpecialOperation('√')}><FontAwesomeIcon icon={faSquareRootVariable} /></button>
        <button className="single-button" onClick={() => handleOperationClick('/')}>/</button>
      </div>
      <div className="calculator-row">
        <button className="single-button" onClick={() => handleNumberClick('7')}>7</button>
        <button className="single-button" onClick={() => handleNumberClick('8')}>8</button>
        <button className="single-button" onClick={() => handleNumberClick('9')}>9</button>
        <button className="single-button" onClick={() => handleOperationClick('x')}>x</button>
      </div>
      <div className="calculator-row">
        <button className="single-button" onClick={() => handleNumberClick('4')}>4</button>
        <button className="single-button" onClick={() => handleNumberClick('5')}>5</button>
        <button className="single-button" onClick={() => handleNumberClick('6')}>6</button>
        <button className="single-button" onClick={() => handleOperationClick('-')}>-</button>
      </div>
      <div className="calculator-row">
        <button className="single-button" onClick={() => handleNumberClick('1')}>1</button>
        <button className="single-button" onClick={() => handleNumberClick('2')}>2</button>
        <button className="single-button" onClick={() => handleNumberClick('3')}>3</button>
        <button className="single-button" onClick={() => handleOperationClick('+')}>+</button>
      </div>
      <div className="calculator-row">
        <button className="single-button">+/-</button>
        <button className="single-button" onClick={() => handleNumberClick('0')}>0</button>
        <button className="single-button" onClick={handleDecimalClick}>.</button>
        <button className="single-button" onClick={handleEqualsClick}>=</button>
      </div>
    </section>
  );
}

export default App;
