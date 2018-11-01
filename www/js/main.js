
$.getJSON('/json/mainSv.json', lang);
$.getJSON('/json/mainEn.json', Englang);



$('.engelska').on('click',function(){
$('.sv').hide();
$('.en').show();
$("#name").attr("placeholder", "Your name");
$("#email").attr("placeholder", "Your E-mail");
$("#comments").attr("placeholder", "Write something fun");
$(".knapp").html("Submit");
});

$('.svenska').on('click',function(){
    $('.en').hide();
    $('.sv').show();
    $("#name").attr("placeholder", "Ditt namn");
    $("#email").attr("placeholder", "Din E-mail");
    $("#comments").attr("placeholder", "Skriv något kul");
    $(".knapp").html("Skicka");
    });
    


function lang(myLang)  {

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
        $(swe.kontakt).appendTo('.kortTitel').addClass('sv');
      
        

        
        //footer swedish
        $(swe.adressH5).appendTo('.adressH5').addClass('sv');
        $(swe.adressP).appendTo('.adressP').addClass('sv');
        $(swe.phoneH5).appendTo('.phoneH5').addClass('sv');
        $(swe.phoneP).appendTo('.phoneP').addClass('sv');
        $(swe.emailH5).appendTo('.emailH5').addClass('sv');
        $(swe.emailP).appendTo('.emailP').addClass('sv');
      }
    }
  }
}


function Englang(myLang){
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
      $(eng.kontakt).appendTo('.kortTitel').addClass('en');
      
      //footer English
      $(eng.adressH5).appendTo('.adressH5').addClass('en');
      $(eng.adressP).appendTo('.adressP').addClass('en');
      $(eng.phoneH5).appendTo('.phoneH5').addClass('en');
      $(eng.phoneP).appendTo('.phoneP').addClass('en');
      $(eng.emailH5).appendTo('.emailH5').addClass('en');
      $(eng.emailP).appendTo('.emailP').addClass('en');
  
      }
    }
  }
  
}
$(document).on('click', '.normal', function(){
  $(".paddle").css("width", "200px");
});
$(document).on('click', '.hard', function(){
  $(".paddle").css("width", "100px");
});