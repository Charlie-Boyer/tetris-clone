let myarray = [
  {x: 1, y: 6},
  {x: 2, y: 6},
  {x: 3, y: 6},
  {x: 4, y: 6}
]


let temp = []
myarray.forEach((e) => {
  temp.push(e.x)  
})
console.log(Math.max(...temp))