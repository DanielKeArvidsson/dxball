
$.getJSON('/json/mainSv.json', lang);
$.getJSON('/json/mainEn.json', Englang);


$('.showGame').hide();



function lang(myLang)  {

  for (let key in myLang) {
    let swedish = myLang[key]["sv"]; {

      for (let swe of swedish) {

        //Navigation Swedish
        $(swe.hem).appendTo('.hem');
        $(swe.history).appendTo('.navHistory')
        $(swe.spelet).appendTo('.spelet');


        //body Swedish
        $(swe.theGame).appendTo('.about');

        
        //footer swedish
        $(swe.adressH5).appendTo('.adressH5');
        $(swe.adressP).appendTo('.adressP');
        $(swe.phoneH5).appendTo('.phoneH5');
        $(swe.phoneP).appendTo('.phoneP');
        $(swe.emailH5).appendTo('.emailH5');
        $(swe.emailP).appendTo('.emailP');
      }
    }
  }
}


function Englang(myLang){
  for (let key in myLang) {
    let english = myLang[key]["en"]; {

      for (let eng of english) {
      //Navigation English
      $(eng.home).appendTo('.hem');
      $(eng.history).appendTo('.navHistory')
      $(eng.spelet).appendTo('.spelet');


      //body English
      $(eng.theGame).appendTo('.about');

      
      //footer English
      $(eng.adressH5).appendTo('.adressH5');
      $(eng.adressP).appendTo('.adressP');
      $(eng.phoneH5).appendTo('.phoneH5');
      $(eng.phoneP).appendTo('.phoneP');
      $(eng.emailH5).appendTo('.emailH5');
      $(eng.emailP).appendTo('.emailP');
  
      }
    }
  }
  
}

