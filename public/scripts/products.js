$(document).ready(function() { 
  if (document.getElementById("error") != null) {
    var elmnt = document.getElementById("error");
      elmnt.scrollIntoView();
  }
});


var deleteProduct = function(id,type){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
  		fetch("/products/"+ type +"/"+ id+ "/delete", {
          headers: {
              "Content-Type": "application/json"
          },
          method: "DELETE"  
         })
        .then(function(result) {   
	        return result.json();
        }).then(function(data){
          if (data.error) {
             $('#error').removeClass("hidden");
             $('#error').text(data.error);
             setTimeout(function(){  $('#error').addClass("hidden"); }, 3000);
          }else{
            window.location.reload();
          }
        }); 
	}
}

var hideProduct = function(id,type){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
  		fetch("/products/"+ type  +"/"+ id +"/hide", {
          method: "post"  
         })
        .then(function() {   
	        window.location.reload();
	    })
	}
}

var hideSize = function(id,type,size){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
    fetch("/products/"+ type  +"/"+ id +"/hideSize/" + size, {
        method: "post"
       })
      .then(function() {   
        window.location.reload();
    })
  }
}

var deleteColor = function(id,type,color){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
      fetch("/products/" + type + "/" + id + "/deleteColor/" + color.substring(1), {
          method: "post"  
         })
        .then(function() {   
          window.location.reload();
      })
  }
}

var hideColor = function(id,type,color){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
      fetch("/products/" + type + "/" + id + "/hideColor/" + color.substring(1), {
          method: "post"  
         })
        .then(function() {   
          window.location.reload();
      })
  }
}

var deleteImage = function(id,type,name){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
      fetch("/products/" + type + "/" + id + "/deleteImage/" + name, {
          method: "post"  
         })
        .then(function() {   
          window.location.reload();
      })
  }
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInp").change(function(){
    readURL(this);
});


$( ".modal" ).click(function(e) {
  if($(event.target).attr('class') == "container-fluid" || $(event.target).attr('class') == "modal"){
    this.style.display= "none";
    $('html').removeClass("hideOverflow");
  }
});

$( ".Xbutton" ).click(function(e) {
    $('html').removeClass("hideOverflow");
});

$( ".product-img" ).click(function(e) {
    $('html').addClass("hideOverflow");
});
