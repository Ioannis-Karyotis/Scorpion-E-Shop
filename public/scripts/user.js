
//inline Scripts
$( ".showInputs1" ).click(function(e) {
  showInputs1();
});

$( ".showInputs2" ).click(function(e) {
  showInputs2();
});

$( ".deleteProfile" ).click(function(e) {

  var val = $(this).val().split(",");
  console.log(val);
  deleteProfile(val[0],val[1]);
});

//inline Scripts

var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')   


function showInputs1(){
	ps =document.querySelectorAll(".firstp")
	is =document.querySelectorAll(".firsti")
	// classList.add("hidden");
  	for (i = 0; i < ps.length; i++) {
    	ps[i].classList.add("hidden");
  	}  	
	// classList.add("hidden");
  	for (i = 0; i < is.length; i++) {
    	is[i].classList.remove("hidden");
  	}
}

function showInputs2(){
	ps =document.querySelectorAll(".secondp")
	is =document.querySelectorAll(".secondi")
	// classList.add("hidden");
  	for (i = 0; i < ps.length; i++) {
    	ps[i].classList.add("hidden");
  	}  	
	// classList.add("hidden");
  	for (i = 0; i < is.length; i++) {
    	is[i].classList.remove("hidden");
  	}
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }
        document.querySelector(".imgbutton").classList.remove("hidden");
        reader.readAsDataURL(input.files[0]);
    }
}

function deleteProfile(id , email) {
  var txt;
  var r = prompt("Πληκτρολόγησε το e-mail σου για επιβεβαίωση διαγραφής");
  var modal = document.getElementById("user-modal");
      
  if (r != null && r == email ) {
    modal.style.display = "block";
    var userid = {id : id};
    fetch("/user/deleteProfile", {
        method: "DELETE",  
        headers: {
        "Content-Type": "application/json",
        'x-api-key': window.sessionStorage.getItem("x-api-key"),
        'CSRF-Token': token
      },
      body: JSON.stringify(userid)
    })
    .then(function(result) { 
      window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));        
      $('.circle-loader').toggleClass('load-complete');
      $('.checkmark').toggle();
      document.querySelector(".result").classList.remove("hidden");
      setTimeout(function() {
        window.location.replace("/login");
      }, 2000);             
    })
  }else{
    alert("Πληκτρολόγησε το σωστο e-mail για επιβεβαίωση διαγραφής");
  }
}


$("#imgInp").change(function(){
    readURL(this);
});