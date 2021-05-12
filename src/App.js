import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useEffect, useState, useReducer, useCallback } from 'react';


function App() {

  const [board, setBoard] = useState(new Array(20).fill('0000000000'))
  const [baseBoard, setBaseBoard] = useState(new Array(20).fill('0000000000'))
  const [emptyBoard, setEmptyBoard] = useState(new Array(20).fill('0000000000'))
  const [speed, setSpeed] = useState(1000)

  String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
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

  function initialState() {
    let myInitialPiece = {
      pattern: ['010', '111', '000'],
      global: { x: 0, y: 0 },
      parts: [{ x: 0, y: 0 }]
    }
    let parts = []
    myInitialPiece.pattern.forEach((e, i) => {
      e.split('').map((el, il) => {
        if (el == 1) {
          parts.push({ x: myInitialPiece.global.x + il, y: myInitialPiece.global.y + i })
        }
      })
    })

    myInitialPiece.parts = parts
    return myInitialPiece
  }

  function pieceGenerator(array) {
    return array[Math.floor(Math.random() * 7)]
  }

  const [piece, setPiece] = useReducer(pieceReducer, initialState())



  function handleKeyUp(e) {
    if (e.code == 'ArrowDown') {
      setSpeed(1000)
    }
  }

  function patternReducer(state, action) {
    switch (action.type) {
      case 'rotate':
        return state.map((e, i) => state.map((el) => el[(el.length - 1) - i]).join(''));
      case 'rotate2':
        return state.map((e, i) => state.map((el, y) => state[(state.length - 1) - y][i]).join(''));
      // case 'reset':
      //   return pieceGenerator(piecePattern);
      default:
        throw new Error();
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
      default:
        break;
    }
  }


  /* delete lines  */



  /* Render  */
  useEffect(() => {
    let currBoard = [...baseBoard]


    if (piece.parts.find(e => e.y == 19) || piece.parts.find(e => currBoard[e.y + 1][e.x] == 1)) {
      setBaseBoard(currBoard)
      setPiece({ type: 'reset' })
    }
    console.log(piece.pattern)
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
    <div className="app">
      {board.map((cell) => (
        <div key={uuidv4()} className="row">
          {cell.split('').map((e) => <div key={uuidv4()} className={`cell state${e}`}></div>)}
        </div>
      ))}
    </div>
  );
}

export default App;