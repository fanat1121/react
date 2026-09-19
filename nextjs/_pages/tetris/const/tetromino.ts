export const ROWS = 20;
export const COLS = 10;
export const EMPTY_CELL = 0;

export const TETROMINO_TYPES = {
  I: { shape: [[1, 1, 1, 1]], color: "80, 227, 230" },
  J: { shape: [[0, 0, 1], [1, 1, 1]], color: "36, 95, 223" },
  L: { shape: [[1, 0, 0], [1, 1, 1]], color: "223, 173, 36" },
  O: { shape: [[1, 1], [1, 1]], color: "223, 217, 36" },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: "48, 211, 56" },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: "132, 61, 198" },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "227, 78, 78" },
} as const;

export type TetrominoKey = keyof typeof TETROMINO_TYPES;

export const randomTetromino = (): { key: TetrominoKey; shape: number[][]; color: string } => {
  const keys = Object.keys(TETROMINO_TYPES) as TetrominoKey[];
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  const type = TETROMINO_TYPES[randKey];
  return {
    key: randKey,
    shape: type.shape.map(row => [...row]),
    color: type.color,
  };
};

export const createBoard = (): (TetrominoKey | typeof EMPTY_CELL)[][] =>
  Array.from(Array(ROWS), () => Array(COLS).fill(EMPTY_CELL));

export const rotateMatrix = (matrix: number[][]): number[][] => {
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
