import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [board, setBoard] = useState(new Array(20).fill('0000000000'))
  const [piece, setPiece] = useState(newPiece)
  const [baseBoard, setBaseBoard] = useState(new Array(20).fill('0000000000'))
  const [isLanded, setIsLanded] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [hasLines, setHasLines] = useState(0)

  function newPiece() {
    let key = Math.floor(Math.random() * 5)
    switch (key) {
      case 0:
        return [
          { x: 4, y: 0 },
          { x: 4, y: 1 },
          { x: 5, y: 0 },
          { x: 3, y: 1 }
        ]
      case 1:
        return [
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 4, y: 1 },
          { x: 5, y: 1 }
        ]
      case 2:
        return [
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 3, y: 0 },
          { x: 3, y: 1 }
        ]
      case 3:
        return [
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 3, y: 0 },
          { x: 4, y: 1 }
        ]
      case 4:
        return [
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 3, y: 0 },
          { x: 2, y: 0 }
        ]
      default:
        break;
    }
  }

  function handleKeyDown(e) {

    const currBoard = [...baseBoard]

    // rotation counter clockwise
    if (e.code == "Space") {
      const currPiece = [...piece]
      const newPiece = [...piece]

      for (let i = 0; i < currPiece.length; i++) {

        // rotation center
        if (i == 0) {
          continue
        }

        // parts to rotate
        let x = currPiece[0].x + (currPiece[i].y - currPiece[0].y)
        let y = currPiece[0].y - (currPiece[i].x - currPiece[0].x)
        newPiece[i].x = x
        newPiece[i].y = y
      }
      setPiece(currPiece)
    }

    if (e.code == "ArrowDown") {
    
      setSpeed(50)
    }

    if (e.code == "ArrowLeft") {


      const currPiece = [...piece]

      if (!currPiece.find(e => e.x == 0)) {
        currPiece.forEach((e) => {
          e.x--
        })
      }

      setPiece(currPiece)
    }

    if (e.code == "ArrowRight") {
      const currPiece = [...piece]

      if (!currPiece.find(e => e.x == 9)) {
        currPiece.forEach((e) => {
          e.x++
        })
      }
      setPiece(currPiece)
    }
  }

  function handleKeyUp() {
    setSpeed(1000)
  }

  /* delete lines  */ 
  useEffect(() => {

    console.log('has lines')
    const currBoard = [...baseBoard]
    const tempBoard = [...currBoard]
    currBoard.forEach((e, i) => {
      if(e == '1111111111') {
        tempBoard.splice(i, 1, '2222222222')
      }

      if(e == '2222222222') {
        tempBoard.splice(i, 1)
        tempBoard.unshift('0000000000')
      }

    })
 
    setBaseBoard(tempBoard)
    setIsLanded(false)
  
  }, [hasLines])


  /* Render  */ 
  useEffect(() => {

    const currBoard = [...baseBoard]

   
    if(currBoard.includes('1111111111') || currBoard.includes('2222222222') ) {
      setHasLines(hasLines + 1)
    }
  
    
    if (piece.find(e => e.y >= 19) || piece.find(e => currBoard[e.y][e.x] == 1)) {

      setPiece(newPiece)
      setBaseBoard(board)
      setIsLanded(true)
    }
    else {
      setIsLanded(false)
      piece.forEach((e) => {
        let cell = currBoard[e.y].split('')
        cell[e.x] = 1
        currBoard[e.y] = cell.join('')
      })
  
      setBoard(currBoard)

    }

  }, [piece])

  /* Controls  */ 
  useEffect(() => {

    const currBoard = [...baseBoard]
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    let interval = null
    if (!isLanded) {

      interval = setInterval(() => {
        const currPiece = [...piece]
        currPiece.forEach((e) => {
          e.y++
        })

        setPiece(currPiece)
      }, speed)

    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleKeyUp);
    }

  }, [isLanded, speed])


  return (
    <div className="app">
      {board.map((cell) => (
        <div className="row">
          {cell.split('').map((e) => <div className={`cell state${e}`}></div>)}
        </div>
      ))}
    </div>
  );
}

export default App;