$('.heart1, .heart2, .heart3').hide();


let startCounter = 0;
$(window).keydown(function (e) {
  if (e.which === 32 && startCounter === 0) { loadGame(); $('.gameStart').hide(); startCounter++; }

});


let score;

function loadGame() {
  // Main variables
  let lives;
  let paused;
  const bricks = [];
  const keysPressed = {};
  const initialPaddleSpeed = 450;
  const initialBallSpeed = 320;
  const paddle = {};
  const ball = {};
  let gameBorders = loadGameBorders();
  let timeOfImpact = 0;

  $('.ball, .paddle, .score, .heart1, .heart2, .heart3').show();

  // Setup key listeners before starting the first game
  setupKeyListeners();

  startNewGame();

  // Reset starting variables etc
  function startNewGame() {
    new Audio('/audio/poweron.wav').play()
    $('.heart1').show();
    $('.heart2').show();
    $('.heart3').show();
    lives = 3;
    score = 0;
    paused = false;

    for (let i = bricks.length - 1; i >= 0; --i) {
      const brick = bricks[i];
      brick.$.remove();
      bricks.splice(i, 1);
    }

    resetBall();
    resetPaddle();
    spawnBricks();

    updateInterface();
    startInterval();
  }

  function updateGame(deltaTime) {
    if (paused) { return; }

    movePaddle(deltaTime);
    moveBall(deltaTime);
  }

  function movePaddle(deltaTime) {
    const direction = calculatePaddleDirection();
    const velocity = direction * paddle.speed * deltaTime;
    paddle.left += velocity;
    if (paddle.left < gameBorders.left) { paddle.left = 0; }
    if (paddle.left + paddle.width > gameBorders.width) { paddle.left = gameBorders.width - paddle.width; }
    paddle.$.css('left', paddle.left);
  }

  function moveBall(deltaTime) {
    ball.left += ball.direction.x * ball.speed * deltaTime;
    ball.top += ball.direction.y * ball.speed * deltaTime;

    if (!collisionDetectBallAndGame()) { return; }
    collisionDetectBallAndBricks();
    collisionDetectBallAndPaddle();

    ball.$.css('left', ball.left);
    ball.$.css('top', ball.top);
  }

  function calculatePaddleDirection() {
    let movementVelocity = 0;
    if (keysPressed.left) { --movementVelocity; }
    else if (keysPressed.right) { ++movementVelocity; }
    return movementVelocity;
  }

  function loseLife() {
    --lives;
    paused = true;
    $('.heart' + lives).hide();
    updateInterface();
    resetBall();
    resetPaddle();
  }

  function collisionDetectBallAndGame() {
    if (ball.left < gameBorders.left) {
      new Audio('/audio/ballhitsbrick.mp3').play()
      ball.left = 0;
      ball.direction.x *= -1;
    } else if (ball.left + ball.width > gameBorders.width) {
      new Audio('/audio/ballhitsbrick.mp3').play()
      ball.left = gameBorders.width - ball.width;
      ball.direction.x *= -1;
    }

    if (ball.top < gameBorders.top) {
      new Audio('/audio/ballhitsbrick.mp3').play()
      ball.top = 0;
      ball.direction.y *= -1;
    } else if (ball.top + ball.height > gameBorders.height) {
      new Audio('/audio/powerdown.wav').play()
      loseLife();
      return false;
    }
    return true;
  }

  function collisionDetectBallAndPaddle() {
    if (!isRectAOutsideRectB(ball, paddle)) {
      new Audio('/audio/ballhitspaddle.mp3').play()
      ball.direction.y *= -1;
      ball.top = paddle.top - ball.height;
      score += 5;
      ball.speed += 20;
      updateInterface();
    }
  }

  function collisionDetectBallAndBricks() {
    for (let i = bricks.length - 1; i >= 0; --i) {
      const brick = bricks[i];
      if (!isRectAOutsideRectB(ball, brick)) {
        new Audio('/audio/ballhitsbrick.mp3').play()
        let now = new Date();
        if (now - timeOfImpact > 5) {
          timeOfImpact = now;
          if (getHorizontalOrVerticalDirection(brick, ball) == 'horizontal') {
            // If it bounced on the side of the brick
            ball.direction.x *= -1;
          } else {
            // If it bounced above/below a brick
            ball.direction.y *= -1;
          }

          brick.$.remove();
          bricks.splice(i, 1);
          score += 20;
          updateInterface();
        }
      }
    }
    if (bricks.length == 0) {
      paused = true;
      updateInterface();
    }
  }

  // Assumes the properties: left, top, width, height
  function isRectAOutsideRectB(a, b) {
    if (a.left > b.left + b.width) return true; // to the right
    if (a.left + a.width < b.left) return true; // to the left
    if (a.top > b.top + b.height) return true; // below
    if (a.top + a.height < b.top) return true; // above
    return false;
  }

  // Does not work for rectangles, only squares
  function getHorizontalOrVerticalDirection(objA, objB) {
    // return 'vertical'; // Always return 'vertical' for non-square bricks
    // Todo: fix code for rectangle bricks
    const aY = objA.top + objA.height / 2;
    const aX = objA.left + objA.width / 2;
    const bY = objB.top + objB.height / 2;
    const bX = objB.left + objB.width / 2;
    const direction = Math.abs(Math.atan2(aY - bY, aX - bX));
    return (Math.abs(direction) < Math.PI / 4 || Math.abs(direction) > Math.PI / 4 * 3) ? 'horizontal' : 'vertical';
  }

  function updateInterface() {
    $('.score span').text((score + '').padStart(5, '0'));
    $('.main-text').hide();
    if (lives < 1) {
      $('.heart3').hide();
      highscoreName();
      $('.main-text').text('GAME OVER - PRESS ENTER TO PLAY AGAIN');
    } else if (!bricks.length) {
      new Audio('/audio/winner.wav').play()
      $('.main-text').text('CONGRATULATIONS - YOU WON');
    } else if (paused) {
      $('.main-text').text('PAUSED - press ENTER to continue...');
    } else {
      $('.main-text').text('');
    }
    $('.main-text').fadeIn(500);
  }

  function onEnterPress() {
    if (keysPressed.enter) { return; }
    keysPressed.enter = true;

    if (lives > 0) {
      paused = !paused;
    } else {
      startNewGame();
    }

    updateInterface();
  }



  function setupKeyListeners() {
    $(window).keydown(function (e) {
      if (e.which === 37) { keysPressed.left = true; }
      if (e.which === 39) { keysPressed.right = true; }
      if (e.which === 13) { onEnterPress(); }
    });

    $(window).keyup(function (e) {
      if (e.which === 37) { keysPressed.left = false; }
      if (e.which === 39) { keysPressed.right = false; }
      if (e.which === 13) { keysPressed.enter = false; }
    });
  }

  function loadGameBorders() {
    return {
      left: 0,
      top: 0,
      width: $('.game').width(),
      height: $('.game').height()
    };
  }

  function resetPaddle() {
    paddle.$ = $('.paddle');
    paddle.speed = initialPaddleSpeed;

    paddle.top = paddle.$.position().top;
    paddle.left = paddle.$.position().left;
    paddle.width = paddle.$.width();
    paddle.height = paddle.$.height();

    paddle.$.css('left', (paddle.left = gameBorders.width / 2 - paddle.width / 2));
  }

  function resetBall() {
    ball.$ = $('.ball');
    ball.speed = initialBallSpeed;
    ball.$.css('left', (ball.left = 425));
    ball.$.css('top', (ball.top = 545));
    ball.direction = { x: 1, y: 1 };

    ball.width = ball.$.width();
    ball.height = ball.$.height();
  }

  function spawnBricks() {
    const brickCSS = getBrickCSS('left', 'top', 'width', 'height');

    const colors = [
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
    ];

    let prevLeft = brickCSS.left;
    let size = '60px 25px';
    for (let color of colors) {
      const brick = createBrick(prevLeft, brickCSS.top, brickCSS.width, brickCSS.height, color, size);

      bricks.push(brick);
      $('.game').append(brick.$);

      prevLeft += brickCSS.width * 1;
    }

    const colorsUpThree = [
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
    ];

    let prevTopOverThree = brickCSS.top - brickCSS.height * 3;
    prevLeft = brickCSS.left;
    for (let color of colorsUpThree) {
      const brick = createBrick(prevLeft, prevTopOverThree, brickCSS.width, brickCSS.height, color, size);

      bricks.push(brick);
      $('.game').append(brick.$);

      prevLeft += brickCSS.width * 1;

    }

    const colorsUp = [
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
    ];

    let prevTopOver = brickCSS.top - brickCSS.height;
    prevLeft = brickCSS.left;
    for (let color of colorsUp) {
      const brick = createBrick(prevLeft, prevTopOver, brickCSS.width, brickCSS.height, color, size);

      bricks.push(brick);
      $('.game').append(brick.$);

      prevLeft += brickCSS.width * 1;

    }

    const colorsUpTwo = [
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
      'url("/images/brickblue.png")',
      'url("/images/brickred.png")',
      'url("/images/brickpurple.png")',
      'url("/images/brickdarkgreen.png")',
      'url("/images/brickyellow.png")',
    ];

    let prevTopOverTwo = brickCSS.top - brickCSS.height * 2;
    prevLeft = brickCSS.left;
    for (let color of colorsUpTwo) {
      const brick = createBrick(prevLeft, prevTopOverTwo, brickCSS.width, brickCSS.height, color, size);

      bricks.push(brick);
      $('.game').append(brick.$);

      prevLeft += brickCSS.width * 1;

    }

  }

  function createBrick(left, top, width, height, backgroundImage, backgroundSize) {
    const brick = $('<div class="brick">').css({ backgroundImage, backgroundSize, left, top });
    return {
      $: brick,
      left,
      top,
      width,
      height,
      backgroundImage,
      backgroundSize
    };
  }

  function getBrickCSS(...properties) {
    const tempBrick = $('<div class="brick">').appendTo('.game');
    const css = {}
    for (let prop of properties) {
      css[prop] = parseInt(tempBrick.css(prop));
    }
    tempBrick.remove();
    return css;
  }

  function startInterval() {
    const updateSpeed = 1; // lower = faster
    clearInterval(window.gameInterval);
    // Wait a short delay before starting to let the player prepare
    setTimeout(() => {
      let previousTime = performance.now() - updateSpeed;
      window.gameInterval = setInterval(() => {
        const now = performance.now();
        updateGame((now - previousTime) / 1000);
        previousTime = now;
      }, updateSpeed);
    }, 1000);
  }
}


// highscore
function highscoreName() {
  let player = prompt("Your score is:" + score + "\nEnter your name:");
  if (player === undefined || player === "") {
    player = "NoName";
  }
  postNewHighscore(player);
}



function postNewHighscore(player) {
  $.post("/add-score", {name: player, score: score}, function (responseData) {

   console.log('the new highscore-list is:', responseData);

  });  
}
