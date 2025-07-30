// app/tetris/lib/useTetris.ts
import { useEffect, useState } from "react"

type Cell = number
export type Grid = Cell[][]

type Tetromino = {
  shape: Cell[][]
  x: number
  y: number
}

const TETROMINOS: Cell[][][] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
]

const createEmptyGrid = (): Grid =>
  Array.from({ length: 20 }, () => Array(10).fill(0))

function randomTetromino(): Tetromino {
  const shape = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)]
  return {
    shape,
    x: 3,
    y: 0,
  }
}

export function useTetris() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid)
  const [current, setCurrent] = useState<Tetromino>(randomTetromino)
  const [isRunning, setIsRunning] = useState(true)

  const merge = (grid: Grid, piece: Tetromino) => {
    const newGrid = grid.map((row) => [...row])
    piece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) {
          const y = piece.y + dy
          const x = piece.x + dx
          if (y >= 0 && y < 20 && x >= 0 && x < 10) {
            newGrid[y][x] = value
          }
        }
      })
    })
    return newGrid
  }

  const moveDown = () => {
    const newPiece = { ...current, y: current.y + 1 }

    if (!collides(newPiece, grid)) {
      setCurrent(newPiece)
    } else {
      const merged = merge(grid, current)
      setGrid(merged)
      setCurrent(randomTetromino())
    }
  }

  const collides = (piece: Tetromino, grid: Grid): boolean => {
    return piece.shape.some((row, dy) =>
      row.some((value, dx) => {
        if (!value) return false
        const x = piece.x + dx
        const y = piece.y + dy
        return y >= 20 || x < 0 || x >= 10 || (y >= 0 && grid[y][x])
      })
    )
  }

  const move = (dx: number) => {
    const newPiece = { ...current, x: current.x + dx }
    if (!collides(newPiece, grid)) {
      setCurrent(newPiece)
    }
  }

  const rotate = () => {
    const rotated = current.shape[0].map((_, i) =>
      current.shape.map((row) => row[i]).reverse()
    )
    const newPiece = { ...current, shape: rotated }
    if (!collides(newPiece, grid)) {
      setCurrent(newPiece)
    }
  }

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      moveDown()
    }, 800)
    return () => clearInterval(interval)
  }, [current, isRunning])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (!isRunning) return
      if (e.key === "ArrowLeft") move(-1)
      if (e.key === "ArrowRight") move(1)
      if (e.key === "ArrowDown") moveDown()
      if (e.key === "ArrowUp") rotate()
    }

    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [current, grid, isRunning])

  const displayGrid = merge(grid, current)

  return { grid: displayGrid, isRunning, setIsRunning }
}
