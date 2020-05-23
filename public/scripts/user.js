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

$("#imgInp").change(function(){
    readURL(this);
});