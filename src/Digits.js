import { ACTIONS } from "./App.js";

export default function DigitButton({ dispatch, digit }) {
  return (
    <button
      onClick={function () {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } });
      }}
    >
      {digit}
    </button>
  );
}
