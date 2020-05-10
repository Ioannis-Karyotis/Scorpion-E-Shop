window.onload = function(){ alert("Hi there")};

// A reference to Stripe.js
var stripe;

var orderData = {
  currency: "eur"
};

var buttonSelect = function(type){

	if(type==2 || type==3){
		document.querySelector(".tosend").classList.remove("hidden");
		document.querySelector(".payment").classList.add("hidden");

    document.querySelector(".card-element").classList.add("hidden");

	}else if(type==1){
		document.querySelector(".tosend").classList.add("hidden");
		document.querySelector(".payment").classList.remove("hidden");

    document.querySelector(".card-element").classList.remove("hidden");



	}

}

  // Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;
fetch("/create-payment-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(orderData)
})
.then(function(result) {   
  return result.json();
})
.then(function(data) {
  return setupElements(data);
})
.then(function({ stripe, card, clientSecret }) {
  document.querySelector("button").disabled = false;
  var form = document.getElementById("payment-form");
  form.addEventListener("submit", function(event) {
    // Handle form submission.
    event.preventDefault(); 
    console.log("when pressing button");
    // check parameters through middleware;
    var formData= {
      name: document.getElementById("name").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      line1: document.getElementById("line1").value,
      city: document.getElementById("city").value,
      zip: document.getElementById("postal_code").value,
      state: document.getElementById("state").value
    };
    
    fetch('/create-order', {
      method: "POST",
      headers : { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
       throw new TypeError("Oops, we haven't got JSON!");
      }
      return response.json();       
    })
    .then(function(data){

      //check if middlewares were successfull
      console.log("eisai malakas");
      console.log(data.result);

      // Initiate payment when the submit button is clicked
      pay(stripe, card, clientSecret);
    })
    .catch(function(error){ 
      console.error(error);
      window.location.reload();
    });  
  });
});
// Set up Stripe.js and Elements to use in checkout form
var setupElements = function(data) {
  stripe = Stripe(data.publishableKey);
  var elements = stripe.elements();
  var style = {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: 'Helvetica Neue',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

  return {
    stripe: stripe,
    card: card,
    clientSecret: data.clientSecret
  };
};

/*
 * Calls stripe.confirmCardPayment which creates a pop-up modal to
 * prompt the user to enter extra authentication details without leaving your page
 */
var pay = function(stripe, card, clientSecret) {
  	changeLoadingState(true);
  // Initiate the payment.
  // If authentication is required, confirmCardPayment will automatically display a modal
  stripe
    .confirmCardPayment(clientSecret, {
      	payment_method: {
        	card: card,
        	billing_details: {
        		email:  document.getElementById("email").value,  		
        		phone : document.getElementById("phone").value,
        		name:  document.getElementById("name").value + " " + document.getElementById("surname").value ,
            address :{
              line1:  document.getElementById("line1").value,     
              city : document.getElementById("city").value,
              postal_code:  document.getElementById("postal_code").value,
              state:  document.getElementById("state").value
            }
      		} 	
      	},
        shipping :{
          name: document.getElementById("name").value + " " + document.getElementById("surname").value,
          address:{
              line1:  document.getElementById("line1").value,     
              city : document.getElementById("city").value,
              postal_code:  document.getElementById("postal_code").value,
              state:  document.getElementById("state").value
          },
          phone : document.getElementById("phone").value 
        },
        receipt_email : document.getElementById("email").value
    })
    .then(function(result) {
      if (result.error) {
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        orderComplete(clientSecret);
      }
    });
};

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  // Just for the purpose of the sample, show the PaymentIntent response object
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {
    var paymentIntent = result.paymentIntent;
    var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

    document.querySelector(".chkout").classList.add("hidden");
    document.querySelector("pre").textContent = paymentIntentJson;

    document.querySelector(".sr-result").classList.remove("hidden");
    setTimeout(function() {
      document.querySelector(".sr-result").classList.add("expand");
    }, 200);

    changeLoadingState(false);
  });
};

// Show a spinner on payment submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};