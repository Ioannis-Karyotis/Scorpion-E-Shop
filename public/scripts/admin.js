// Inline Scripts

var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')   

$('.deleteOrder').click(function() {
  var val = $(this).val();
  deleteOrder(val);
});

$('.verifyOrder').click(function() {
  var val = $(this).val();
  verifyOrder(JSON.parse(val));
});

$('.completeOrder').click(function() {
  var val = $(this).val();
  completeOrder(JSON.parse(val));
});
// Inline Scripts




var verifyOrder =  async function(order){
   	var txt;
  var r = prompt("Σε πόσες μέρες θα είναι έτοιμη η παραγγελία; ", "Βάλε έναν αριθμό");
  var days  = parseInt(r); 
	if (days != null && Number.isInteger(days) ) {
    var order2 = {
          days : days,
          order: order
    }
    var modal = document.getElementById("adminModal");
    modal.style.display = "block";
  		await fetch("/admin/verifyOrder/", {
        method: "POST", 	
  			body: JSON.stringify(order2),
        headers: {
          "Content-Type": "application/json",
          'x-api-key': window.sessionStorage.getItem("x-api-key"),
          'CSRF-Token': token
        }
  		})
        .then(function(result) {
            window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));     
            if(result.status  == 500){
              modal.style.display = "none";
              alert("Κάτι πήγε Στραβά!!!!");
            }else{
              $('.circle-loader').toggleClass('load-complete');
              $('.checkmark').toggle();
              document.querySelector(".wait").classList.add("hidden");
              document.querySelector(".result").classList.remove("hidden");
              setTimeout(function() {
                window.location.reload();
              }, 2000);
            } 
	    })
	}else{
    alert("Πληκτρολόγησε έναν αριθμό");
  }
}

var completeOrder = function(order){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
      var modal = document.getElementById("adminModal");
      modal.style.display = "block";
  		fetch("/admin/completeOrder", {
        	method: "POST",  
         	headers: {
    			"Content-Type": "application/json",
          'x-api-key': window.sessionStorage.getItem("x-api-key"),
          'CSRF-Token': token
  			},
  			body: JSON.stringify(order)
  		})
        .then(function(result) {   
          window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));     
	        $('.circle-loader').toggleClass('load-complete');
          $('.checkmark').toggle();
          document.querySelector(".wait").classList.add("hidden");
          document.querySelector(".result").classList.remove("hidden");
          setTimeout(function() {
            window.location.reload();
          }, 2000);
	    })
	}
}


var deleteOrder = function(id){
  var txt;
  var r = confirm("Are you sure");
  if (r == true) {
    fetch("/admin/deleteOrder/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'x-api-key': window.sessionStorage.getItem("x-api-key"),
        'CSRF-Token': token
      }
    })
    .then(function(result) {
      window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));        
      window.location.reload();
    }) 
  }
}