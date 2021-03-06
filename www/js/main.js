$.getJSON('/json/mainSv.json', lang);
$.getJSON('/json/mainEn.json', Englang);


$('.engelska').on('click',function(){
  $('.sv').hide();
  $('.en').show();
});

$('.svenska').on('click',function(){
  $('.en').hide();
  $('.sv').show();
});

$('.nav-link').focus(function(){
  $(this).blur();
});

$('.navbar-toggler').focus(function(){
  $(this).blur();
});

function lang(myLang) {

  for (let key in myLang) {
    let swedish = myLang[key]["sv"]; {

      for (let swe of swedish) {

        //Navigation Swedish
        $(swe.hem).appendTo('.hem').addClass('sv');
        $(swe.history).appendTo('.navHistory').addClass('sv');
        $(swe.spelet).appendTo('.spelet').addClass('sv');
        $(swe.highscoreNav).appendTo('.highscore').addClass('sv');

        //body Swedish
        $(swe.startInfo).appendTo('.startText').addClass('sv');
        $(swe.theGame).appendTo('.about').addClass('sv');
        $(swe.gameOverText).appendTo('.gameOverText').addClass('sv');
        $(swe.gameOverButton).appendTo('.gameOverButton').addClass('sv');
        $(swe.mobilButton).appendTo('.mobilButton').addClass('sv');
        $(swe.playButton).appendTo('.playButton').addClass('sv');
        $(swe.mainText).appendTo('.main-text').addClass('sv');
        $(swe.highscoreName).appendTo('.highscoreName').addClass('sv');
        $(swe.highscoreScore).appendTo('.highscoreScore').addClass('sv');

        //footer swedish
        $(swe.adressP).appendTo('.adressP').addClass('sv');
        $(swe.phoneP).appendTo('.phoneP').addClass('sv');
        $(swe.emailP).appendTo('.emailP').addClass('sv');
      }
    }
  }
}


function Englang(myLang) {
  for (let key in myLang) {
    let english = myLang[key]["en"]; {

      for (let eng of english) {
        //Navigation English
        $(eng.home).appendTo('.hem').addClass('en');
        $(eng.history).appendTo('.navHistory').addClass('en');
        $(eng.spelet).appendTo('.spelet').addClass('en');
        $(eng.highscoreNav).appendTo('.highscore').addClass('en');


        //body English
        $(eng.startInfo).appendTo('.startText').addClass('en');
        $(eng.theGame).appendTo('.about').addClass('en');
        $(eng.gameOverText).appendTo('.gameOverText').addClass('en');
        $(eng.gameOverButton).appendTo('.gameOverButton').addClass('en');
        $(eng.mobilButton).appendTo('.mobilButton').addClass('en');
        $(eng.playButton).appendTo('.playButton').addClass('en');
        $(eng.mainText).appendTo('.main-text').addClass('en');
        $(eng.highscoreName).appendTo('.highscoreName').addClass('en');
        $(eng.highscoreScore).appendTo('.highscoreScore').addClass('en');

        //footer English
        $(eng.adressP).appendTo('.adressP').addClass('en');
        $(eng.phoneP).appendTo('.phoneP').addClass('en');
        $(eng.emailP).appendTo('.emailP').addClass('en');

      }
    }
  }
}
