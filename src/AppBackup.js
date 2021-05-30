import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Piece from './components/Piece'
import { useEffect, useState, useRef } from 'react';
import { generatePiece, getCoordinatesFromPattern, pieceQueueGenerator, piecePattern } from './tetrisUtils';


function App() {

  const stateRef = useRef();
  const [board, setBoard] = useState(new Array(21).fill('0000000000').fill('1111111111', 20))
  const [speed, setSpeed] = useState(1000)
  const [rendering, setRendering] = useState(0)
  const [lineCount, setLineCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [pieceQueue, setPieceQueue] = useState(pieceQueueGenerator())
  const [altPiece, setAltPiece] = useState(null)
  const [isDropped, setIsDropped] = useState(false)
  const [canChange, setCanChange] = useState(true)



  //State ref instanciation
  useEffect(() => {

    stateRef.current = {
      piece: { ...generatePiece(getCoordinatesFromPattern, pieceQueue[0]) },
      board: new Array(21).fill('0000000000').fill('1111111111', 20),
      baseBoard: new Array(21).fill('0000000000').fill('1111111111', 20),
    }
  }, [])


  function handleKeyUp(e) {
    if (e.code === 'ArrowDown') {
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
        if (stateRef.current.piece.parts.find((e) => e.x <= 0) || stateRef.current.piece.parts.find((e) => stateRef.current.baseBoard[e.y][e.x - 1] !== '0')) return
        stateRef.current.piece.parts.forEach(e => e.x = e.x - 1)
        stateRef.current.piece.global.x--
        setRendering((prev) => prev + 1)
        break;
      case 'ArrowRight':
        if (stateRef.current.piece.parts.find((e) => e.x >= 9) || stateRef.current.piece.parts.find((e) => stateRef.current.baseBoard[e.y][e.x + 1] !== '0')) return
        stateRef.current.piece.parts.forEach(e => e.x = e.x + 1)
        stateRef.current.piece.global.x++
        setRendering((prev) => prev + 1)
        break;
      case 'KeyW':
        {
          let newPattern = stateRef.current.piece.pattern.map((e, i) => stateRef.current.piece.pattern.map((el) => el[(el.length - 1) - i]).join(''));
          let coordinates = getCoordinatesFromPattern(newPattern, stateRef.current.piece.global.x, stateRef.current.piece.global.y)
          if (coordinates.find((e) => stateRef.current.baseBoard[e.y][e.x] !== '0')) return
          stateRef.current.piece.parts = coordinates
          stateRef.current.piece.pattern = newPattern
          setRendering((prev) => prev + 1)
        }
        break;

      case 'KeyQ':
        if (canChange) {
          setCanChange(false)
          if (altPiece != null) {
            stateRef.current.piece = { ...generatePiece(getCoordinatesFromPattern, altPiece) }
          }
          else {
            stateRef.current.piece = { ...generatePiece(getCoordinatesFromPattern, pieceQueue[1]) }
          }
          setRendering(prev => prev + 1)

          setAltPiece(pieceQueue[0])
        }
        break;

      case 'ArrowUp':
        {
          let newPattern = stateRef.current.piece.pattern.map((e, i) => stateRef.current.piece.pattern.map((el, y) => stateRef.current.piece.pattern[(stateRef.current.piece.pattern.length - 1) - y][i]).join(''));
          let coordinates = getCoordinatesFromPattern(newPattern, stateRef.current.piece.global.x, stateRef.current.piece.global.y)
          if (coordinates.find((e) => stateRef.current.baseBoard[e.y][e.x] !== '0')) return
          stateRef.current.piece.parts = coordinates
          stateRef.current.piece.pattern = newPattern
          setRendering((prev) => prev + 1)
        }
        break;
      default:
        break
    }
  }




  useEffect(() => {
    stateRef.current.board.forEach(e => {

    })
    return () => {

    }
  }, [lineCount])

  /* Controls  */
  useEffect(() => {
    if (!isRunning) return
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyDown)

    let interval = setInterval(() => {

      stateRef.current.baseBoard.forEach((e, i) => {
        if (e === 'xxxxxxxxxx') {
          stateRef.current.baseBoard.splice(i, 1)
          stateRef.current.baseBoard.unshift('0000000000')
        }
      })

      if (isDropped) {

        stateRef.current.piece = { ...generatePiece(getCoordinatesFromPattern, pieceQueue[1]) }
        setIsDropped(false)
        setSpeed(1000)
        setPieceQueue(prev => {
          let curr = [...prev];
          curr.push(Math.floor(Math.random() * 7));
          curr.shift()
          return curr
        })
      }

      if (stateRef.current.piece.parts.find((e) => e.y >= 19) || stateRef.current.piece.parts.find((e) => stateRef.current.baseBoard[e.y + 1][e.x] !== '0')) {
        setCanChange(true)
        stateRef.current.board.forEach((e, i) => {
          if (!e.includes('0') && i !== 20) {
            setSpeed(300)
            stateRef.current.board[i] = 'xxxxxxxxxx'
            setLineCount(prev => prev + 1)
          }
        })
        setIsDropped(true)
        stateRef.current.baseBoard = [...stateRef.current.board]
        setBoard([...stateRef.current.baseBoard])
      }
      else {
        stateRef.current.piece.parts.forEach(e => e.y = e.y + 1)
        stateRef.current.piece.global.y++
        setRendering((prev) => prev + 1)
      }
    }, speed)

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    }
  }, [speed, isRunning, pieceQueue, isDropped, canChange])


  // render  
  useEffect(() => {

    let currBoard = [...stateRef.current.baseBoard]
    let ghostPiece = [...stateRef.current.piece.parts.map(e => ({ ...e }))]

    while (!ghostPiece.find((e) => currBoard[e.y + 1][e.x] !== '0')) {
      ghostPiece = [...ghostPiece.map((e) => ({ ...e, y: e.y + 1 }))]
    }

    ghostPiece.forEach((e, i) => {
      let cell = currBoard[e.y].split('')
      cell[e.x] = stateRef.current.piece.class.toUpperCase()
      currBoard[e.y] = cell.join('')
    })
    stateRef.current.piece.parts.forEach((e, i) => {
      let cell = currBoard[e.y].split('')
      cell[e.x] = stateRef.current.piece.class
      currBoard[e.y] = cell.join('')
    })

    stateRef.current.board = [...currBoard]
    setBoard([...currBoard])


  }, [rendering])


  return (
    <div className="app">

      <div className="side">
        <Piece piece={piecePattern[altPiece]} />
        <p className="infos">Score: {lineCount}</p>
      </div>

      <div className="board">
        {
          isRunning ? 
          board.map((cell, i) => i !== 20 && (
            <div key={uuidv4()} className={`row ${cell}`}>
  
              {
                cell.split('').map((e) => e === '0' ? <div key={uuidv4()} className={`cell`}></div> : <div key={uuidv4()} className={`${e}-block`}></div>)
              }
  
            </div>
          )) :
          <button onClick={() => setIsRunning(true)} className="starter">Click to Start</button>
        }
        
        
      </div>

      <div className="side">
        <Piece piece={piecePattern[pieceQueue[1]]} />
        <Piece piece={piecePattern[pieceQueue[2]]} />
      </div>

    </div>
  );
}

export default App;