const canvas = document.getElementById('canvas')
const canvasContext = canvas.getContext('2d')
const pacmanFrames = document.getElementById('animations')
const ghostFrames = document.getElementById('ghosts')

let createRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color
  canvasContext.fillRect(x, y, width, height)
}
let fps = 30
let oneBlockSize = 20
let wallColor = '#342DCA'
let wallSpaceWidth = oneBlockSize / 1.5
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2
let wallInnerColor = 'black'
let foodColor = '#FEB897'
let score = 0
let ghosts = []
let ghostCount = 4
let lifes = 3
let foodCount = 0

const DIRECTION_RIGHT = 4
const DIRECTION_UP = 3
const DIRECTION_LEFT = 2
const DIRECTION_DOWN = 1

let ghostsLocations = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 }
]

const INITIAL_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

let getMap = () => {
  return JSON.parse(JSON.stringify(INITIAL_MAP))
}

let map = getMap()

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[0].length; j++) {
    if (map[i][j] == 2) {
      foodCount++
    }
  }
}

let randomTargetsForGhosts = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
  { x: (map.length - 2) * oneBlockSize, y: oneBlockSize },
  { x: (map.length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize }
]

let createNewPacMan = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5
  )
}

let gameLoop = () => {
  draw()
  update()
}

let update = () => {
  pacman.moveProcess()
  pacman.eat()
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess()
  }

  if (pacman.checkGhostCollision()) {
    console.log('hit')
    restartGame()
  }

  if (score >= foodCount) {
    drawGameWin()
    clearInterval(gameInterval)
  }
}

let restartGame = () => {
  createNewPacMan()
  createGhosts()
  draw()

  lifes--
  if (lifes == 0) {
    gameOver()
  }
}

let gameOver = () => {
  clearInterval(gameInterval)
  drawGameOver()
  gameLoop()

  startGame()
}

let drawGameOver = () => {
  canvasContext.font = '40px Emulogic'
  canvasContext.fillStyle = 'white'
  canvasContext.fillText('Game Over!', 140, 200)
}

let drawGameWin = () => {
  canvasContext.font = '40px Emulogic'
  canvasContext.fillStyle = 'white'
  canvasContext.fillText('Win!', 140, 200)
}
let drawLifes = () => {
  canvasContext.font = '20px Emulogic'
  canvasContext.fillStyle = 'white'
  canvasContext.fillText('Lifes: ', 200, oneBlockSize * (map.length + 1) + 10)
  for (let i = 0; i < lifes; i++) {
    canvasContext.drawImage(
      pacmanFrames,
      2 * oneBlockSize,
      0,
      oneBlockSize,
      oneBlockSize,
      350 + i * oneBlockSize,
      oneBlockSize * map.length + 10,
      oneBlockSize,
      oneBlockSize
    )
  }
}

let drawFoods = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        createRect(
          j * oneBlockSize + oneBlockSize / 3,
          i * oneBlockSize + oneBlockSize / 3,
          oneBlockSize / 3,
          oneBlockSize / 3,
          foodColor
        )
      }
    }
  }
}

let drawScore = () => {
  canvasContext.font = '30px Emulogic'
  canvasContext.fillStyle = 'white'
  canvasContext.fillText(
    'Score:' + score,
    0,
    oneBlockSize * (map.length + 1) + 5
  )
}

let drawGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].draw()
  }
}

let draw = () => {
  createRect(0, 0, canvas.width, canvas.height, 'black')
  drawWalls()
  drawFoods()
  pacman.draw()
  drawScore()
  drawGhosts()
  drawLifes()
}

let drawWalls = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 1) {
        // thein it a wall
        createRect(
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          wallColor
        )
        if (j > 0 && map[i][j - 1] == 1) {
          createRect(
            j * oneBlockSize,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth + wallOffset,
            wallSpaceWidth,
            wallInnerColor
          )
        }
        if (j < map[0].length - 1 && map[i][j + 1] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth + wallOffset,
            wallSpaceWidth,
            wallInnerColor
          )
        }
        if (i > 0 && map[i - 1][j] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize,
            wallSpaceWidth,
            wallSpaceWidth + wallOffset,
            wallInnerColor
          )
        }
        if (i < map.length - 1 && map[i + 1][j] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth,
            wallSpaceWidth + wallOffset,
            wallInnerColor
          )
        }
      }
    }
  }
}

let createGhosts = () => {
  ghosts = []
  for (let i = 0; i < ghostCount; i++) {
    let newGhost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostsLocations[i % 4].x,
      ghostsLocations[i % 4].y,
      124,
      116,
      6 + i
    )
    ghosts.push(newGhost)
  }
}

let gameInterval

let startGame = () => {
  map = getMap()
  createNewPacMan()
  createGhosts()
  gameLoop()
  gameInterval = setInterval(gameLoop, 1000 / fps)
}

startGame()

window.addEventListener('keydown', event => {
  let k = event.keyCode

  setTimeout(() => {
    if (k == 37 || k == 65) {
      // LEFT
      pacman.nextDirection = DIRECTION_LEFT
    } else if (k == 38 || k == 87) {
      // UP
      pacman.nextDirection = DIRECTION_UP
    } else if (k == 39 || k == 68) {
      // RIGHT
      pacman.nextDirection = DIRECTION_RIGHT
    } else if (k == 40 || k == 83) {
      // DOWN
      pacman.nextDirection = DIRECTION_DOWN
    }
  }, 1)
})

// function loaded() {
//   dialog('Press N to Start')

//   document.addEventListener('keydown', keyDown, true)

//   timer = window.setInterval(mainLoop, 1000 / Pacman.FPS)
// }

// loaded()

// function keyDown(e) {
//   if (e.keyCode === KEY.N) {
//     gameLoop()
//   }
// }

// keyDown()
// resetar ou criar o settimeout para conseguir usar o teclado novamente
// usar state
// escolher a saida mais facil e me matar
//
