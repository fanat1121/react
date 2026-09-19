"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

// 定数の定義
const ROWS = 20;
const COLS = 10;
const EMPTY_CELL = 0;

const TETROMINO_TYPES = {
  I: { shape: [[1, 1, 1, 1]], color: "80, 227, 230" },
  J: { shape: [[0, 0, 1], [1, 1, 1]], color: "36, 95, 223" },
  L: { shape: [[1, 0, 0], [1, 1, 1]], color: "223, 173, 36" },
  O: { shape: [[1, 1], [1, 1]], color: "223, 217, 36" },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: "48, 211, 56" },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: "132, 61, 198" },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "227, 78, 78" },
} as const;

type TetrominoKey = keyof typeof TETROMINO_TYPES;

const randomTetromino = (): { key: TetrominoKey; shape: number[][]; color: string } => {
  const keys = Object.keys(TETROMINO_TYPES) as TetrominoKey[];
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  const type = TETROMINO_TYPES[randKey];
  return {
    key: randKey,
    shape: type.shape.map(row => [...row]),
    color: type.color,
  };
};

const createBoard = (): (TetrominoKey | typeof EMPTY_CELL)[][] =>
  Array.from(Array(ROWS), () => Array(COLS).fill(EMPTY_CELL));

const rotateMatrix = (matrix: number[][]): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const newMatrix: number[][] = Array.from(Array(cols), () => Array(rows).fill(0));
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      newMatrix[x][rows - 1 - y] = matrix[y][x];
    }
  }
  return newMatrix;
};

const Tetris: React.FC = () => {
  const initialTetromino = useMemo(() => randomTetromino(), []);
  const initialPosition = useMemo(() => ({
    x: Math.floor(COLS / 2) - Math.floor(initialTetromino.shape[0].length / 2),
    y: 0,
  }), [initialTetromino]);

  const [board, setBoard] = useState<(TetrominoKey | typeof EMPTY_CELL)[][]>(createBoard());
  const [currentTetromino, setCurrentTetromino] = useState(initialTetromino);
  const [position, setPosition] = useState(initialPosition);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const checkCollision = useCallback(
    (piece: { shape: number[][] }, offset: { x: number; y: number }, boardToCheck: (TetrominoKey | typeof EMPTY_CELL)[][]): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x] !== 0) {
            const boardX = offset.x + x;
            const boardY = offset.y + y;
            if (boardY < 0 || boardY >= ROWS || boardX < 0 || boardX >= COLS) return true;
            if (boardToCheck[boardY] && boardToCheck[boardY][boardX] !== EMPTY_CELL) return true;
          }
        }
      }
      return false;
    },
    []
  );

  const restartGame = useCallback(() => {
    const newInitialPiece = randomTetromino();
    setBoard(createBoard());
    setCurrentTetromino(newInitialPiece);
    setPosition({
      x: Math.floor(COLS / 2) - Math.floor(newInitialPiece.shape[0].length / 2),
      y: 0,
    });
    setScore(0);
    setGameOver(false);
  }, []);

  const handlePlaceTetrominoAndSpawnNew = useCallback(() => {
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              newBoard[boardY][boardX] = currentTetromino.key;
            }
          }
        });
      });

      let linesCleared = 0;
      for (let y_idx = ROWS - 1; y_idx >= 0; ) {
        if (newBoard[y_idx].every(cell => cell !== EMPTY_CELL)) {
          linesCleared++;
          newBoard.splice(y_idx, 1);
          newBoard.unshift(Array(COLS).fill(EMPTY_CELL));
        } else {
          y_idx--;
        }
      }

      if (linesCleared > 0) {
        let points = 0;
        if (linesCleared === 1) points = 100;
        else if (linesCleared === 2) points = 300;
        else if (linesCleared === 3) points = 500;
        else if (linesCleared >= 4) points = 800;
        setScore(prev => prev + points);
      }

      const newPiece = randomTetromino();
      const newPos = {
        x: Math.floor(COLS / 2) - Math.floor(newPiece.shape[0].length / 2),
        y: 0,
      };

      if (checkCollision(newPiece, newPos, newBoard)) {
        setGameOver(true);
      } else {
        setCurrentTetromino(newPiece);
        setPosition(newPos);
      }
      return newBoard;
    });
  }, [currentTetromino, position, checkCollision]);

  const moveDown = useCallback(() => {
    if (gameOver) return;
    if (checkCollision(currentTetromino, { x: position.x, y: position.y + 1 }, board)) {
      handlePlaceTetrominoAndSpawnNew();
    } else {
      setPosition(prev => ({ ...prev, y: prev.y + 1 }));
    }
  }, [gameOver, currentTetromino, position, board, handlePlaceTetrominoAndSpawnNew, checkCollision]);

  useEffect(() => {
    if (gameOver) return;
    const gameInterval = setInterval(moveDown, 1000);
    return () => clearInterval(gameInterval);
  }, [gameOver, moveDown]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r") {
        restartGame();
        return;
      }
      if (gameOver) return;

      let newX = position.x;
      const newY = position.y; // This was already const, keeping it
      let newShape = currentTetromino.shape;

      if (event.key === "ArrowLeft") newX -= 1;
      if (event.key === "ArrowRight") newX += 1;
      if (event.key === "ArrowDown") {
        moveDown();
        return;
      }
      if (event.key === "ArrowUp") {
        const rotated = rotateMatrix(currentTetromino.shape);
        if (!checkCollision({ shape: rotated }, position, board)) {
          newShape = rotated;
        } else {
          if (!checkCollision({ shape: rotated }, { x: position.x + 1, y: position.y }, board)) {
            newX = position.x + 1;
            newShape = rotated;
          } else if (!checkCollision({ shape: rotated }, { x: position.x - 1, y: position.y }, board)) {
            newX = position.x - 1;
            newShape = rotated;
          }
        }
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight" || (event.key === "ArrowUp" && newShape !== currentTetromino.shape)) {
        if (!checkCollision({ shape: newShape }, { x: newX, y: newY }, board)) {
          setPosition({ x: newX, y: newY });
          if (newShape !== currentTetromino.shape) {
            setCurrentTetromino(prev => ({ ...prev, shape: newShape }));
          }
        }
      }
    },
    [gameOver, currentTetromino, position, board, moveDown, checkCollision, restartGame] // Added restartGame
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const displayBoard = useMemo(() => {
    const newDisplayBoard = board.map(row => [...row]);
    if (!gameOver) {
      currentTetromino.shape.forEach((row, y) => {
        row.forEach((cellValue, x) => {
          if (cellValue !== 0) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS && newDisplayBoard[boardY][boardX] === EMPTY_CELL) {
              newDisplayBoard[boardY][boardX] = currentTetromino.key;
            }
          }
        });
      });
    }
    return newDisplayBoard;
  }, [board, currentTetromino, position, gameOver]);

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

export default Tetris;
