"use client";
import React, { useState } from "react";

export default function page() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex gap-4">
      <button
        className="p-2 bg-amber-900 text-amber-100"
        onClick={() => setCount((pre) => pre + 1)}
      >
        Plus
      </button>
      <h1 className="font-bold">cont:- {count}</h1>
      <button
        className="p-2 bg-amber-900 text-amber-100"
        onClick={() => setCount((pre) => pre - 1)}
      >
        Minus
      </button>
    </div>
  );
}
