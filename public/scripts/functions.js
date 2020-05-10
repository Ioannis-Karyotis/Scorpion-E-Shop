$(document).ready(function() {
  // Gets the span width of the filled-ratings span
  // this will be the same for each rating
  var star_rating_width = $('.fill-ratings span').width();
  // Sets the container of the ratings to span width
  // thus the percentages in mobile will never be wrong
  $('.star-ratings').width(star_rating_width);
});

var checkPassword = function (){
	var x = document.getElementById("pass");
    if (x.type === "text") {
  	x.value= "";
    x.type = "password";
  }
}

function qtyUpdate(){
	let http = new XMLHttpRequest();
	let url = "/cart/update";
	var id = event.target.id;
	let qty = document.getElementById(id).value;
	let params = {};
	params.id = id;
	params.qty = qty;
	let data = JSON.stringify(params);
	http.open("POST", url, true);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(data);

	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status ==200){
			let data = JSON.parse(this.responseText);
			document.getElementById("itm-prc"+id).innerHTML = data.price;
			document.getElementById('cart-total').innerHTML = data.totalPrice;
			document.getElementById('cart-glyphicon').innerHTML = data.totalQuantity;
		}
	}
}

function removeProduct(){
	let http = new XMLHttpRequest();
	let url = "/cart/remove";
	let temp = event.currentTarget.id;
	let params = {};
	params.id = temp;
	let data = JSON.stringify(params);
	http.open("POST", url, true);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(data);

	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status ==200){
			// var resp = request.responseText;
	    // var parser = new DOMParser();
	    // var xmlDoc = parser.parseFromString(resp,"text/html");
	    // var tds = xmlDoc.getElementById("cart-id");
	    // console.log(xmlDoc);
	    // document.getElementById('cart-id').innerHTML = tds.innerHTML;
			window.location.assign('cart');
		}
	}
}
