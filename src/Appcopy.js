import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useEffect, useState, useReducer } from 'react';


function App() {

  const [board, setBoard] = useState(new Array(20).fill('0000000000'))
  const [baseBoard, setBaseBoard] = useState(new Array(20).fill('0000000000'))
  const [hasLines, setHasLines] = useState(0)
  const [speed, setSpeed] = useState(1000)
  const [isLanded, setIsLanded] = useState(false)
  const [piece, setPiece] = useReducer(pieceReducer, initialState())

  function getCoordinatesFromPattern(pattern, x, y) {
    let coordinates = []
    pattern.forEach((e, i) => {
      e.split('').map((el, il) => {
        if (el == 1) {
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
      ['0000', '0110', '0110', '0000'],
      ['0000', '1111', '0000', '0000'],
      ['001', '111', '000'],
      ['100', '111', '000'],
      ['011', '110', '000'],
      ['110', '011', '000'],
      ['010', '111', '000']
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



  function handleKeyUp(e) {
    if (e.code == 'ArrowDown') {
      setSpeed(1000)
    }
  }

  function pieceReducer(state, action) {
    let myPiece = [], newPattern
    switch (action.type) {
      case 'right':
        if (state.parts.find(e => e.x == 9)) {
          return { ...state }
        }
        return {
          ...state,
          global: { ...state.global, x: state.global.x++ },
          parts: state.parts.map((e) => ({ ...e, x: e.x++ }))
        };
      case 'left':
        if (state.parts.find(e => e.x == 0)) {
          return { ...state }
        }
        return {
          ...state,
          global: { ...state.global, x: state.global.x-- },
          parts: state.parts.map((e) => ({ ...e, x: e.x-- }))
        };
      case 'down':
        if (state.parts.find(e => e.y == 19)) {
          return { ...state }
        }
        return {
          ...state,
          global: { ...state.global, y: state.global.y++ },
          parts: state.parts.map((e) => ({ ...e, y: e.y++ }))
        };
      case 'rotate':
        newPattern = state.pattern.map((e, i) => state.pattern.map((el) => el[(el.length - 1) - i]).join(''));
        newPattern.forEach((e, i) => {
          e.split('').map((el, il) => {
            if (el == 1) {
              myPiece.push({ x: state.global.x + il, y: state.global.y + i })
            }
          })
        })
        return {
          ...state,
          pattern: newPattern,
          parts: myPiece
        }
      case 'rotate2':
        newPattern = state.pattern.map((e, i) => state.pattern.map((el, y) => state.pattern[(state.pattern.length - 1) - y][i]).join(''));
        newPattern.forEach((e, i) => {
          e.split('').map((el, il) => {
            if (el == 1) {
              myPiece.push({ x: state.global.x + il, y: state.global.y + i })
            }
          })
        })
        return {
          ...state,
          pattern: newPattern,
          parts: myPiece
        }
      case 'reset':
        return initialState();
      default:
        throw new Error();
    }
  }

  function handleKeyDown(e) {
    switch (e.code) {
      case 'ArrowLeft':
        setPiece({ type: 'left' })
        break;
      case 'ArrowRight':
        setPiece({ type: 'right' })
        break;
      case 'ArrowDown':
        if (!e.repeat) {
          setSpeed(50)
        }
        break;
      case 'ArrowUp':
        setPiece({ type: 'rotate2' })
        break;
      case 'KeyW':
        if (!e.repeat) {
          setPiece({ type: 'rotate' })
        }
        break;
    }
  }

  /* delete lines  */
  useEffect(() => {

    console.log('has lines: ', hasLines)

    const currBoard = [...baseBoard]

    board.forEach((e, i) => {
      if (e == '1111111111') {
        currBoard.splice(i, 1)
        currBoard.unshift('0000000000')
      }
    })

    setBaseBoard(currBoard)
    setIsLanded(false)

  }, [hasLines])

  /* Render  */
  useEffect(() => {
    let currBoard = [...baseBoard]
    let count = 0
    currBoard.forEach(e => {
      if (e == '1111111111') {
        count++
      }
    })

    setHasLines(hasLines + count)

    
    if (piece.parts.find(e => e.y + 1 == 19) || piece.parts.find(e => currBoard[e.y + 1][e.x] == 1)) {
      setBaseBoard(currBoard)
      setPiece({ type: 'reset' })
    }

    piece.parts.forEach((e, i) => {
      let cell = currBoard[e.y].split('')
      cell[e.x] = 1
      currBoard[e.y] = cell.join('')
    })
    setBoard(currBoard)


  }, [piece])

  /* Controls  */
  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyDown)
    let interval = setInterval(() => {
      setPiece({ type: 'down' })
    }, speed)
    return () => {
      clearInterval(interval);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [speed])


  return (
    <div>
      <p className="infos">lignes: {hasLines}</p>
      <div className="board">
        {board.map((cell) => (
          <div key={uuidv4()} className="row">
            {cell.split('').map((e) => <div key={uuidv4()} className={`cell state${e}`}></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;