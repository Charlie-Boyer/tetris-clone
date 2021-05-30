import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Piece from './components/Piece'
import { useEffect, useState, useRef } from 'react';
import { generatePiece, getCoordinatesFromPattern, piecePattern } from './tetrisUtils';


function App() {



  const stateRef = useRef();
  const [board, setBoard] = useState(new Array(22).fill('0000000000').fill('1111111111', 21))
  const [lineCount, setLineCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [next, setNext] = useState(null)
  const [hold, setHold] = useState(null)



  /* Controls  */
  useEffect(() => {

    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyDown)

    let prevFrame
    let gravity = 0
    let isDropped = false
    let boost = 1
    let pieceBag = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5)
    let pieceQueue
    let canChange = true
    let altPiece = null
    let level = 1

    randomPiece()

    stateRef.current = {
      piece: { ...generatePiece(pieceQueue[0]) },
      board: new Array(22).fill('0000000000').fill('1111111111', 21),
      baseBoard: new Array(22).fill('0000000000').fill('1111111111', 21),
    }

    requestAnimationFrame(frame)


    function randomPiece() {
      let newPiece
      if (pieceBag.length === 1) {
        newPiece = pieceBag[0]
        pieceBag = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5)
      }
      else {
        newPiece = pieceBag.shift()
      }
      setNext(pieceBag[0])
      pieceQueue = [newPiece, pieceBag[0]]
    }

    function handleKeyDown(e) {

      switch (e.code) {
        case 'ArrowDown':
          if (!e.repeat) {
            boost = 20
          }
          break;

        case 'ArrowLeft':
          if (stateRef.current.piece.parts.find((e) => e.x <= 0) || stateRef.current.piece.parts.find((e) => stateRef.current.baseBoard[e.y][e.x - 1] !== '0')) return
          stateRef.current.piece.parts.forEach(e => e.x = e.x - 1)
          stateRef.current.piece.global.x--
          break;
        case 'ArrowRight':
          if (stateRef.current.piece.parts.find((e) => e.x >= 9) || stateRef.current.piece.parts.find((e) => stateRef.current.baseBoard[e.y][e.x + 1] !== '0')) return
          stateRef.current.piece.parts.forEach(e => e.x = e.x + 1)
          stateRef.current.piece.global.x++
          break;
        case 'KeyW':
          {
            let newPattern = stateRef.current.piece.pattern.map((e, i) => stateRef.current.piece.pattern.map((el) => el[(el.length - 1) - i]).join(''));
            let coordinates = getCoordinatesFromPattern(newPattern, stateRef.current.piece.global.x, stateRef.current.piece.global.y)
            if (coordinates.find((e) => stateRef.current.baseBoard[e.y][e.x] !== '0')) return
            stateRef.current.piece.parts = coordinates
            stateRef.current.piece.pattern = newPattern
          }
          break;

        case 'KeyQ':
          if (canChange) {
            canChange = false
            if (altPiece != null) {
              stateRef.current.piece = { ...generatePiece(altPiece) }
              altPiece = pieceQueue[0]
              setHold(pieceQueue[0])
            }
            else {
              stateRef.current.piece = { ...generatePiece(pieceQueue[1]) }
              altPiece = pieceQueue[0]
              setHold(pieceQueue[0])
              randomPiece()
            }
          }
          break;

        case 'ArrowUp':
          {
            let newPattern = stateRef.current.piece.pattern.map((e, i) => stateRef.current.piece.pattern.map((el, y) => stateRef.current.piece.pattern[(stateRef.current.piece.pattern.length - 1) - y][i]).join(''));
            let coordinates = getCoordinatesFromPattern(newPattern, stateRef.current.piece.global.x, stateRef.current.piece.global.y)
            if (coordinates.find((e) => stateRef.current.baseBoard[e.y][e.x] !== '0')) return
            stateRef.current.piece.parts = coordinates
            stateRef.current.piece.pattern = newPattern

          }
          break;
        default:
          break
      }
    }

    function handleKeyUp(e) {
      if (e.code === 'ArrowDown') {
        boost = 1
      }
    }

    function frame(timestamp) {

      let delta = (timestamp - prevFrame) / 1e3 || 0

      gravity += delta * boost 
      prevFrame = timestamp

      if (gravity > 1) {
        stateRef.current.baseBoard.forEach((e, i) => {
          if (e === 'xxxxxxxxxx') {
            stateRef.current.baseBoard.splice(i, 1)
            stateRef.current.baseBoard.unshift('0000000000')
          }
        })

        if (isDropped) {
          randomPiece()
          stateRef.current.piece = { ...generatePiece(pieceQueue[0]) }
          render()
          isDropped = false
        }

        if (stateRef.current.piece.parts.find((e) => e.y >= 20) || stateRef.current.piece.parts.find((e) => stateRef.current.baseBoard[e.y + 1][e.x] !== '0')) {
          canChange = true
          stateRef.current.board.forEach((e, i) => {
            if (!e.includes('0') && i !== 21) {
              stateRef.current.board[i] = 'xxxxxxxxxx'
              setLineCount(prev => prev + 1)
              level++
            }
          })
          isDropped = true
          stateRef.current.baseBoard = [...stateRef.current.board]
          setBoard([...stateRef.current.baseBoard])
        }
        else {
          stateRef.current.piece.parts.forEach(e => e.y = e.y + 1)
          stateRef.current.piece.global.y++
        }
        gravity = 0
      }
      render()
      requestAnimationFrame(frame)
    }

    function render() {

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
    }

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(frame)
    }
  }, [])


  return (
    <div className="app">

      <div className="side">
        <p className="infos">Hold</p>
        <Piece piece={piecePattern[hold]} />
        <p className="infos">Lines: {lineCount}</p>
      </div>
      <div className="board">
        {
          board.map((cell, i) => i !== 21 && i !== 0 && (
            <div key={uuidv4()} className={`row ${cell}`}>
              {
                cell.split('').map((e) => e === '0' ? <div key={uuidv4()} className={`cell`}></div> : <div key={uuidv4()} className={`${e}-block`}></div>)
              }

            </div>
          ))
        }
      </div>
      <div className="side">
        <p className="infos">Next</p>
        <Piece piece={piecePattern[next]} />
      </div>

    </div>
  );
}

export default App;