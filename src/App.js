import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useEffect, useState, useReducer, useRef } from 'react';


function App() {

  const boardRef = useRef();
  const [board, setBoard] = useState(new Array(21).fill('0000000000').fill('1111111111', 20))
  const [baseBoard, setBaseBoard] = useState(new Array(21).fill('0000000000').fill('1111111111', 20))
  const [speed, setSpeed] = useState(1000)
  const initialPiece = [{ x: 0, y: 0 }, { x: 1, y: 0 }]
  const [piece, setPiece] = useReducer(pieceReducer, initialState())


  function getCoordinatesFromPattern(pattern, x, y) {
    let coordinates = []
    pattern.forEach((e, i) => {
      e.split('').map((el, il) => {
        if (el == 2) {
          coordinates.push({ x: x + il, y: y + i })
        }
      })
    })
    return coordinates
  }


  function initialState() {

    function pieceGenerator(array) {
      return array[Math.floor(Math.random() * 7)]
    }



    const pattern = [
      ['0000', '0220', '0220', '0000'],
      ['0000', '2222', '0000', '0000'],
      ['002', '222', '000'],
      ['200', '222', '000'],
      ['022', '220', '000'],
      ['220', '022', '000'],
      ['020', '222', '000']
    ]

    let newPiece = {
      pattern: pieceGenerator(pattern),
      global: { x: 0, y: 0 },
      parts: [{ x: 0, y: 0 }]
    }

    newPiece.pattern = pieceGenerator(pattern)
    newPiece.global = { x: 3, y: 0 }
    newPiece.parts = getCoordinatesFromPattern(
      newPiece.pattern,
      newPiece.global.x,
      newPiece.global.y
    )
    return newPiece
  }

  function pieceReducer(state, action) {
    switch (action.type) {
      case 'down':
        return {
          ...state,
          global: { ...state.global, y: state.global.y++ },
          parts: state.parts.map((e) => ({ ...e, y: e.y++ }))
        };
      case 'right':
        return {
          ...state,
          global: { ...state.global, x: state.global.x++ },
          parts: state.parts.map((e) => ({ ...e, x: e.x++ }))
        };
      case 'left':
        return {
          ...state,
          global: { ...state.global, x: state.global.x-- },
          parts: state.parts.map((e) => ({ ...e, x: e.x-- }))
        };
      case 'rotate':
        return {
          ...state,
          pattern: [...action.data.newPattern],
          parts: [...action.data.coordinates]
        };
      case 'reset':
        return initialState()
      default:
        break;
    }
  }


  /* Controls  */
  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyDown)


    let interval = setInterval(() => {
      if (boardRef.current.piece.parts.find((e) => boardRef.current.board[e.y + 1][e.x] == 1   )) {


        let currBoard = [...boardRef.current.board.map((e) => e.replace(/2/g, 1))]

        currBoard.forEach((e, i) => {
          if (e == '1111111111' && i != 20) {
            currBoard.splice(i, 1)
            currBoard.unshift('0000000000')
          }
        })
        setBaseBoard([...currBoard])
        setPiece({ type: 'reset' })
      }
      else {
        setPiece({ type: 'down' })


      }
    }, speed)

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
          if (boardRef.current.piece.parts.find((e) => e.x == 0) || boardRef.current.piece.parts.find((e) => boardRef.current.board[e.y][e.x - 1] == 1)) {
            return
          } else {
            setPiece({ type: 'left' })
          }
          break
        case 'ArrowRight':
          if (boardRef.current.piece.parts.find((e) => e.x == 9) || boardRef.current.piece.parts.find((e) => boardRef.current.board[e.y][e.x + 1] == 1)) {
            return
          } else {
            setPiece({ type: 'right' })
          }
          break;
        case 'KeyW':
          let newPattern = boardRef.current.piece.pattern.map((e, i) => boardRef.current.piece.pattern.map((el) => el[(el.length - 1) - i]).join(''));
          let coordinates = getCoordinatesFromPattern(newPattern, boardRef.current.piece.global.x, boardRef.current.piece.global.y)

          function checkEdges(newCoordinates) {
            let finalCoordinates = [...newCoordinates]
            let range = 1
            while (finalCoordinates.find((e) => e.x > 9) && range < 3) {
              finalCoordinates = [...newCoordinates.map((e) => ({ ...e, x: e.x - range }))]
              range++
            }
            while (finalCoordinates.find((e) => e.x < 0) && range < 3) {
              finalCoordinates = [...newCoordinates.map((e) => ({ ...e, x: e.x + range }))]
              range++
            }

            if (finalCoordinates.find((e) => e.x > 9) || finalCoordinates.find((e) => e.x < 0)) {
              return false
            }
            else {
              return finalCoordinates
            }
          }


          console.log(checkEdges(coordinates))

          // while (tempCoordinates.find((e) => e.x < 0)) {
          //   tempCoordinates = [...coordinates.map((e) => ({ ...e, x: e.x + 1 }))]
          // }

          // let key = 0
          // while (coordinates.find((e) => boardRef.current.board[e.y][e.x] == 1)) {

          //   switch (key) {
          //     case 0:
          //       coordinates = [...coordinates.map((e) => ({ ...e, x: e.x + 1 }))]
          //       break;
          //     case 1:
          //       coordinates = [...coordinates.map((e) => ({ ...e, x: e.x - 2 }))]
          //       break;
          //     case 1:
          //       coordinates = [...coordinates.map((e) => ({ ...e, x: e.x + 3 }))]
          //       break;
          //     case 1:
          //       coordinates = [...coordinates.map((e) => ({ ...e, x: e.x - 4 }))]
          //       break;

          //     default:
          //       break;
          //   }
          // }

          if (checkEdges(coordinates)) {
            setPiece({ type: 'rotate', data: { newPattern, coordinates: checkEdges(coordinates) } })

          }
      }
    }


    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    }
  }, [speed])

  // render  
  useEffect(() => {
    let currBoard = [...baseBoard]
    let shadowPiece = [...piece.parts.map(e => ({...e}))]

    while( !shadowPiece.find((e) => currBoard[e.y + 1][e.x] == 1 )  ) {
      shadowPiece = [...shadowPiece.map((e) => ({ ...e, y: e.y + 1 }))]
    }
    
    shadowPiece.forEach((e, i) => {
      let cell = currBoard[e.y].split('')
      cell[e.x] = 3
      currBoard[e.y] = cell.join('') 
    })
    piece.parts.forEach((e, i) => {
      let cell = currBoard[e.y].split('')
      cell[e.x] = 2
      currBoard[e.y] = cell.join('') 
    })

    


    setBoard([...currBoard])


    //referencing state
    boardRef.current = {
      piece: { ...piece },
      board: [...currBoard]
    }
  }, [piece])


  return (
    <div>
      <p className="infos">lignes:</p>
      <div className="board">
        {board.map((cell, i) => i != 20 && (
          <div key={uuidv4()} className="row">
            {cell.split('').map((e) => <div key={uuidv4()} className={`cell state${e}`}></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;