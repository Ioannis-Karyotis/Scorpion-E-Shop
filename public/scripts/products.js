var deleteProduct = function(id,type){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
  		fetch("/products/"+ type +"/"+id+"/delete", {
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
  		fetch("/products/"+ type +"/"+id+"/hide", {
          method: "post"  
         })
        .then(function() {   
	        window.location.reload();
	    })
	}
}
  
      // <form action="/products/<%= product.type %>/<%= product._id %>/delete?_method=DELETE" method="post">
