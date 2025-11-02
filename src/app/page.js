"use client";

import { add } from "@/libs/counterSlice";
import { useAppDispatch } from "@/libs/hooks/use-app-dispatch";
import { useAppSelector } from "@/libs/hooks/use-app-selector";

export default function Home() {
  const counter = useAppSelector((state) => state.counter.counter);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Weekend Planner</h1>
      <p>Counter: {counter}</p>
      <button onClick={() => dispatch(add())}>Add 1 to counter</button>
    </div>
  );
}
