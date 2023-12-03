// import logo from "./logo.svg";
import { useReducer } from "react";
import "./App.css";
import "./index.css";
import "./Digits.js";
import DigitButton from "./Digits.js";
import OperationButton from "./Operations.js";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export const ACTIONS = {
  ADD_DIGIT: `add-digit`,
  CHOOSE_OPERATION: `choose-operation`,
  CLEAR: `clear`,
  DELETE_DIGIT: `delete-digit`,
  SOLVE: `solve`,
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand === null || operand === undefined) return;

  const [integer, decimal] = operand.split(".");

  if (decimal === null || decimal === undefined)
    return INTEGER_FORMATTER.format(integer);

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite)
        return { ...state, currentOperand: payload.digit, overwrite: false };

      if (Number(payload.digit) === 0 && Number(state.currentOperand) === 0)
        return state;
      if (payload.digit === `.` && state.currentOperand.includes("."))
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ``}${payload.digit}`,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return { ...state, overwrite: false, currentOperand: null };
      }
      if (state.currentOperand === null) return state;
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null };
      return { ...state, currentOperand: state.currentOperand.slice(0, -1) };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === null && state.previousOperand === null)
        return state;

      if (state.currentOperand === null) {
        return { ...state, operation: payload.operation };
      }

      if (state.previousOperand === null || state.previousOperand === undefined)
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.SOLVE:
      if (
        state.operation === null ||
        state.previousOperand === null ||
        state.currentOperand === null
      )
        return state;

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const [prev, curr] = [
    parseFloat(previousOperand),
    parseFloat(currentOperand),
  ];

  if (isNaN(prev) || isNaN(curr)) return "";

  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + curr;
      break;

    case "-":
      computation = prev - curr;
      break;

    case "*":
      computation = prev * curr;
      break;

    case "/":
      computation = prev / curr;
      break;
  }

  return computation.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } });

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)}
          {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <button
        className="span-two"
        onClick={function () {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        Clear
      </button>
      <button
        onClick={function () {
          dispatch({ type: ACTIONS.DELETE_DIGIT });
        }}
      >
        DEL
      </button>
      {/* <button>➗</button> */}
      <OperationButton operation="/" dispatch={dispatch}></OperationButton>

      <DigitButton digit="7" dispatch={dispatch}></DigitButton>
      <DigitButton digit="8" dispatch={dispatch}></DigitButton>
      <DigitButton digit="9" dispatch={dispatch}></DigitButton>
      <OperationButton operation="*" dispatch={dispatch}></OperationButton>
      {/* <button>7</button>
      <button>8</button>
    <button>9</button> */}
      {/* <button>*</button> */}

      <DigitButton digit="4" dispatch={dispatch}></DigitButton>
      <DigitButton digit="5" dispatch={dispatch}></DigitButton>
      <DigitButton digit="6" dispatch={dispatch}></DigitButton>
      <OperationButton operation="+" dispatch={dispatch}></OperationButton>
      {/* <button>4</button>
      <button>5</button>
      <button>6</button> */}
      {/* <button>+</button> */}

      <DigitButton digit="1" dispatch={dispatch}></DigitButton>
      <DigitButton digit="2" dispatch={dispatch}></DigitButton>
      <DigitButton digit="3" dispatch={dispatch}></DigitButton>
      <OperationButton operation="-" dispatch={dispatch}></OperationButton>
      {/* <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>-</button> */}

      {/* <button>0</button>
      <button>.</button> */}
      <DigitButton digit="0" dispatch={dispatch}></DigitButton>
      <DigitButton digit="." dispatch={dispatch}></DigitButton>
      <button
        className="span-two"
        onClick={function () {
          dispatch({ type: ACTIONS.SOLVE });
        }}
      >
        ENTER
      </button>
    </div>
  );
}

export default App;
