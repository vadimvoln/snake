var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var grid = 16;
var count = 0;
var score = 0;
var max = 0;

var snake = {
  x: 160,
  y: 160,

  // гибкость змеи
  dx: grid,
  dy: 0,

  // подсчёт поглощенных клеток
  cells: [],

  // длинна змеи, растет когда ест
  maxCells: 2,
};
var food = {
  x: 320,
  y: 320,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
  requestAnimationFrame(loop);
  // замедление игры на 15 фпс
  if (++count < 20) {
    return;
  }
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  // передвижение согласно гибкости
  snake.x += snake.dx;
  snake.y += snake.dy;
  // скрываем змею при уходе за край по горизонтали
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // скрываем змею при уходе за край по вертикали
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // отслеживаем положение змеи. начало массива всегда голова
  snake.cells.unshift({
    x: snake.x,
    y: snake.y
  });
  // убираем клетки когда проходим через них
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // отрисовываем еду
  context.fillStyle = "white";
  context.fillRect(food.x, food.y, grid - 1, grid - 1);
  context.fillStyle = "#E43F5A";
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    // змея съедает клетку
    if (cell.x === food.x && cell.y === food.y) {
      snake.maxCells++;
      score += 1;
      document.getElementById("score").innerHTML = "&nbsp;" + score;
      food.x = getRandomInt(0, 25) * grid;
      food.y = getRandomInt(0, 25) * grid;
    }
    for (var i = index + 1; i < snake.cells.length; i++) {
      // змея врезается в себя, перезапускаем игру
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        if (score > max) {
          max = score;
        }
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        score = 0;
        food.x = getRandomInt(0, 25) * grid;
        food.y = getRandomInt(0, 25) * grid;
        document.getElementById("high").innerHTML = "&nbsp;" + max;
      }
    }
  });
}
// слушаем кнопки для передвижения
document.addEventListener("keydown", function (e) {

  // левая стрелка
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // стрелка вверх
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // правая стрелка
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // стрелка вниз
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
// запускаем игру
requestAnimationFrame(loop);