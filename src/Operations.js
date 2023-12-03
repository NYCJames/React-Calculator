import { ACTIONS } from "./App.js";

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={function () {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } });
      }}
    >
      {operation}
    </button>
  );
}
