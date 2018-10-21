
// Main variables
let lives = 3;
let score = 0;
let paused = false;
let $ballX = $('.ballX');
let $ballY = $('.ballY');
let $paddle = $('.paddle');
let paddleStep = 80;
let currentKey;
let gameMode = false;


// Read keys
$(window).keydown(function (e) {
  if (e.which === 37 && !paused) { currentKey = 'left'; }
  if (e.which === 39 && !paused) { currentKey = 'right'; }
  if (e.which === 72 && gameMode) { playAgainHard(); }
  if (e.which === 78 && gameMode) { playAgainNormal(); }
  if (e.which === 80 && !gameMode) { pauseGame(); }
});

$(window).keyup(function () {
  currentKey = '';
});

$ballX.remove();
paused = true;
$('.gameStart').show();
gameMode = true;

// Game loop
setInterval(function () {

  // paddle movement
  let paddleX = $paddle.position().left;
  if (currentKey == 'left' && paddleX > 0) {
    let step = Math.min(paddleStep, paddleX);
    $paddle.animate({ left: paddleX - step }, 100);
  }
  if (currentKey == 'right' && paddleX < $('.game').width() - $paddle.outerWidth()) {
    let step = Math.min(paddleStep, $('.game').width() - $paddle.outerWidth() - paddleX)
    $paddle.animate({ left: paddleX + step }, 100);
  }

  // Check for hits and misses
  let x = $ballX.position().left;
  let y = $ballY.position().top;
  if (y >= $('.game').height() - $ballY.height() - 20) {
    let paddleX1 = $paddle.position().left;
    let paddleX2 = paddleX1 + $paddle.outerWidth();
    if (paddleX1 - $ballY.width() <= x && paddleX2 + $ballY.width() >= x && !paused) {
      // the player caught the ball with the paddle
      score += 10;
      $('.score span').text((score + '').padStart(5, '0'));
    }
    else if (!paused) {
      // the player missed
      paused = true;
      $ballX.addClass('ball-paused');
      $ballY.addClass('ball-paused');
      $('.heart' + lives).hide();
      lives--;
      
      // if there are lives left continue after a second
      if (lives > 0) {
        setTimeout(function () {
          restartBallAnimation();
          paused = false;
        }, 100);
      }
      else {
        $('.game-over').fadeIn(1000);
        $ballX.remove();
        gameMode = true;        
      }
    }
  }
}, 100);

// Restart ball animation from top left
// by cloning the ball
function restartBallAnimation() {
  let $oldBall = $ballX;
  $ballX = $ballX.clone().appendTo('.game');
  $oldBall.remove();
  $ballY = $('.ballY');
  $('.ball-paused').removeClass('ball-paused');
}

// Play again - reset variables and play again
function playAgainHard() {
  $(".ballY").css("animation", "ball-animation-vertical 4s linear infinite alternate");
  $(".paddle").css("width", "100px");
  $(".paddle").css("background-image", "url('/images/paddlesmall.png')");
  lives = 3;
  score = 0;
  $('.score span').text('00000');  
  paused = false;
  $('.game-over').hide();
  gameMode = false;
  $('.gameStart').hide();
  $('.heart1,.heart2,.heart3').show();
  restartBallAnimation();
}

function playAgainNormal() {
  $(".ballY").css("animation", "ball-animation-vertical 5s linear infinite alternate");
  $(".paddle").css("width", "200px");
  $(".paddle").css("background-image", "url('/images/paddle.png')");
  lives = 3;
  score = 0;
  $('.score span').text('00000');  
  paused = false;
  $('.game-over').hide();
  gameMode = false;
  $('.gameStart').hide();
  $('.heart1,.heart2,.heart3').show();
  restartBallAnimation();
}

function pauseGame() {
  if(!paused) {
    $ballX.addClass('ball-paused');
    $ballY.addClass('ball-paused');
    $('.pausedGame').show();
    paused = true;
  }
  else{
    $('.ball-paused').removeClass('ball-paused');
    $('.pausedGame').hide();
    paused = false;
  }
}


