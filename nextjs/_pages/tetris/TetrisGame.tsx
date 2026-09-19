"use client";

import React from "react";
import { useTetrisGame } from "./hooks/useTetrisGame";
import { EMPTY_CELL, ROWS, COLS, TETROMINO_TYPES, TetrominoKey } from "./const/tetromino";

export const TetrisGame: React.FC = () => {
  const { displayBoard, score, gameOver, restartGame } = useTetrisGame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Tetris</h1>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', border: '2px solid #333', display: 'inline-block', marginRight: '20px' }}>
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${ROWS}, 20px)`,
              gridTemplateColumns: `repeat(${COLS}, 20px)`,
              backgroundColor: '#f0f0f0',
            }}
          >
            {displayBoard.map((row, y_idx) =>
              row.map((cell, x_idx) => (
                <div
                  key={`${x_idx}-${y_idx}`}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: cell === EMPTY_CELL
                      ? "rgba(230, 230, 230, 0.1)"
                      : `rgba(${TETROMINO_TYPES[cell as TetrominoKey].color}, 0.9)`,
                    border: "1px solid #ccc",
                    boxSizing: 'border-box',
                  }}
                />
              ))
            )}
          </div>
          {gameOver && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              padding: '20px',
              borderRadius: '10px',
              fontSize: '2em',
              textAlign: 'center',
              zIndex: 10,
            }}>
              Game Over!
              <p style={{fontSize: '0.6em', margin: '10px 0 0'}}>Score: {score}</p>
              <button
                onClick={restartGame}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  fontSize: '0.6em',
                  cursor: 'pointer',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Restart
              </button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p style={{ fontSize: '1.2em', margin: '0 0 10px 0' }}>Score: {score}</p>
          {!gameOver && (
            <button
              onClick={restartGame}
              style={{
                padding: '10px 15px',
                fontSize: '1em',
                cursor: 'pointer',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginBottom: '20px'
              }}
            >
              Restart Game
            </button>
          )}
          <div style={{ textAlign: 'left', fontSize: '0.9em', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
            <h4>操作方法:</h4>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
              <li>← → : 左右移動</li>
              <li>↑ : 回転</li>
              <li>↓ : ソフトドロップ</li>
              <li>R : リスタート</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
