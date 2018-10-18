$.getJSON('/json/mainSv.json', lang);
$.getJSON('/json/mainEn.json', engLang);


function lang(myLang) {

  for (let key in myLang) {
    let swedish = myLang[key]["sv"]; {

      for (let swe of swedish) {
        console.log(swe)
      }
    }
  }
}

function engLang(myLang) {
  for (let key in myLang) {
    let english = myLang[key]["en"]; {

      for (let eng of english) {
        console.log(eng)
      }
    }
  }
}