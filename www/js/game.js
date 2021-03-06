
$('.heart1, .heart2, .heart3, .mobilButton, .gameOverButton, .gameOverText, .powerup, .powerupTwo, .main-text').hide();

let playCounter = 0;

$('.playButton').click(function () {
  loadGame();
  $('.playButton').hide();
  $('.startGameText').hide();
  playCounter++;
});

$(window).keypress(function (e) {
  if (location.pathname !== "/breakout-gamePlay") { return; }
  if (e.which === 13 && playCounter === 0) {
    loadGame();
    $('.playButton').hide();
    $('.startGameText').hide();
    playCounter++;
  }
});

function showStartAgain(){
  $('.main-text').hide();
  if (window.matchMedia("(hover : none)").matches) {
    $('.gameOverButton').show();
  }
  else {
    $('.gameOverText').show();
  }
}

let score;

function loadGame() {
  // Main variables
  let lives;
  let paused;
  const bricks = [];
  const keysPressed = {};
  const initialPaddleSpeed = 450;
  const initialBallSpeed = 450;
  const paddle = {};
  const ball = {};
  let gameBorders = loadGameBorders();
  let timeOfImpact = 0;
  const powerup = {};
  const powerupTwo = {};
  let powerCount = 0;
  let powerCountTwo = 0;
  let powerRand;
  let powerRandBrickOne;
  //let powerRandBrickTwo;

  $('.score, .heart1, .heart2, .heart3').show();

  // Setup key listeners before starting the first game
  setupKeyListeners();

  startNewGame();

  // Reset starting variables etc
  function startNewGame() { 
    powerRand = Math.floor(Math.random() * Math.floor(gameBorders.width - 70));
    powerRandBrickTwo = Math.floor(Math.random() * 21) + 10;
    powerRandBrickOne = Math.floor(Math.random() * 20) + 31;
    new Audio('/audio/poweron.wav').play()
    $('.heart1').show();
    $('.heart2').show();
    $('.heart3').show();
    $('.powerup').stop(true).css({ 'top': 0, 'left': powerRand });
    powerCount = 0;
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

    movePower();
    movePowerTwo();
    movePaddle(deltaTime);
    moveBall(deltaTime);
  }

  function movePower() {
    powerup.top = $('.powerup').position().top;
    powerup.left = $('.powerup').position().left;
    powerup.height = $('.powerup').height();
    powerup.width = $('.powerup').width();
    if (bricks.length === powerRandBrickOne) {
      $('.powerup').show();
      $('.powerup').animate({ top: gameBorders.height }, { duration: 5000 });
    }
    if (!isRectAOutsideRectB(powerup, paddle) && powerCount === 0) {
      $('.powerup').hide();
      new Audio('/audio/powerup.wav').play()
      score += 400;
      powerCount++;
    }
    if (powerup.top > gameBorders.height - 10) {
      $('.powerup').hide();
    }
  }

  function movePowerTwo() {
    powerupTwo.top = $('.powerupTwo').position().top;
    powerupTwo.left = $('.powerupTwo').position().left;
    powerupTwo.height = $('.powerupTwo').height();
    powerupTwo.width = $('.powerupTwo').width();
    if (bricks.length === powerRandBrickTwo) {
      $('.powerupTwo').show();
      $('.powerupTwo').animate({ top: gameBorders.height }, { duration: 4000 });
    }
    if (!isRectAOutsideRectB(powerupTwo, paddle) && powerCountTwo === 0) {
      $('.powerupTwo').hide();
      new Audio('/audio/powerup.wav').play()
      score += 800;
      powerCountTwo++;
    }
    if (powerupTwo.top > gameBorders.height - 10) {
      $('.powerupTwo').hide();
    }
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
    } else if (ball.left + ball.width > gameBorders.width + 10) {
      new Audio('/audio/ballhitsbrick.mp3').play()
      ball.left = gameBorders.width - ball.width;
      ball.direction.x *= -1;
    }

    if (ball.top < gameBorders.top) {
      new Audio('/audio/ballhitsbrick.mp3').play()
      ball.top = 0;
      ball.direction.y *= -1;
    } else if (ball.top + ball.height > gameBorders.height + 10) {
      new Audio('/audio/powerdown.wav').play()
      loseLife();
      return false;
    }
    return true;
  }


  function collisionDetectBallAndPaddle() {
    if (!isRectAOutsideRectB(ball, paddle)) {
      new Audio('/audio/ballhitspaddle.mp3').play()
      let ballHitPad = (ball.left + ball.width / 2 - paddle.left) / paddle.width;
      if (ballHitPad < 1 / 5) {
        ball.direction.y = -0.5;
      }
      else if (ballHitPad >= 1 / 5 && ballHitPad < 2 / 5) {
        ball.direction.y = -0.8;
      }
      else if (ballHitPad >= 2 / 5 && ballHitPad < 3 / 5) {
        ball.direction.y = -0.9;
      }
      else if (ballHitPad >= 3 / 5 && ballHitPad < 4 / 5) {
        ball.direction.y = -0.8;
      }
      else if (ballHitPad >= 4 / 5) {
        ball.direction.y = -0.5;
      }
      //ball.direction.y *= -1;
      ball.direction.x = ((ball.left + ball.width / 2 - paddle.left) / paddle.width - 0.5) * 2;
      ball.top = paddle.top - ball.height;
      score += 5;
      ball.speed += 25;
      updateInterface();
    }
  }

  function collisionDetectBallAndBricks() {
    for (let i = bricks.length - 1; i >= 0; --i) {
      const brick = bricks[i];
      if (!isRectAOutsideRectB(ball, brick)) {
        new Audio('/audio/ballhitsbrick.mp3').play()
        let now = new Date();
        if (now - timeOfImpact > 10) {
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

          if (bricks.length == 0) {
            paused = true;
          }

          updateInterface();
        }
      }
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
    return (Math.abs(direction) < Math.PI / 4.4 || Math.abs(direction) > Math.PI / 4 * 3.4) ? 'horizontal' : 'vertical';
  }


  function updateInterface() {
    $('.score span').text((score + '').padStart(5, '0'));
    $('.main-text').hide();
    if (lives < 1) {
      $('.heart3').hide();
      
      highscoreName();
      $('#myModal').bind('keypress', function (e) {
        if (e.keyCode == 13) {
          $('#submit-new-score').trigger('click');
          window.location(false)
        }
      });

    } else if (!bricks.length) {
      new Audio('/audio/winner.wav').play();

      highscoreName();
      
      $('#myModal').bind('keypress', function (e) {
        if (e.keyCode == 13) {
          $('#submit-new-score').trigger('click');
        }
        $('#submit-new-score').on('click',function(){
          window.location.reload();
        })
      });

    } else if (paused) {
      if (window.matchMedia("(hover : none)").matches) {
        $('.mobilButton').show();
      }
      else {
        $('.main-text').show();
      }
    } else {
      $('.main-text').hide();
    }
    
  }


  function onEnterPress() {
    // Do nothing if a modal is open
    if (window.modalIsOpen) { return; }

    // Do nothing if not on /breakout-gamePlay page
    if (location.pathname !== "/breakout-gamePlay") { return; }
    
    if (keysPressed.enter) { return; }

    keysPressed.enter = true;

    if (lives > 0) {
      paused = !paused;
    } else {

      startNewGame();

    }
    $('.mobilButton').hide();
    $('.gameOverButton').hide();
    $('.gameOverText').hide();
    updateInterface();
  }

  if (window.matchMedia("(hover : none)").matches) {
    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
      };
  }

  $(".arrowright").on('touchstart', function () {
    keysPressed.right = true;
  });

  $(".arrowright").on('touchend', function () {
    keysPressed.right = false;
  });

  $(".arrowleft").on('touchstart', function () {
    keysPressed.left = true;
  });

  $(".arrowleft").on('touchend', function () {
    keysPressed.left = false;
  });

  function setupKeyListeners() {
    $(window).keydown(function (e) {
      if (e.which === 37) { keysPressed.left = true; }
      if (e.which === 39) { keysPressed.right = true; }
      if (e.which === 13) { onEnterPress() }
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
    if (window.matchMedia("(min-width: 1200px)").matches) {
      ball.speed = initialBallSpeed;
      ball.$.css('left', (ball.left = 425));
      ball.$.css('top', (ball.top = 545));
    }
    else if (window.matchMedia("(max-width: 1200px) and (min-width: 993px)").matches) {
      ball.speed = 320;
      ball.$.css('left', (ball.left = 335));
      ball.$.css('top', (ball.top = 425));
    }
    else if (window.matchMedia("(max-width: 992px) and (min-width: 660px) and (orientation: portrait)").matches) {
      ball.speed = 800;
      ball.$.css('left', (ball.left = 355));
      ball.$.css('top', (ball.top = 1110));
    }
    else if (window.matchMedia("(max-width: 992px) and (min-width: 660px) and (orientation: landscape)").matches) {
      ball.speed = 280;
      ball.$.css('left', (ball.left = 290));
      ball.$.css('top', (ball.top = 370));
    }
    else if (window.matchMedia("(max-width: 659px)").matches) {
      ball.speed = 180;
      ball.$.css('left', (ball.left = 137));
      ball.$.css('top', (ball.top = 348));
    }

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
    let size;
    if (window.matchMedia("(min-width: 1200px)").matches) {
      size = '60px 25px';
    }
    else if (window.matchMedia("(max-width: 1200px) and (min-width: 993px)").matches) {
      size = '48px 20px';
    }
    else if (window.matchMedia("(max-width: 992px) and (min-width: 660px) and (orientation: portrait)").matches) {
      size = '51px 50px';
    }
    else if (window.matchMedia("(max-width: 992px) and (min-width: 660px) and (orientation: landscape)").matches) {
      size = '42px 18px';
    }
    else if (window.matchMedia("(max-width: 659px)").matches) {
      size = '21px 18px';
    }
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
  $('.mobilButton').click(function () {
    if (lives > 0) {
      paused = false;
    } else {
      startNewGame();
    }
    $('.mobilButton').hide();
  });

  $('.gameOverButton').click(function () {

    startNewGame();

    $('.gameOverButton').hide();
  });

  
}

// highscore

$.getJSON("/json/highscore.json", appendHighscores);


$('#submit-new-score').on('click', function () {
  window.modalIsOpen = false;
  showStartAgain();

  $.post("/add-score",
    {
      name: $('#recipient-name').val() || 'NoName',
      score: score
    }, appendHighscores)



  /*$('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
  });*/
  $('#myModal').modal('hide');
  window.modalIsOpen = false;
  $('body main > *').hide(); $('#footer-hide').show(); $('.highScoreBox').fadeIn(600);
  window.history.pushState("", "", "/breakout-highscore");
});



function highscoreName() {
  window.modalIsOpen = true;
  $('#myModal').modal('show');
  $('#recipient-name').val('').trigger('focus');
  $('.endScore').text(score);
};


function appendHighscores(highscores) {
  window.modalIsOpen = false;
  $('tbody').empty();
  let i = 1;
  for (key in highscores) {
    let value = highscores[key];

    let table = "<tr><td>" + i + "</td><td>" + value.name + "</td><td>" + value.score + "</td></tr>";

    $('tbody').append(table);
    i++;
  }
}




