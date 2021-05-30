const piecePattern = [
  ['0oo0', '0oo0'],
  ['0000', 'iiii', '0000', '0000'],
  ['00l', 'lll', '000'],
  ['j00', 'jjj', '000'],
  ['0ss', 'ss0', '000'],
  ['zz0', '0zz', '000'],
  ['0t0', 'ttt', '000']
]



function generatePiece(index) {

  let newPiece = {}

  newPiece.pattern = piecePattern[index]
  newPiece.class = [...newPiece.pattern.join('')].find(e => e !== '0')
  newPiece.global = { x: 3, y: 0 }
  let x = 0
  console.log(newPiece.global)
  
  newPiece.parts = getCoordinatesFromPattern(piecePattern[index],3 ,0)
  return newPiece
}

function getCoordinatesFromPattern(pattern, x, y) {
  let coordinates = []

  pattern.forEach((e, i) => {
    e.split('').forEach((el, il) => {
      if (el !== '0') {
        coordinates.push({ x: x + il, y: y + i })
      }
    })
  })
  return coordinates
}


export { generatePiece, getCoordinatesFromPattern, piecePattern }
