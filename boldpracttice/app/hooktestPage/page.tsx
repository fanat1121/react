"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";

const NewPage: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleButtonClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleResetButtonClick = () => {
    setCount(0);
  };

  return (
    <div>
      <h2>hookTestPage</h2>
      <button onClick={handleButtonClick} className={styles.button}>
        Clicked {count} times
      </button>
      <button onClick={handleResetButtonClick} className={styles.button}>
        Reset
      </button>
    </div>
  );
};

export default NewPage;
