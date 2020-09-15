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
          method: "DELETE"  
         })
        .then(function() {   
	        window.location.reload();
	    })
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

$(document).ready(function () {
     $("#AddPrd").on('click', function (event) { 
        document.getElementById("AddPrd").disabled = true;
        var a = document.forms["Form"]["name"].value;
        var b = document.forms["Form"]["price"].value;
        var c = document.forms["Form"]["description"].value;
        var d = document.forms["Form"]["color"].value;
        var e = document.forms["Form"]["colorHex"].value;
        var f = document.forms["Form"]["profile_pic"].value;
        if (a == null || a == "", b == null || b == "", c == null || c == "", d == null || d == "", e == null || e == "", f == null || f == "") {
          alert("Please Fill All Required Fields");
          document.getElementById("AddPrd").disabled = false;
          return false;
        }
    })
});