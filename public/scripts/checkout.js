$(document).ready(function() { 
  if (document.getElementById("error") != null) {
    var elmnt = document.getElementById("payment-form");
      elmnt.scrollIntoView();
  }
  if(document.getElementById('pay').checked) {
    $('#pay').click();
  }else if(document.getElementById('send').checked) {
    $('#send').click();
  }else if(document.getElementById('sent').checked){
    $('#sent').click();
  }
  showProgressNotification();
});

var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')   

function showProgressNotification(){
  var productsTotal = parseFloat(document.getElementById("productsPrice").innerHTML);
  if(productsTotal > 0){
    $('.toast').toast('show');
    $('.toast').css('z-index', 4000);
  }
}

//Inline Scripts

$( ".buttonSelect1" ).click(function(e) {
  buttonSelect(1);
});

$( ".buttonSelect2" ).click(function(e) {
  buttonSelect(2);
});

$( ".buttonSelect3" ).click(function(e) {
  buttonSelect(3);
});

$( ".relocate" ).click(function(e) {
  relocate();
});

$( ".relocate2" ).click(function(e) {
  relocate2();
});

$( ".quitModal" ).click(function(e) {
  quitModal();
});
//Inline Scripts

var stripe

var orderData = { //orderData are being used for creating the Payment Intent
  currency: "eur"
};

var buttonSelect = function(type){ //Change the input form shape regarding the pressed radio button

  if(type==2 || type==3){
    document.querySelector(".address").classList.remove("hidden");
    document.getElementById("method").value = "2";
    if(type==3){
      document.querySelector(".address").classList.add("hidden");
      document.getElementById("method").value = "3";

      document.getElementById("antikatavoli").setAttribute("hidden",true);
      document.getElementById("exodaApostol").setAttribute("hidden",true);

    }else{
      document.getElementById("antikatavoli").removeAttribute("hidden");
      document.getElementById("exodaApostol").removeAttribute("hidden");
    }

  }else if(type==1){
    document.querySelector(".card-element").classList.remove("hidden");
    document.querySelector(".address").classList.remove("hidden");
    document.getElementById("method").value = "1";  

    document.getElementById("antikatavoli").setAttribute("hidden",true);
    document.getElementById("exodaApostol").removeAttribute("hidden");
  }
  getTotalPrice();
}

function getTotalPrice(){
  document.getElementById("totalPrice").innerHTML = 0
  var antikatavoli = 0;
  var exodaApostol = 0;
  var productsTotal = parseFloat(document.getElementById("productsPrice").innerHTML);

  if(document.getElementById("antikatavoli").hasAttribute("hidden") == false){
    antikatavoli = 1.8;
  }

  if(document.getElementById("discount").innerHTML == "false" && document.getElementById("exodaApostol").hasAttribute("hidden") == false){
    exodaApostol = 2.5;
  }
  var all = productsTotal + antikatavoli + exodaApostol;
  document.getElementById("totalPrice").innerHTML = all.toFixed(1) + " €"
}

var form = document.getElementById("payment-form");
form.addEventListener("submit", function(event) { //Trigger the following event when the form button is pressed
  event.preventDefault();  // prevent the default form submit event ,which is redirecting the page
 
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
      'Content-Type': 'application/json',
      'x-api-key': window.sessionStorage.getItem("x-api-key"),
      'CSRF-Token': token
    },
    body: JSON.stringify(formData)
  })
  .then(function(response) {        
    window.sessionStorage.setItem('x-api-key',response.headers.get('x-api-key'));
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
            "Content-Type": "application/json",
            'x-api-key': window.sessionStorage.getItem("x-api-key"),
            'CSRF-Token': token
          },
          body: JSON.stringify(formData)
        })
        .then(function(result) {   
          clientSecret =null;
          window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key')); 
          return result.json();
        })
        .then(function(data){
          if(data.error){
              var modal2 = document.getElementById("StripeModal");
              modal2.style.display = "none";
              
              var modal = document.getElementById("myModal");
              modal.style.display = "block";

              document.querySelector(".result3").classList.remove("hidden");
              document.getElementById("errormsg").innerHTML = data.error.message;
              statusChange('failed');
          }else{
            orderComplete(clientSecret,data.orderId);
          }    
        })
      }else{

        changeLoadingState(true);
        var modal2 = document.getElementById("StripeModal");
        modal2.style.display = "block";

        
        fetch("/create-payment-intent", { // Make Post http request for creating the Payment Intent
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'x-api-key': window.sessionStorage.getItem("x-api-key"),
            'CSRF-Token': token
          },
          body: JSON.stringify(orderData)
        })
        .then(function(result) {
          window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));
          if (result.error) {
            var modal2 = document.getElementById("StripeModal");
            modal2.style.display = "none";
            
            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            document.querySelector(".result3").classList.remove("hidden");
            document.getElementById("errormsg").innerHTML = result.error.message;
            statusChange('failed');
          } 
          return result.json();
        })
        .then(function(data) {
          if(data.error){
            var modal2 = document.getElementById("StripeModal");
            modal2.style.display = "none";
            
            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            document.querySelector(".result3").classList.remove("hidden");
            document.getElementById("errormsg").innerHTML = data.error.message;
            statusChange('failed');
          }else{
            return setupElements(data); //Setup the the card element along with the order data that were sent to the server
          }
        })
        .then(function({ stripe, card, clientSecret, id }) {
          changeLoadingState(false);
          var form = document.getElementById("payment-form2");
          form.addEventListener("submit", function(event2) { 
            event2.preventDefault();
            fetch("/check_cart", {
              method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'x-api-key': window.sessionStorage.getItem("x-api-key"),
                  'CSRF-Token': token
                },
                body: JSON.stringify(formData)
              })
              .then(function(result) {
                window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));     
                return result.json();
              })
              .then(function(data){
                if(data.error){
                    var modal2 = document.getElementById("StripeModal");
                    modal2.style.display = "none";
                    
                    var modal = document.getElementById("myModal");
                    modal.style.display = "block";

                    document.querySelector(".result3").classList.remove("hidden");
                    document.getElementById("errormsg").innerHTML = data.error.message;
                    statusChange('failed');
                }else{
                  pay(stripe, card, clientSecret);  //else call pay() to make payment and post to datababe via stripe help
                }
              });  
            })
          })  
      }     
  })
  .catch(function(error){ 
    console.error(error);
    window.location.reload();
  });  
});

var setupElements = function(data) { // Set up Stripe.js and Elements to use in checkout form
  stripe = Stripe(data.publishableKey);
  var elements = stripe.elements();
  var style = {
    base: {
      iconColor: '#666EE8',
      color: '#000000',
      lineHeight: '60px',
      fontWeight: 500,
      fontFamily: 'Helvetica Neue',
      fontSize: '14px',

      '::placeholder': {
        color: '#25323f',
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  var card = elements.create("card", { 
    style: style,
    hidePostalCode : true 
  });

  card.mount("#card-element");

  return {
    stripe: stripe,
    card: card,
    clientSecret: data.clientSecret
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
      if (result.error) {

        if(result.error.code == "incomplete_number" || result.error.code == "incomplete_expiry" || result.error.code == "incomplete_cvc"){
          document.querySelector(".content-chk").classList.remove("hidden");
          document.querySelector(".loading").classList.add("hidden");
          showError(result.error.message);
        }else{
          var modal2 = document.getElementById("StripeModal");
          modal2.style.display = "none";
          
          var modal = document.getElementById("myModal");
          modal.style.display = "block";

          document.querySelector(".result3").classList.remove("hidden");
          document.getElementById("errormsg").innerHTML = result.error.message;
          statusChange('failed');
          fetch("/delete_cookie", {
            method: "GET"
          })
        }
      } else {
        var modal2 = document.getElementById("StripeModal");
        modal2.style.display = "none";
        
        var modal = document.getElementById("myModal");
        modal.style.display = "block";

        // The payment has been processed!
        fetch("/post_order", {
          method: "POST",
            headers: {
              "Content-Type": "application/json",
              'x-api-key': window.sessionStorage.getItem("x-api-key"),
              'CSRF-Token': token
            },
            body: JSON.stringify(result)
          })
          .then(function(result) {
            window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));     
            return result.json();
          })
          .then(function(data){
            if(data.error){
              var modal2 = document.getElementById("StripeModal");
              modal2.style.display = "none";
              
              var modal = document.getElementById("myModal");
              modal.style.display = "block";

              document.querySelector(".result3").classList.remove("hidden");
              document.getElementById("errormsg").innerHTML = data.error.message;
              statusChange('failed');
            }else{
              orderComplete(clientSecret, data.orderId);
            }
          });  
      }
    });
};

/* ------- Post-payment helpers ------- */

/* Shows a success message when the payment is complete */

var orderComplete = function(clientSecret ,orderId) {
  if(!clientSecret){ //when the user just post data to the database
    document.querySelector(".chkout").classList.add("hidden");
    $('.circle-loader').toggleClass('load-complete');
    $('.checkmark').toggle();
    document.querySelector(".result2").classList.remove("hidden");
    $('#ShowOrderSent').attr("href", "/showOrder/"+ orderId);
       
    changeLoadingState(false);

  }else{ //when the user pays with card

    stripe.retrievePaymentIntent(clientSecret).then(function(result) {
      document.querySelector(".chkout").classList.add("hidden");
      
      $('.circle-loader').toggleClass('load-complete');
      $('.checkmark').toggle();
      document.querySelector(".result").classList.remove("hidden");
      $('#ShowOrderPay').attr("href", "/showOrder/"+ orderId);

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
  window.location.replace(document.getElementById("root").innerHTML);
}

function relocate2(){
  window.location.replace(document.getElementById("root").innerHTML + "/checkout");
}

function statusChange(status){
  var el = $('.circle-loader')
  el.removeClass()
  el.addClass('circle-loader');
  el.addClass(status);
}

var showError = function(errorMsgText) {
  changeLoadingState(false);
  var errorMsg = document.querySelector(".sr-field-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

var quitModal = function() {
  document.getElementById('StripeModal').style.display='none';
  window.location.reload();
};
