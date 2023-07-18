document.addEventListener('DOMContentLoaded', () => {
const width = 10;
let grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const displayScore = document.querySelector('#score');

const startButton = document.querySelector('#start-button');
let nextRandom = 0;
let score = 0;
let timer = 500;
let timerId;
let colors = [
  'blue',
  'orange',
  'purple',
  'yellow',
  'cyan'
]

const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]
  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]
  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]
  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]
  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const tetrominos = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];

  let currentPosition = 4;
  let currentRotation = Math.floor(Math.random()*3)
  let random = Math.floor(Math.random()*tetrominos.length)
  let current = tetrominos[random][currentRotation];


  startButton.addEventListener('click', () => {
    displayScore.innerHTML = "SCORE:" + score;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    else {
      Draw()
      timerId = setInterval(moveDown, timer);
      document.addEventListener('keyup', control);
      DrawNext();    
    }
  })

  function Draw() {
    current.forEach(item => {
        squares[currentPosition + item].classList.add('tetromino');
        squares[currentPosition + item].style.backgroundColor = colors[random];
    })
  }

  function unDraw() {
    current.forEach(item => {
        squares[currentPosition + item].classList.remove('tetromino');
        squares[currentPosition + item].style.backgroundColor = '';
    })
  }

  function control(e) {
    if (e.keyCode === 37) {
        moveLeft()
    }
    if (e.keyCode === 40) {
        moveDown()
    }
    if (e.keyCode === 39) {
        moveRight()
    }
    if (e.keyCode === 38) {
        rotateTetromino()
    }
  }

  function moveDown() {
    unDraw()
    currentPosition+= width;
    Draw()
    freeze()
   
  }

  function freeze() {
    if (current.some(item => squares[currentPosition + item + width].classList.contains('taken'))) {
        current.forEach(item => squares[currentPosition + item].classList.add('taken'))
        random = Math.floor(Math.random()*tetrominos.length);
        current = tetrominos[random][currentRotation];
        currentPosition = 4;
        Draw();
        DrawNext();
        deleteRow();
        gameOver();
    }
  }

  function moveLeft() {
    unDraw()
    const isAtLeft = current.some(item => (currentPosition + item) % width === 0);
    if (!isAtLeft) {
        currentPosition -= 1;
    }
    if (current.some(item => squares[currentPosition + item].classList.contains('taken'))) {
        currentPosition += 1;
    }
    Draw()
  }

  function moveRight() {
    unDraw()
    const isAtRight = current.some(item => (currentPosition + item) % width === width - 1);
    if (!isAtRight) {
        currentPosition += 1;
    }
    if (current.some(item => squares[currentPosition + item].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    Draw()
    }

  function rotateTetromino() {
        unDraw();
        if(current.some(item => (currentPosition + item) % width === 9))
        {
          console.log("wall")
        }
        currentRotation += 1;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        
        current = tetrominos[random][currentRotation];
        Draw()
  }

  const smallGrid = Array.from(document.querySelectorAll('.mini-grid div'));
  const displayGrid = 4;
  let displayIndex = 0;


  const gridTetrominos = [
    [1, displayGrid+1, displayGrid*2+1, 2],
    [0,displayGrid,displayGrid+1,displayGrid*2+1],
    [1,displayGrid,displayGrid+1,displayGrid+2],
    [0,1,displayGrid,displayGrid+1],
    [displayGrid,displayGrid+1,displayGrid+2,displayGrid+3]
  ] 

 

  function DrawNext() {
    smallGrid.forEach(item => {
      item.classList.remove('tetromino');
      item.style.backgroundColor = '';
    })
    gridTetrominos[random].forEach(item => {
      smallGrid[displayIndex + item].classList.add('tetromino')
      smallGrid[displayIndex + item].style.backgroundColor = colors[random];
    })
    ;
  }

  function deleteRow() {
    for (let i = 0; i < 199; i += width) {
      let row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        displayScore.innerHTML = "SCORE:" + score;
        row.forEach(item => {
          squares[item].classList.remove('taken');
          squares[item].classList.remove('tetromino');
          squares[item].style.backgroundColor = ''
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
        
        
      }
    }
  }

  function gameOver() {
   if(current.some(item => squares[currentPosition + item].classList.contains('taken'))) {
    displayScore.innerHTML = 'End'
    clearInterval(timerId);
   }
  }
})

  

