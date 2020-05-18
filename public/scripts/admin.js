var verifyOrder = function(order){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
  		fetch("/admin/verifyOrder", {
        	method: "POST",  
         	headers: {
    			"Content-Type": "application/json"
  			},
  			body: JSON.stringify(order)
  		})
        .then(function() {   
	        window.location.reload();
	    })
	}
}

var completeOrder = function(order){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
  		fetch("/admin/completeOrder", {
        	method: "POST",  
         	headers: {
    			"Content-Type": "application/json"
  			},
  			body: JSON.stringify(order)
  		})
        .then(function() {   
	        window.location.reload();
	    })
	}
}