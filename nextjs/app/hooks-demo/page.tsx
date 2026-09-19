"use client";

import React, { useState, useMemo } from "react";
import styles from "./page.module.scss";

const HooksDemoPage: React.FC = () => {
  const [trials, setTrials] = useState(0);
  const [dropRate, setDropRate] = useState("1"); // ドロップ率をパーセントで管理

  const probability = useMemo(() => {
    const rate = parseFloat(dropRate) / 100;
    if (isNaN(rate) || rate < 0 || rate > 1) {
      return 0;
    }
    // N回試行して少なくとも1回成功する確率: 1 - (1 - P)^N
    return 1 - Math.pow(1 - rate, trials);
  }, [trials, dropRate]);

  const handleTrialIncrement = () => {
    setTrials((prevTrials) => prevTrials + 1);
  };

  const handleResetButtonClick = () => {
    setTrials(0);
  };

  return (
    <div className={styles.container}>
      <h2>ドロップ期待値計算機</h2>

      <div className={styles.formGroup}>
        <label htmlFor="dropRate" className={styles.label}>ドロップ率 (%):</label>
        <input
          id="dropRate"
          type="number"
          value={dropRate}
          onChange={(e) => setDropRate(e.target.value)}
          className={styles.input}
          min="0"
          max="100"
          step="0.1"
        />
      </div>

      <div className={styles.result}>
        <p>試行回数: {trials}回</p>
        <p>
          この回数までにドロップする確率: {(probability * 100).toFixed(2)}%
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button onClick={handleTrialIncrement} className={styles.button}>
          試行回数を増やす
        </button>
        <button onClick={handleResetButtonClick} className={styles.button}>
          リセット
        </button>
      </div>
    </div>
  );
};

export default HooksDemoPage;
