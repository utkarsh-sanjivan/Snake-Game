var canvas = {};
var context = {};
var grid = 8;
var allowedTime = 200;
var miliseconds = 1;
var speedArray = [1, 25, 50, 75, 100];
var startX = 0;
var startY = 0;
var score = 0;
var paused = false;
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
    if (!paused) setTimeout(() =>window.requestAnimationFrame(loop), miliseconds);
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
            if (score>JSON.parse(localStorage.getItem('highscore'))[document.getElementById("board-speed").value]) saveHighScore(score);
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
    saveHighScore(0);
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
    displayHighScore();
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
    document.getElementById("board-speed").blur();
    document.getElementById('game').focus();
}

function selectSpeed() {
    onRestart();
    miliseconds = speedArray[parseInt(document.getElementById("board-speed").value)-1];
    document.getElementById("board-speed").blur();
    document.getElementById('game').focus();
}

function displayScore() {
    const hun = score.toString()[score.toString().length-3]||'0';
    const ten = score.toString()[score.toString().length-2]||'0';
    const  one = score.toString()[score.toString().length-1]||'0';
    document.getElementById('score-hundreth').innerHTML = hun;
    document.getElementById('score-tenth').innerHTML = ten;
    document.getElementById('score-one').innerHTML = one;
}

function saveHighScore(score) {
    var highScoreObj = JSON.parse(localStorage.getItem('highscore'));
    highScoreObj = {
        ...highScoreObj,
        [document.getElementById("board-speed").value]: score,
    }
    localStorage.setItem('highscore', JSON.stringify(highScoreObj));
}

function displayHighScore() {
    var highScoreObj = localStorage.getItem('highscore');
    if (!highScoreObj) localStorage.setItem('highscore', JSON.stringify({
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
    }));
    highScoreObj = localStorage.getItem('highscore');
    var highScore = JSON.parse(highScoreObj)[document.getElementById("board-speed").value];
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
    if (e.keyCode === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    else if (e.keyCode === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    else if (e.keyCode === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    else if (e.keyCode === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    } else if (e.keyCode === 27 || e.keyCode === 32) {
        paused = !paused;
        if (!paused) {
            window.requestAnimationFrame(loop);
        }
     }
});

window.requestAnimationFrame(loop);