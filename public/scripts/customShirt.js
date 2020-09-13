$(document).ready(function() {
  //custom t-shirt - call it in order to keep image up to speed with drop-down menu option
  changeShirtColor();
  //custom t-shirt - reset upload form files
  document.getElementById("stampImage").value = "";
});


function changeShirtColor(){
  let img = document.getElementById('selectedColor');
  let color = document.getElementById('tshirtColor').value;
  if(color === 'Άσπρο'){
    img.src = "https://scorpion-store.herokuapp.com/images/white_t_shirt.png";
  }else{
    img.src = "https://scorpion-store.herokuapp.com/images/black_t_shirt.png";
  }
}

function loadImage(input){
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#uploadedImage')
        .attr('src', e.target.result);
        // .width(175)
        // .height(250);
    }
    reader.readAsDataURL(input.files[0]); // convert to base64 string
  }
}
