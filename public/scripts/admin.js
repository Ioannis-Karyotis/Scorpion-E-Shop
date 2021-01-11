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
          "Content-Type": "application/json"
        }
  		})
        .then(function(result) {
            if(result.status  == 500){
              modal.style.display = "none";
              console.log(result.status)
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
    			"Content-Type": "application/json"
  			},
  			body: JSON.stringify(order)
  		})
        .then(function() {   
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


var deleteOrder = function(order){
  var txt;
  var r = confirm("Are you sure");
  if (r == true) {
    fetch("/admin/deleteOrder/" + order._id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(function() {   
      window.location.reload();
    }) 
  }
}