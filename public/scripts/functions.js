$('#page-container').append('<div class="d-flex justify-content-center align-items-center" id="loadingDiv"><div class="circle-loader"><div class="checkmark draw"></div><div class="status draw"></div></div></div>');
$(window).on('load', function(){
  setTimeout(removeLoader, 0); //wait for page load PLUS two seconds.
});
function removeLoader(){
    $( "#loadingDiv" ).fadeOut(800, function() {

		// Page is loaded
		const objects = document.getElementsByClassName('asyncImage');
		Array.from(objects).map((item) => {
			// Start loading image
			const img = new Image();
			img.src = item.dataset.src;
			// Once image is loaded replace the src of the HTML element
			img.onload = () => {
			item.classList.remove('asyncImage');
			return item.nodeName === 'IMG' ? 
				item.src = item.dataset.src :        
				item.style.backgroundImage = `url(${item.dataset.src})`;
			};
		});

		// fadeOut complete. Remove the loading div
		$( "#loadingDiv" ).remove(); //makes page more lightweight
		var element = document.getElementById("page-container");
		var footer  = document.getElementById("page-footer");
		var wholepage = document.getElementsByTagName('html');
		wholepage[0].classList.remove("NotScrollable");
		element.classList.remove("loading-container");
		footer.classList.remove("hidden");
		element.classList.add("after-loading-container");

		//Scroll to Error In any case!!!
		if (document.getElementById("error") != null) {
			var elmnt = document.getElementById("error");
			  elmnt.scrollIntoView();
		}
  	});  
}


$(document).ready(function() {
	// Gets the span width of the filled-ratings span
	// this will be the same for each rating
	var star_rating_width = $('.fill-ratings span').width();
	// Sets the container of the ratings to span width
	// thus the percentages in mobile will never be wrong
	$('.star-ratings').width(star_rating_width);

	// Carousel

	$(".carousel").carousel({
	    interval: false,
	    pause: true
	});

	$( ".carousel .carousel-inner" ).swipe( {
	swipeLeft: function ( event, direction, distance, duration, fingerCount ) {
	    this.parent( ).carousel( 'next' );
	},
	swipeRight: function ( ) {
	    this.parent( ).carousel( 'prev' );
	},
	threshold: 0,
	tap: function(event, target) {
	    window.location = $(this).find('.carousel-item.active img').attr('src');
	},
	excludedElements:"label, button, input, select, textarea, .noSwipe"
	} );

	$('.carousel .carousel-inner').on('dragstart', 'img', function () {
	    return false;
	});  


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

function ScrollToTopNav(){
	window.scrollTo(0,0);
}

function clickedback(element){
	element.style.backgroundColor = "#65A07B";
}

function normalback(element){
	element.style.backgroundColor = "#2D2B30";
}
// InLineScripts
$( "html" ).click(function(e) {
    if($(event.target).attr('class') != "openOnDemand" || $(event.target).attr('id') == "CartToggle"){
        $('.openOnDemand').removeClass("show");
        $('#CartToggle').attr("aria-expanded","false");
    }
});

$('.quickRemoveProduct').click(function(event){
	quickRemoveProduct(event);
})

$('.removeProduct').click(function(){
	removeProduct();
})

$('.ScrollToTopNav').click(function(event){
	ScrollToTopNav();
})

$('.scrollToTop').click(function(){
	ScrollToTop(this);
})

$('.scrollToTop').mouseover(function(){
	clickedback(this);
})

$('.scrollToTop').mouseout(function(){
	normalback(this);
})

$('.phonecall').click(function(){
	MakePhoneCall(this);
})

$('.phonecall').mouseover(function(){
	clickedback(this);
})

$('.phonecall').mouseout(function(){
	normalback(this);
})

$( ".stepDownCart" ).click(function(e) {
	this.parentNode.querySelector('input[type=number]').stepDown();
	qtyUpdate();
  });
  
$( ".stepUpCart" ).click(function(e) {
	this.parentNode.querySelector('input[type=number]').stepUp();
	qtyUpdate();
});

$( ".quantity" ).change(function(e) {
	qtyUpdate();
});

// InLineScripts