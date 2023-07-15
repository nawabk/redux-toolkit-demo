import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { decrement, increment, incrementByAmount } from "../features/counter";

function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLInputElement>(null);

  function addClickHandler() {
    let value = ref.current?.value ?? "";

    const valueNum = parseInt(value);
    if (!Number.isNaN(valueNum)) {
      dispatch(incrementByAmount(valueNum));
    }
  }
  return (
    <>
      <h1>{count}</h1>
      <div className="counter-actions">
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
      </div>
      <div className="counter-input">
        <input type="number" ref={ref} />
        <button onClick={addClickHandler}>Add</button>
      </div>
    </>
  );
}

export default Counter;
