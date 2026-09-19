import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ROWS,
  COLS,
  EMPTY_CELL,
  TetrominoKey,
  randomTetromino,
  createBoard,
  rotateMatrix,
} from "../const/tetromino";

export const useTetrisGame = () => {
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
      const newY = position.y;
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
    [gameOver, currentTetromino, position, board, moveDown, checkCollision, restartGame]
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

  return { displayBoard, score, gameOver, restartGame };
};
