import { useState } from 'react';
import './App.css';

function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [previousInput, setPreviousInput] = useState('');
  const [operator, setOperator] = useState('');
  const [runningTotal, setRunningTotal] = useState(null);
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);
  const [history, setHistory] = useState('');

  const handleNumberClick = (value) => {
    if (isResultDisplayed) {
      // Reset state after result is displayed
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
      // Allow negative numbers
      setCurrentInput('-');
      return;
    }

    if (currentInput !== '') {
      if (runningTotal !== null) {
        // Perform calculation with running total
        const result = calculateResult(runningTotal, parseFloat(currentInput), operator);
        setRunningTotal(result);
        setCurrentInput('');
        setOperator(op);
        setIsResultDisplayed(false);
        // Update history
        setHistory(prevHistory => `${prevHistory} ${currentInput} ${op}`);
      } else {
        // Initialize running total
        setRunningTotal(parseFloat(currentInput));
        setPreviousInput(currentInput);
        setCurrentInput('');
        setOperator(op);
        setIsResultDisplayed(false);
        // Update history
        setHistory(prevHistory => `${currentInput} ${op}`);
      }
    } else if (operator !== '') {
      // Change operator if no new input
      setOperator(op);
      setHistory(prevHistory => prevHistory.slice(0, -1) + op); // Update the last operator in history
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
        return (num1 * num2) / 100;
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
    // Append result to history with new line
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

  // Helper function to get the last two lines from the history
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
        <div className="menu">Menu</div>
        <div className="record">Record</div>
      </div>

      {/* Display */}
      <div className="display">
        <div className="history">
          {getLastTwoRows(history)}
        </div>
        <div className="result">
          {isResultDisplayed ? (runningTotal !== null ? runningTotal : '') : (currentInput !== '' ? currentInput : '')}
        </div>
      </div>

      <div className="calculator-top-row">
        <div className="top-button">MC</div>
        <div className="top-button">CE</div>
        <div className="top-button">M+</div>
        <div className="top-button">M-</div>
        <div className="top-button">MS</div>
        <div className="top-button">M^</div>
      </div>

      <div className="calculator-row">
        <button className="single-button" onClick={() => handleOperationClick('%')}>%</button>
        <button className="single-button">CE</button>
        <button className="single-button" onClick={handleClear}>C</button>
        <button className="single-button" onClick={handleDelClick}>Del</button>
      </div>
      <div className="calculator-row">
        <button className="single-button">1/x</button>
        <button className="single-button">x²</button>
        <button className="single-button">√</button>
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
