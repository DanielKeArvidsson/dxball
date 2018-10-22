// For details: https://diveinto.html5doctor.com/history.html
 
// Clicks on links
$(document).on('click', 'a', function(e){
    // assume all links starting with '/' are internal
    let link = $(this).attr('href');
    if(link.indexOf('/') === 0){
      e.preventDefault(); // no hard reload of page
      history.pushState(null, null, link); // change url (no reload)
      frontendRouter(link); // tell the router
    }
  });
   
  // Listen to back/forward
  window.addEventListener("popstate", () => {
    frontendRouter(location.pathname);
  });
   
  // On page load
  frontendRouter(location.pathname);
  
  
   
  // The router (do whatever you want here)
  function frontendRouter(path){
      
    let routes = {
      '/': () => { $('body main > *').hide();$('#footer-hide').show(); $('.home').fadeIn(800); },
      '/history': () => { $('body main > *').hide();$('#footer-hide').show(); $('.history').fadeIn(600); },
      '/gamePlay': () => { $('body main > *').hide();$('#footer-hide').hide(); $('.gamePlay').fadeIn(600);},
      '/contact-us': () => { $('body main > *').hide(); $('#footer-hide').show(); $('.contact-us').fadeIn(600); },
    };
    // no path found then change path to '/404';
    path = routes[path] ? path : '/404';
    // run the function associated with the path
    routes[path]();
  }
  