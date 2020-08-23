var canvas = {};
var context = {};
var grid = 8;
var allowedTime = 200;
var startX = 0;
var startY = 0;
var score = 0;
var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};
var count = 0;
var apple = {
  x: 320,
  y: 320
};

(function(window, document, undefined){
    window.onload = init;
    function init(){
        canvas = document.getElementById('game');
        context = canvas.getContext('2d');
        displayHighScore();
        displayScore();
    }
})(window, document, undefined);

function loop() {
    window.requestAnimationFrame(loop);
    if (++count < 4) {
        return;
    }
    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);
    snake.x += snake.dx;
    snake.y += snake.dy;
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
    snake.cells.unshift({x: snake.x, y: snake.y});
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {
        context.fillRect(cell.x, cell.y, grid-1, grid-1);
        if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
        score++;
        displayScore();
        }
        for (var i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            snake.x = 160;
            snake.y = 160;
            snake.cells = [];
            snake.maxCells = 4;
            snake.dx = grid;
            snake.dy = 0;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
            if (score>localStorage.getItem('highscore')) localStorage.setItem('highscore', score);
            score = 0;
            displayScore();
            displayHighScore();
        }
        }
    });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function onResetHighScore() {
    onRestart();
    localStorage.setItem('highscore', 0);
    displayScore();
    displayHighScore();
}

function onRestart() {
    score = 0;
    snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
    };
    count = 0;
    apple = {
    x: 320,
    y: 320
    };
    displayScore();
}

function selectSize() {
    onRestart();
    if (document.getElementById("board-size").value === 'large') {
        grid = 16;
        snake = {
            ...snake,
            dx: grid,
        };
    } else {
        grid = 8
        snake = {
            ...snake,
            dx: grid,
        };
    };
}

function displayScore() {
    const hun = score.toString()[score.toString().length-3]||'0';
    const ten = score.toString()[score.toString().length-2]||'0';
    const  one = score.toString()[score.toString().length-1]||'0';
    document.getElementById('score-hundreth').innerHTML = hun;
    document.getElementById('score-tenth').innerHTML = ten;
    document.getElementById('score-one').innerHTML = one;
}

function displayHighScore() {
    var highScore = localStorage.getItem('highscore');
    if (!highScore) localStorage.setItem('highscore', 0);
    const hun = highScore.toString()[highScore.toString().length-3]||'0';
    const ten = highScore.toString()[highScore.toString().length-2]||'0';
    const  one = highScore.toString()[highScore.toString().length-1]||'0';
    document.getElementById('high-score-hundreth').innerHTML = hun;
    document.getElementById('high-score-tenth').innerHTML = ten;
    document.getElementById('high-score-one').innerHTML = one;
}

document.addEventListener('touchstart', function(e){
    var touch = e.changedTouches[0]
    startX = touch.pageX
    startY = touch.pageY
    startTime = new Date().getTime()
    e.preventDefault()
}, false)

document.addEventListener('touchmove', function(e){
    e.preventDefault()
}, false)

document.addEventListener('touchend', function(e){
    var touch = e.changedTouches[0]
    distX = touch.pageX - startX
    distY = touch.pageY - startY

    if (Math.abs(distX) > Math.abs(distY)) {
      if (distX > 0 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
      }
      else if (distX < 0 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
      }
    } else {
      if (distY > 0 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
      }
      else if (distY < 0 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
      }
    }
    e.preventDefault();

}, false)

document.addEventListener('keydown', function(e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

window.requestAnimationFrame(loop);