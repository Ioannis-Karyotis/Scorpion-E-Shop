$(document).ready(function() {
  // Gets the span width of the filled-ratings span
  // this will be the same for each rating
  var star_rating_width = $('.fill-ratings span').width();
  // Sets the container of the ratings to span width
  // thus the percentages in mobile will never be wrong
  $('.star-ratings').width(star_rating_width);

});

var checkPassword = function(){
	var x = document.getElementById("pass");
    if (x.type === "text") {
  	x.value= "";
    x.type = "password";
  }
}

function qtyUpdate(){
	let http = new XMLHttpRequest();
	let url = "/cart/update";
	var id = event.target.parentNode.querySelector('input[type=number]').id;
	var values = id.split(",");
	var qty = document.getElementById(id).value;
  if(qty <= 0){
    //reset the value to 1
    qty = 1;
    document.getElementById(id).value = 1;
  }
	let params = {};
	params.id = values[0];
	params.qty = qty;
	params.size = values[1];
	params.color = values[2];
	let data = JSON.stringify(params);
	http.open("POST", url, true);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(data);

	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status ==200){
			let data = JSON.parse(this.responseText);
			document.getElementById("itm-prc"+id).innerHTML = data.price;
			document.getElementById('cart-total').innerHTML = data.totalPrice;
			document.getElementById('cart-glyphicon').innerHTML = " " + data.totalQuantity;
      //quick view
      document.getElementById("quick_qty"+id).innerHTML = "x"+ qty;
      document.getElementById("quick_product_total"+id).innerHTML = data.price + "€";
      document.getElementById("quick_total").innerHTML = data.totalPrice + "€";
      document.getElementById("quick_total_qty").innerHTML =
        data.totalQuantity>1 ? "Το καλάθι σας έχει "+data.totalQuantity+" προϊόντα"
                             : "Το καλάθι σας έχει "+data.totalQuantity+" προϊόν";
		}
	}
}

function removeProduct(){
	let http = new XMLHttpRequest();
	let url = "/cart/remove2";
	let temp = event.currentTarget.id;
    let id = temp.substring(5,temp.length);
    var values = id.split(",");
	let params = {};
	params.id = values;
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
			window.location.reload();
		}
	}
}

function quickRemoveProduct(event){
	event.stopPropagation();
	let http = new XMLHttpRequest();
	let url = "/cart/remove2";
	let temp = event.currentTarget.id;
    let id = temp.substring(5,temp.length);
    var values = id.split(",");
	let params = {};
	params.id = values;
	let data = JSON.stringify(params);
	http.open("POST", url, true);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(data);

	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status ==200){
			let data = JSON.parse(this.responseText);
			if(data.totalQuantity == 0){
				window.location.reload();
			}else{
				document.getElementById("item-" + data.id[0] + "," + data.id[1] + "," + data.id[2]).style.display = "none";
				document.getElementById('cart-glyphicon').innerHTML = " " + data.totalQuantity;
				document.getElementById("quick_total").innerHTML = data.totalPrice + "€";
				document.getElementById("quick_total_qty").innerHTML =
				data.totalQuantity>1 ? "Το καλάθι σας έχει "+data.totalQuantity+" προϊόντα"
				                     : "Το καλάθι σας έχει "+data.totalQuantity+" προϊόν";   
			}    
		}
	}
}

function MakePhoneCall(element){

	element.style.backgroundColor = "#2D2B30";
	window.open('tel:2310281363');
}

function ScrollToTop(element){

	element.style.backgroundColor = "#2D2B30";
	window.scrollTo(0,0);
}

function clickedback(element){
	element.style.backgroundColor = "#65A07B";
}

function normalback(element){
	element.style.backgroundColor = "#2D2B30";
}