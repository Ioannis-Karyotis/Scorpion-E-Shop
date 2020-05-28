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
  
      // <form action="/products/<%= product.type %>/<%= product._id %>/delete?_method=DELETE" method="post">
