import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import { generatePiece, getCoordinatesFromPattern } from './tetrisUtils';


function App() {

  const boardRef = useRef();
  const [board, setBoard] = useState(new Array(21).fill('0000000000').fill('1111111111', 20))
  const [speed, setSpeed] = useState(1000)
  const [rendering, setRendering] = useState(0)
  const [lineCount, setLineCount] = useState(0)

  function handleKeyUp(e) {
    if (e.code == 'ArrowDown') {
      setSpeed(1000)
    }
  }

  function handleKeyDown(e) {

    switch (e.code) {
      case 'ArrowDown':
        if (!e.repeat) {
          setSpeed(50)
        }
        break;

      case 'ArrowLeft':
        if (boardRef.current.piece.parts.find((e) => e.x <= 0) || boardRef.current.piece.parts.find((e) => boardRef.current.baseBoard[e.y][e.x - 1] != 0)) return
        boardRef.current.piece.parts.forEach(e => e.x = e.x - 1)
        boardRef.current.piece.global.x--
        setRendering((prev) => prev + 1)
        break;
      case 'ArrowRight':
        if (boardRef.current.piece.parts.find((e) => e.x >= 9) || boardRef.current.piece.parts.find((e) => boardRef.current.baseBoard[e.y][e.x + 1] != 0)) return
        boardRef.current.piece.parts.forEach(e => e.x = e.x + 1)
        boardRef.current.piece.global.x++
        setRendering((prev) => prev + 1)
        break;
      case 'KeyW':
        {
          let newPattern = boardRef.current.piece.pattern.map((e, i) => boardRef.current.piece.pattern.map((el) => el[(el.length - 1) - i]).join(''));
          let coordinates = getCoordinatesFromPattern(newPattern, boardRef.current.piece.global.x, boardRef.current.piece.global.y)
          if (coordinates.find((e) => boardRef.current.baseBoard[e.y][e.x] != 0)) return
          boardRef.current.piece.parts = coordinates
          boardRef.current.piece.pattern = newPattern
          setRendering((prev) => prev + 1)
        }
        break;

      case 'ArrowUp':
        {
          let newPattern = boardRef.current.piece.pattern.map((e, i) => boardRef.current.piece.pattern.map((el, y) => boardRef.current.piece.pattern[(boardRef.current.piece.pattern.length - 1) - y][i]).join(''));
          let coordinates = getCoordinatesFromPattern(newPattern, boardRef.current.piece.global.x, boardRef.current.piece.global.y)
          if (coordinates.find((e) => boardRef.current.baseBoard[e.y][e.x] != 0)) return
          boardRef.current.piece.parts = coordinates
          boardRef.current.piece.pattern = newPattern
          setRendering((prev) => prev + 1)
        }
        break;
    }
  }

  //State ref instanciation
  useEffect(() => {
    boardRef.current = {
      piece: { ...generatePiece(getCoordinatesFromPattern) },
      board: new Array(21).fill('0000000000').fill('1111111111', 20),
      baseBoard: new Array(21).fill('0000000000').fill('1111111111', 20)
    }
  }, [])


  useEffect(() => {
    boardRef.current.board.forEach(e => {

    })
    return () => {

    }
  }, [lineCount])

  /* Controls  */
  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyDown)

    let interval = setInterval(() => {

      boardRef.current.baseBoard.forEach((e, i) => {
        if(e == 'xxxxxxxxxx') {
          boardRef.current.baseBoard.splice(i, 1)
          boardRef.current.baseBoard.unshift('0000000000')
        }
      })

      if (boardRef.current.piece.down) {
        boardRef.current.piece = { ...generatePiece(getCoordinatesFromPattern) }
        boardRef.current.piece.down = false
      }

      if (boardRef.current.piece.parts.find((e) => e.y >= 19) || boardRef.current.piece.parts.find((e) => boardRef.current.baseBoard[e.y + 1][e.x] != 0)) {

        boardRef.current.board.forEach((e, i) => {
          if (!e.includes('0') && i != 20) {
            boardRef.current.board[i] = 'xxxxxxxxxx'
            setLineCount(prev => prev + 1)
          }
        })
        boardRef.current.piece.down = true
        boardRef.current.baseBoard = [...boardRef.current.board]
        setBoard([...boardRef.current.baseBoard])
        // setRendering((prev) => prev + 1)
      }
      else {
        boardRef.current.piece.parts.forEach(e => e.y = e.y + 1)
        boardRef.current.piece.global.y++
        setRendering((prev) => prev + 1)
      }
    }, speed)

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    }
  }, [speed])


  // render  
  useEffect(() => {

    let currBoard = [...boardRef.current.baseBoard]
    let ghostPiece = [...boardRef.current.piece.parts.map(e => ({ ...e }))]

    while (!ghostPiece.find((e) => currBoard[e.y + 1][e.x] != 0)) {
      ghostPiece = [...ghostPiece.map((e) => ({ ...e, y: e.y + 1 }))]
    }

    ghostPiece.forEach((e, i) => {
      let cell = currBoard[e.y].split('')
      cell[e.x] = boardRef.current.piece.class.toUpperCase()
      currBoard[e.y] = cell.join('')
    })
    boardRef.current.piece.parts.forEach((e, i) => {
      let cell = currBoard[e.y].split('')
      cell[e.x] = boardRef.current.piece.class
      currBoard[e.y] = cell.join('')
    })

    boardRef.current.board = [...currBoard]
    setBoard([...currBoard])


  }, [rendering])


  return (
    <div className="app">
      <span className="infos">Score: {lineCount}</span>
      <div className="board">
        {board.map((cell, i) => i != 20 && (
          <div key={uuidv4()} className={`row ${cell}`}>
            {cell.split('').map((e) => <div key={uuidv4()} className={`cell ${e}-block`}></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;