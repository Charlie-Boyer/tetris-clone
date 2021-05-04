import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [board, setBoard] = useState(new Array(20).fill('0000000000'))
  const [baseBoard, setBaseBoard] = useState(new Array(20).fill('0000000000'))

  function newPiece() {
    let key = Math.floor(Math.random() * 4)
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

  const [piece, setPiece] = useState(newPiece)



  useEffect(() => {
    const interval = setInterval(() => {

      const currPiece = [...piece]
      currPiece.forEach((e) => {
        e.y++
      })

      setPiece(currPiece)

    }, 1000);
    return () => clearInterval(interval);
  }, [baseBoard]);






  useEffect(() => {

    const currBoard = [...baseBoard]

    if (piece.find(e => e.y >= 20) || piece.find(e => currBoard[e.y][e.x] == 1) ) {
      setBaseBoard(board)
      setPiece(newPiece)

    }

    else {
      piece.forEach((e) => {
        let cell = currBoard[e.y].split('')
        cell[e.x] = 1
        currBoard[e.y] = cell.join('')
      })
      setBoard(currBoard)
    }


  }, [piece])









  useEffect(() => {

    function handleKeyDown(e) {


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
        const currPiece = [...piece]
        currPiece.forEach((e) => {
          e.y++
        })

        setPiece(currPiece)
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
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [piece]);





  return (
    <div className="app">
      {board.map((cell) => (
        <div className="row">
          {cell.split('').map((e) => <div className={e == 1 ? "cell on" : "cell"}></div>)}
        </div>
      ))}
    </div>
  );
}

export default App;