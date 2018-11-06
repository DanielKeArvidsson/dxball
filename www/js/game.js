
$('.heart1, .heart2, .heart3, .mobilButton, .gameOverButton, .gameOverText').hide();
/*
let startCounter = 0;
$(window).keydown(function (e) {
  if (e.which === 13 && startCounter === 0) { loadGame(); $('.playButton').hide(); $('.startGameText').hide(); startCounter++; }

});
*/

$('.playButton').click(function () {
  loadGame();
  $('.playButton').hide();
  $('.startGameText').hide();
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

  $('.score, .heart1, .heart2, .heart3').show();

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
    } else if (ball.left + ball.width > gameBorders.width + 10) {
      new Audio('/audio/ballhitsbrick.mp3').play()
      ball.left = gameBorders.width - ball.width;
      ball.direction.x *= -1;
    }

    if (ball.top < gameBorders.top) {
      new Audio('/audio/ballhitsbrick.mp3').play()
      ball.top = 0;
      ball.direction.y *= -1;
    } else if (ball.top + ball.height > gameBorders.height +10) {
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
      ball.direction.x = ((ball.left + ball.width / 2 - paddle.left) / paddle.width - 0.5) * 2; 
      ball.top = paddle.top - ball.height;
      score += 5;
      ball.speed += 30;
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
    return (Math.abs(direction) < Math.PI / 4 || Math.abs(direction) > Math.PI / 4 * 3) ? 'horizontal' : 'vertical';
  }




  function updateInterface() {
    $('.score span').text((score + '').padStart(5, '0'));
    $('.main-text').hide();
    if (lives < 1) {      
      $('.heart3').hide();
      if (window.matchMedia("(hover : none)").matches){
        $('.gameOverButton').show();
      }
      else {
      $('.gameOverText').show();
      }
        highscoreName();
      
      
    } else if (!bricks.length) {
      new Audio('/audio/winner.wav').play()
      $('.main-text').text('CONGRATULATIONS - YOU WON');

      
        highscoreName();
        $('#submit-new-score').on('click', function () {
          window.location.reload();
        });
    } else if (paused) {
      if (window.matchMedia("(hover : none)").matches) {
        $('.mobilButton').show();
      }
      else {
        $('.main-text').text('PAUSED - press ENTER to continue...');
      }
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
    $('.mobilButton').hide();
    $('.gameOverButton').hide();
    $('.gameOverText').hide();
    updateInterface();
  }

  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

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
    if (window.matchMedia("(min-width: 1200px)").matches) {
      ball.speed = initialBallSpeed;
      ball.$.css('left', (ball.left = 425));
      ball.$.css('top', (ball.top = 545));
    }
    else if (window.matchMedia("(max-width: 1200px) and (min-width: 993px)").matches) {
      ball.speed = 220;
      ball.$.css('left', (ball.left = 335));
      ball.$.css('top', (ball.top = 425));
    }
    else if (window.matchMedia("(max-width: 992px) and (min-width: 660px) and (orientation: portrait)").matches) {
      ball.speed = 500;
      ball.$.css('left', (ball.left = 355));
      ball.$.css('top', (ball.top = 1110));
    }
    else if (window.matchMedia("(max-width: 992px) and (min-width: 660px) and (orientation: landscape)").matches) {
      ball.speed = 180;
      ball.$.css('left', (ball.left = 290));
      ball.$.css('top', (ball.top = 370));
    }
    else if (window.matchMedia("(max-width: 659px)").matches) {
      ball.speed = 140;
      ball.$.css('left', (ball.left = 137));
      ball.$.css('top', (ball.top = 348));
    }

    else if (window.matchMedia("(max-width: 1200px) and (min-width: 993px)").matches) {
      ball.speed = 220;
      ball.$.css('left', (ball.left = 335));
      ball.$.css('top', (ball.top = 420));
    }
    else if (window.matchMedia("(max-width: 992px) and (min-width: 660px)").matches) {
      ball.speed = 140;
      ball.$.css('left', (ball.left = 240));
      ball.$.css('top', (ball.top = 335));
    }
    else if (window.matchMedia("(max-width: 659px)").matches) {
      ball.speed = 100;
      ball.$.css('left', (ball.left = 137));
      ball.$.css('top', (ball.top = 207));
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
  
  $.post("/add-score",
    {
      name: $('#recipient-name').val() || 'NoName',
      score: score
    }, appendHighscores)

    
  $('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
  });
  { $('body main > *').hide(); $('#footer-hide').show(); $('.highScoreBox').fadeIn(600); }
  window.history.pushState('',"highscore","/highscore");
});



function highscoreName() {
  $('#myModal').modal('show');
  $('#recipient-name').val('').trigger('focus');
  $('.endScore').text(score);
};




function appendHighscores(highscores) {

  $('tbody').empty();
  let i = 1;
  for (key in highscores) {
    let value = highscores[key];

    let table = "<tr><td>" + i + "</td><td>" + value.name + "</td><td>" + value.score + "</td></tr>";

    $('tbody').append(table);
    i++;
  }
}






