import React, { useState } from "react";
import Test2 from "../Test2";

const Test = () => {
  const [count, setCount] = useState(0);
    
    return<>          <button type="button" onClick={() => setCount((count) => count + 1)}>
    count is: {count}
  </button> <Test2 /></>
}

export default Test;