var deleteProduct = function(name,type){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
  		fetch("/products/"+ type +"/"+ name+ "/delete", {
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

var hideSize = function(id,type){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
      fetch("/products/"+ type  +"/"+ id +"/hideSize", {
          method: "post"  
         })
        .then(function() {   
          window.location.reload();
      })
  }
}

$( ".modal" ).click(function(e) {
  if($(event.target).attr('class') == "container-fluid" || $(event.target).attr('class') == "modal"){
    this.style.display= "none";
  }
});
