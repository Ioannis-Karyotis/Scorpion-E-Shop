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
	let id = event.target.id;
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
			document.getElementById('itm-prc').innerHTML = data.price;
			document.getElementById('cart-total').innerHTML = data.totalPrice;
			//to page-container einai ena div sto header
			//to responseText einai olh selida (mazi me header kai footer) kai toy lew na
			//fortwsei to response sto div. prakrikta kanei reload xwris na kanei reload
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
			//window.location.assign('/cart');
			document.getElementById('response-container').innerHTML = this.responseText;
			//to page-container einai ena div sto header
			//to responseText einai olh selida (mazi me header kai footer) kai toy lew na
			//fortwsei to response sto div. prakrikta kanei reload xwris na kanei reload
		}
	}
}

