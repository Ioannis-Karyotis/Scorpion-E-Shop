$(document).ready(function() { 
    if (document.getElementById("error") != null) {
      var elmnt = document.getElementById("error");
        elmnt.scrollIntoView();
    }
    var zoomed =  document.getElementById('Zoom');
    $('.zoom').zoom();
  
    if($('#description').height() != undefined){
      if($('#description').height() <= 50){
        $('#more').addClass('hidden');
        $('#description').addClass('without-after-element');
      }else{
        $('#description').animate({
          'height': '50px'
        })
        o = "opened";
        document.getElementById('more').innerHTML = 'Διάβασε περισσότερα';
      }
    }
  });