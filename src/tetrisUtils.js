
  function generatePiece(createFromPattern) {

    function randomizer(array) {
      return array[Math.floor(Math.random() * 7)]
    }

    const pattern = [
      ['0000', '0oo0', '0oo0', '0000'],
      ['0000', 'iiii', '0000', '0000'],
      ['00l', 'lll', '000'],
      ['j00', 'jjj', '000'],
      ['0ss', 'ss0', '000'],
      ['zz0', '0zz', '000'],
      ['0t0', 'ttt', '000']
    ]

    let newPiece = {
      pattern: randomizer(pattern),
      global: { x: 0, y: 0 },
      parts: [{ x: 0, y: 0 }]
    }

    newPiece.class = [...newPiece.pattern.join('')].find(e => e != 0)
    newPiece.global = { x: 3, y: 0 }
    newPiece.parts = createFromPattern(
      newPiece.pattern,
      newPiece.global.x,
      newPiece.global.y
    )
    return newPiece
  }

  function getCoordinatesFromPattern(pattern, x, y) {
    let coordinates = []
    pattern.forEach((e, i) => {
      e.split('').map((el, il) => {
        if (el != 0) {
          coordinates.push({ x: x + il, y: y + i })
        }
      })
    })
    return coordinates
  }

  export { generatePiece, getCoordinatesFromPattern }
