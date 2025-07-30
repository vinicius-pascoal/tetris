import { useEffect, useRef, useState } from "react"

type Cell = number
export type Grid = Cell[][]

export type Tetromino = {
  shape: Cell[][]
  x: number
  y: number
}

const TETROMINOS = [
  { shape: [[1, 1, 1, 1]], id: 1 },
  { shape: [[1, 1], [1, 1]], id: 2 },
  { shape: [[0, 1, 0], [1, 1, 1]], id: 3 },
  { shape: [[1, 1, 0], [0, 1, 1]], id: 4 },
  { shape: [[0, 1, 1], [1, 1, 0]], id: 5 },
  { shape: [[1, 0, 0], [1, 1, 1]], id: 6 },
  { shape: [[0, 0, 1], [1, 1, 1]], id: 7 },
]

const createEmptyGrid = (): Grid =>
  Array.from({ length: 20 }, () => Array(10).fill(0))

function randomTetromino(): Tetromino {
  const t = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)]
  const shape = t.shape.map(row => row.map(cell => (cell ? t.id : 0)))
  return { shape, x: 3, y: 0 }
}

const deepClone = (piece: Tetromino): Tetromino => ({
  shape: piece.shape.map(row => [...row]),
  x: piece.x,
  y: piece.y,
})

export function useTetris() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid)
  const [current, setCurrent] = useState<Tetromino>(randomTetromino)
  const [next, setNext] = useState<Tetromino>(randomTetromino)
  const [isRunning, setIsRunning] = useState(true)
  const [score, setScore] = useState(0)
  const [clearingRows, setClearingRows] = useState<number[]>([])
  const [level, setLevel] = useState(1)
  const [linesCleared, setLinesCleared] = useState(0)
  const [isFastDropping, setIsFastDropping] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const baseSpeed = 500
  const speed = Math.max(100, baseSpeed - (level - 1) * 50)
  const dropSpeed = isFastDropping ? 50 : speed

  const collides = (piece: Tetromino, grid: Grid): boolean => {
    return piece.shape.some((row, dy) =>
      row.some((value, dx) => {
        if (!value) return false
        const x = piece.x + dx
        const y = piece.y + dy
        return y >= 20 || x < 0 || x >= 10 || (y >= 0 && grid[y][x] !== 0)
      })
    )
  }

  const merge = (grid: Grid, piece: Tetromino): Grid => {
    const tempGrid = grid.map(row => [...row])
    piece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) {
          const y = piece.y + dy
          const x = piece.x + dx
          if (y >= 0 && y < 20 && x >= 0 && x < 10) {
            tempGrid[y][x] = value
          }
        }
      })
    })
    return tempGrid
  }

  const detectFullRows = (grid: Grid): number[] =>
    grid.reduce<number[]>((acc, row, i) => {
      if (row.every(cell => cell !== 0)) acc.push(i)
      return acc
    }, [])

  // Spawn piece e verifica game over
  const spawnPiece = (piece: Tetromino) => {
    if (collides(piece, grid)) {
      setIsRunning(false)
      setGameOver(true)
    } else {
      setCurrent(piece)
    }
  }

  const moveDown = () => {
    const newPiece = { ...current, y: current.y + 1 }

    if (!collides(newPiece, grid)) {
      setCurrent(newPiece)
    } else {
      const mergedGrid = merge(grid, current)
      const fullRows = detectFullRows(mergedGrid)

      if (fullRows.length > 0) {
        setClearingRows(fullRows)
        setTimeout(() => {
          const newGrid = mergedGrid.filter((_, i) => !fullRows.includes(i))
          while (newGrid.length < 20) newGrid.unshift(Array(10).fill(0))
          setGrid(newGrid)
          setScore(prev => prev + fullRows.length * 100)
          setLinesCleared(prev => {
            const total = prev + fullRows.length
            const newLevel = Math.floor(total / 10) + 1
            setLevel(newLevel)
            return total
          })
          setClearingRows([])
          spawnPiece(next)
          setNext(randomTetromino())
        }, 300)
      } else {
        setGrid(mergedGrid)
        spawnPiece(next)
        setNext(randomTetromino())
      }
    }
  }

  const move = (dx: number) => {
    const newPiece = { ...current, x: current.x + dx }
    if (!collides(newPiece, grid)) {
      setCurrent(newPiece)
    }
  }

  const rotate = () => {
    const rotated = current.shape[0].map((_, i) =>
      current.shape.map(row => row[i]).reverse()
    )
    const newPiece = { ...current, shape: rotated }
    if (!collides(newPiece, grid)) {
      setCurrent(newPiece)
    }
  }

  const hardDrop = () => {
    let newPiece = deepClone(current)
    while (!collides({ ...newPiece, y: newPiece.y + 1 }, grid)) {
      newPiece.y += 1
    }

    const mergedGrid = merge(grid, newPiece)
    const fullRows = detectFullRows(mergedGrid)

    if (fullRows.length > 0) {
      setClearingRows(fullRows)
      setTimeout(() => {
        const newGrid = mergedGrid.filter((_, i) => !fullRows.includes(i))
        while (newGrid.length < 20) newGrid.unshift(Array(10).fill(0))
        setGrid(newGrid)
        setScore(prev => prev + fullRows.length * 100)
        setLinesCleared(prev => {
          const total = prev + fullRows.length
          const newLevel = Math.floor(total / 10) + 1
          setLevel(newLevel)
          return total
        })
        setClearingRows([])
        spawnPiece(next)
        setNext(randomTetromino())
      }, 300)
    } else {
      setGrid(mergedGrid)
      spawnPiece(next)
      setNext(randomTetromino())
    }
  }

  useEffect(() => {
    if (!isRunning) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      moveDown()
    }, dropSpeed)
    return () => clearInterval(intervalRef.current!)
  }, [current, isRunning, dropSpeed])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (!isRunning) return
      if (e.key === "ArrowLeft") move(-1)
      if (e.key === "ArrowRight") move(1)
      if (e.key === "ArrowDown") setIsFastDropping(true)
      if (e.key === "ArrowUp") rotate()
      if (e.key === " ") {
        e.preventDefault()
        hardDrop()
      }
    }

    const handleUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setIsFastDropping(false)
    }

    window.addEventListener("keydown", handle)
    window.addEventListener("keyup", handleUp)
    return () => {
      window.removeEventListener("keydown", handle)
      window.removeEventListener("keyup", handleUp)
    }
  }, [current, grid, isRunning])

  const displayGrid = merge(grid, current)

  return {
    grid: displayGrid,
    isRunning,
    setIsRunning,
    score,
    level,
    clearingRows,
    next,
    gameOver,
  }
}
