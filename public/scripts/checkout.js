var stripe

var orderData = { //orderData are being used for creating the Payment Intent
  currency: "eur"
};

var buttonSelect = function(type){ //Change the input form shape regarding the pressed radio button

  if(type==2 || type==3){
    // document.getElementById("button-text-send").classList.remove("hidden");
    // document.getElementById("button-text-pay").classList.add("hidden");
    document.querySelector(".address").classList.remove("hidden");
    document.getElementById("method").value = "2";
    if(type==3){
      document.querySelector(".address").classList.add("hidden");
      document.getElementById("method").value = "3";                                
    }

  }else if(type==1){
    // document.getElementById("button-text-send").classList.add("hidden");
    // document.getElementById("button-text-pay").classList.remove("hidden");
    document.querySelector(".card-element").classList.remove("hidden");
    document.querySelector(".address").classList.remove("hidden");
    document.getElementById("method").value = "1";  
  }

}

  
var form = document.getElementById("payment-form");
form.addEventListener("submit", function(event) { //Trigger the following event when the form button is pressed
  event.preventDefault();  // prevent the default form submit event ,which is redirecting the page
  console.log("when pressing button");
 
  var formData= {  //collecting the values from the form
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    line1: document.getElementById("line1").value,
    city: document.getElementById("city").value,
    zip: document.getElementById("postal_code").value,
    state: document.getElementById("state").value,
    method : document.getElementById("method").value
  };
  
  fetch('/create-order', { // check parameters through middleware that exist in this create-order post route;
    method: "POST",
    headers : { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(function(response) {        
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
     throw new TypeError("Oops, we haven't got JSON!");//If the respnse is empty ,means not all middleware were passed .
    }
    return response.json();       
  })
  .then(function(data){
    if(document.getElementById("method").value == "2" || document.getElementById("method").value == "3"){//make post dta to database without card payment
      
      var modal = document.getElementById("myModal");
      modal.style.display = "block";

      fetch("/post_order_sent", {
        method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })
        .then(function(result) {   
          clientSecret =null;
          orderComplete(clientSecret);
        })
      }else{
        console.log("Got into stripe");

        changeLoadingState(true);
        var modal2 = document.getElementById("StripeModal");
        modal2.style.display = "block";

        
          //document.querySelector("buttonPay").disabled = true; // Disable the button until we have Stripe set up on the page
          fetch("/create-payment-intent", { // Make Post http request for creating the Payment Intent
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
            
            if(data.CartDoesNotMatchError || data.CartDoesNotMatchError == "error"){
              modal2.style.display = "none";
              var modal4 = document.getElementById("CartDoesNotMatchModal");
              modal4.style.display = "block";
              setTimeout(function () {    
                  window.location.replace("http://localhost:3000/");
              }, 3000);
            }
            return setupElements(data); //Setup the the card element along with the order data that were sent to the server
          })
          .then(function({ stripe, card, clientSecret, id }) {
            changeLoadingState(false);
            var form = document.getElementById("payment-form2");
            form.addEventListener("submit", function(event2) { 
              event2.preventDefault();
              pay(stripe, card, clientSecret);  //else call pay() to make payment and post to datababe via stripe help
          })
        })  
      }     
  })
  .catch(function(error){ 
    var modal2 = document.getElementById("StripeModal");
    modal2.style.display = "none";

    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    document.querySelector(".result3").classList.remove("hidden");
    statusChange('failed');
  });  
});

var setupElements = function(data) { // Set up Stripe.js and Elements to use in checkout form
  stripe = Stripe(data.publishableKey);
  var elements = stripe.elements();
  var style = {
    base: {
      iconColor: '#666EE8',
      color: '#313231',
      lineHeight: '60px',
      fontWeight: 500,
      fontFamily: 'Helvetica Neue',
      fontSize: '14px',

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
    clientSecret: data.clientSecret,
    id : data.id
  };
};

var pay =async function(stripe, card, clientSecret) {
  changeLoadingState(true);

  document.querySelector(".content-chk").classList.add("hidden");
  document.querySelector(".loading").classList.remove("hidden");

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
      console.log(result);
      if (result.error) {
        
        var modal2 = document.getElementById("StripeModal");
        modal2.style.display = "none";
        
        var modal = document.getElementById("myModal");
        modal.style.display = "block";

        document.querySelector(".result3").classList.remove("hidden");
        statusChange('failed');

      } else {

        var modal2 = document.getElementById("StripeModal");
        modal2.style.display = "none";
        
        var modal = document.getElementById("myModal");
        modal.style.display = "block";

        // The payment has been processed!
        fetch("/post_order", {
          method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(result)
          })
          .then(function(result) { 
            orderComplete(clientSecret);
          })  
      }
    });
};

/* ------- Post-payment helpers ------- */

/* Shows a success message when the payment is complete */

var orderComplete = function(clientSecret) {
  if(!clientSecret){ //when the user just post data to the database
    document.querySelector(".chkout").classList.add("hidden");
    $('.circle-loader').toggleClass('load-complete');
    $('.checkmark').toggle();
    document.querySelector(".result2").classList.remove("hidden");
       
    changeLoadingState(false);

  }else{ //when the user pays with card

    stripe.retrievePaymentIntent(clientSecret).then(function(result) {
      document.querySelector(".chkout").classList.add("hidden");
      
      $('.circle-loader').toggleClass('load-complete');
      $('.checkmark').toggle();
      document.querySelector(".result").classList.remove("hidden");

      changeLoadingState(false);
    });
  }
};

// Show a spinner on payment submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.getElementById("finalPay").disabled = true;
  
  } else {
    document.getElementById("finalPay").disabled = false;
  }
};

function relocate(){
  window.location.replace("http://localhost:3000/");
}

function relocate2(){
  window.location.replace("http://localhost:3000/checkout");
}

function statusChange(status){
  var el = $('.circle-loader')
  el.removeClass()
  el.addClass('circle-loader');
  el.addClass(status);
}