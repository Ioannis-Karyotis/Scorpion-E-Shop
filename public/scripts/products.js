$(document).ready(function() { 

  if (document.getElementById("error") != null) {
    var elmnt = document.getElementById("error");
      elmnt.scrollIntoView();
  }
  var zoomed =  document.getElementById('Zoom');
  if(window.screen.availWidth > 775){
    $('.zoom').zoom();
  }else{
    $('.zoom').addClass('without-after-element');
  }

  if($('#description').height() != undefined){
    if($('#description').height() <= 80){
      $('#more').addClass('hidden');
      $('#description').addClass('without-after-element');
    }else{
      $('#description').animate({
        'height': '80px'
      })
      o = "opened";
      document.getElementById('more').innerHTML = 'Διάβασε περισσότερα';
    }
  }   

  showProgressNotification();
}); 

// Inline EVENTS

$('.goToProduct').click(function() {
  console.log($( this ).attr('value'));
  window.location.replace($( this ).attr('value'));
});


$('.dltImg').click(function() {
  var val = $(this).val().split(",");;
  deleteImage(val[0],val[1],val[2]);
});

$( ".stepDown" ).click(function(e) {
  this.parentNode.querySelector('input[type=number]').stepDown();
});

$( ".stepUp" ).click(function(e) {
  this.parentNode.querySelector('input[type=number]').stepUp();
});

$('.hideSize').click(function(){
  var val = $(this).val().split(",");;
  hideSize(val[0],val[1],val[2]);
});

$('.radioColor').click(function(){
  goToImage($(this).val());
});

$('.deleteColor').click(function(){
  var val = $(this).val().split(",");;
  deleteColor(val[0],val[1],val[2]);
});

$('.hideColor').click(function(){
  var val = $(this).val().split(",");;
  hideColor(val[0],val[1],val[2]);
});

$('.openProductModal').click(function(){
  document.getElementById($(this).attr('value')).style.display='block';
});

$('.CloseProductModal').click(function(){
  document.getElementById($(this).attr('value')).style.display='none';
});

$('.deleteProduct').click(function(){
  var val = $(this).val().split(",");;
  deleteProduct(val[0],val[1]);
});

$('.hideProduct').click(function(){
  var val = $(this).val().split(",");;
  hideProduct(val[0],val[1]);
});



// Inline EVENTS


function showProgressNotification(){
  if(document.getElementById("productsPrice") != null){
    var productsTotal = parseFloat(document.getElementById("productsPrice").innerHTML);
    if(productsTotal > 0){
      $('.openOnDemand').addClass("show");
      $('#CartToggle').attr("aria-expanded","true");
    }
  }
}

var o;
var h =  $('#description').height();

$('.product-img').click(function(e) {
  e.stopPropagation();
  var elId = $(this).attr('id');
  var moreId = elId.replace('open','#more');
  var descId = elId.replace('open','#desc');
  var width = $(descId).height();
  if($(descId).height() < 150){
    $(moreId).removeClass('hidden');
    $(moreId).innerHTML = 'Διάβασε περισσότερα';
  }else{
    $(descId).animate({
      'height': '80px'
    })
    $(moreId).removeClass('hidden');
    $(moreId).innerHTML = 'Διάβασε περισσότερα';
  }
});

$('#more').click(function(e) {
  e.stopPropagation();
    if(o == "opened"){
      $('#description').animate({
        'height': h
      })
      o = "closed";
      e.stopImmediatePropagation();
      $('#description').addClass('without-after-element');
      document.getElementById('more').innerHTML = 'Κλείσιμο';
    }else{
      $('#description').animate({
        'height': '80px'
      })
      o = "opened";
      e.stopImmediatePropagation();
      $('#description').removeClass('without-after-element');
      document.getElementById('more').innerHTML = 'Διάβασε περισσότερα';
    }
   
});

var deleteProduct = function(id,type){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
    fetch("/products/"+ type +"/"+ id+ "/delete", {
        headers: {
            "Content-Type": "application/json",
            'x-api-key': window.sessionStorage.getItem("x-api-key")
        },
        method: "DELETE"  
        })
      .then(function(result) {
        window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));        
        return result.json();
      }).then(function(data){
        if (data.error) {
            $('#error').removeClass("hidden");
            $('#error').text(data.error);
            setTimeout(function(){  $('#error').addClass("hidden"); }, 3000);
        }else{
          window.location.reload();
        }
      }); 
	}
}

var hideProduct = function(id,type){
   	var txt;
	var r = confirm("Are you sure");
	if (r == true) {
  		fetch("/products/"+ type  +"/"+ id +"/hide", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            'x-api-key': window.sessionStorage.getItem("x-api-key")
          },  
         })
        .then(function(result) {  
          window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));      
	        window.location.reload();
	    })
	}
}

var hideSize = function(id,type,size){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
    fetch("/products/"+ type  +"/"+ id +"/hideSize/" + size, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          'x-api-key': window.sessionStorage.getItem("x-api-key")
        },
       })
      .then(function(result) {
        window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));        
        window.location.reload();
    })
  }
}

var deleteColor = function(id,type,color){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
      fetch("/products/" + type + "/" + id + "/deleteColor/" + color.substring(1), {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            'x-api-key': window.sessionStorage.getItem("x-api-key")
          }, 
         })
        .then(function(result) {
          window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));        
          window.location.reload();
      })
  }
}

var hideColor = function(id,type,color){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
      fetch("/products/" + type + "/" + id + "/hideColor/" + color.substring(1), {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            'x-api-key': window.sessionStorage.getItem("x-api-key")
          },  
         })
        .then(function(result) {
          window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));        
          window.location.reload();
      })
  }
}

var deleteImage = function(id,type,name){
    var txt;
  var r = confirm("Are you sure");
  if (r == true) {
      fetch("/products/" + type + "/" + id + "/deleteImage/" + name, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            'x-api-key': window.sessionStorage.getItem("x-api-key")
          },  
         })
        .then(function(result) {
          window.sessionStorage.setItem('x-api-key',result.headers.get('x-api-key'));        
          window.location.reload();
      })
  }
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
            $('.imgbutton').removeClass("hidden");
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function goToImage(imageId){
  classes = document.getElementsByClassName(imageId);
  image = classes[0].getAttribute("value");
  $('.carousel').carousel(parseInt(image));
}

$("#imgInp").change(function(){
    readURL(this);
});


$( ".modal" ).click(function(e) {
  if($(event.target).attr('class') == "container-fluid" || $(event.target).attr('class') == "modal"){
    this.style.display= "none";
    $('html').removeClass("hideOverflow");
  }
});

$( ".Xbutton" ).click(function(e) {
    $('html').removeClass("hideOverflow");
});

$( ".product-img" ).click(function(e) {
    $('html').addClass("hideOverflow");
});



(function ($) {
	var defaults = {
		url: false,
		callback: false,
		target: false,
		duration: 120,
		on: 'mouseover', // other options: grab, click, toggle
		touch: true, // enables a touch fallback
		onZoomIn: false,
		onZoomOut: false,
		magnify: 1
	};

	// Core Zoom Logic, independent of event listeners.
	$.zoom = function(target, source, img, magnify) {
		var targetHeight,
			targetWidth,
			sourceHeight,
			sourceWidth,
			xRatio,
			yRatio,
			offset,
			position = $(target).css('position'),
			$source = $(source);

// The parent element needs positioning so that the zoomed element
// can be correctly positioned within.
target.style.position = /(absolute|fixed)/.test(position) ? position : 'relative';
	target.style.overflow = 'hidden';

		img.style.width = img.style.height = '';

		$(img)
			.addClass('zoomImg')
			.css({
				position: 'absolute',
				top: 0,
				left: 0,
				opacity: 0,
				width: img.width * magnify,
				height: img.height * magnify,
				border: 'none',
				maxWidth: 'none',
				maxHeight: 'none'
			})
			.appendTo(target);

		return {
			init: function() {
				targetWidth = $(target).outerWidth();
				targetHeight = $(target).outerHeight();

				if (source === target) {
					sourceWidth = targetWidth;
					sourceHeight = targetHeight;
				} else {
					sourceWidth = $source.outerWidth();
					sourceHeight = $source.outerHeight();
				}

				xRatio = (img.width - targetWidth) / sourceWidth;
				yRatio = (img.height - targetHeight) / sourceHeight;

				offset = $source.offset();
			},
			move: function (e) {
				var left = (e.pageX - offset.left),
					top = (e.pageY - offset.top);

				top = Math.max(Math.min(top, sourceHeight), 0);
				left = Math.max(Math.min(left, sourceWidth), 0);

				img.style.left = (left * -xRatio) + 'px';
				img.style.top = (top * -yRatio) + 'px';
			}
		};
	};

	$.fn.zoom = function (options) {
		return this.each(function () {
			var
			settings = $.extend({}, defaults, options || {}),
			//target will display the zoomed image
			target = settings.target || this,
			//source will provide zoom location info (thumbnail)
			source = this,
			$source = $(source),
			img = document.createElement('img'),
			$img = $(img),
			mousemove = 'mousemove.zoom',
			clicked = false,
			touched = false,
			$urlElement;

// If a url wasn't specified, look for an image element.
			if (!settings.url) {
			$urlElement = $source.find('img');
		if ($urlElement[0]) {
settings.url = $urlElement.data('src') || $urlElement.attr('src');
		}
		if (!settings.url) {
		return;
		}
		}

(function(){
	var position = target.style.position;
	var overflow = target.style.overflow;

		$source.one('zoom.destroy', function(){
		$source.off(".zoom");
		target.style.position = position;
		target.style.overflow = overflow;
		$img.remove();
		});
				
	}());

	img.onload = function () {
	var zoom = $.zoom(target, source, img, settings.magnify);

		function start(e) {
		zoom.init();
		zoom.move(e);

// Skip the fade-in for IE8 and lower since it chokes on fading-in
// and changing position based on mousemovement at the same time.
$img.stop()
.fadeTo($.support.opacity ? settings.duration : 0, 1, $.isFunction(settings.onZoomIn)
 ? settings.onZoomIn.call(img) : false);
	}

	function stop() {
		$img.stop()
.fadeTo(settings.duration, 0, 
$.isFunction(settings.onZoomOut) 
     ? settings.onZoomOut.call(img) : false);
				}

    // Mouse events
    if (settings.on === 'grab') {
      $source
        .on('mousedown.zoom',
           function (e) {
          if (e.which === 1) {
      $(document).one('mouseup.zoom',
           function () {
               stop();

       $(document).off(mousemove, zoom.move);
           }
          );

                  start(e);

         $(document).on(mousemove, zoom.move);

                e.preventDefault();
               }
             }
            );
    } else if (settings.on === 'click') {
       $source.on('click.zoom',
        function (e) {
         if (clicked) {
  // bubble the event up to the document to trigger the unbind.
            return;
             } else {
              clicked = true;
              start(e);
              $(document).on(mousemove, zoom.move);
             $(document).one('click.zoom',
            function () {
             stop();
            clicked = false;
            $(document).off(mousemove, zoom.move);
           }
          );
          return false;
           }
          }
        );
    } else if (settings.on === 'toggle') {
        $source.on('click.zoom',
            function (e) {
                if (clicked) {
                    stop();
                } else {
                    start(e);
                }
                clicked = !clicked;
            }
        );
    } else if (settings.on === 'mouseover') {
        zoom.init(); 
 // Preemptively call init because IE7 will
 // fire the mousemove handler before the hover handler.

        $source
            .on('mouseenter.zoom', start)
            .on('mouseleave.zoom', stop)
            .on(mousemove, zoom.move);
    }

    // Touch fallback
    if (settings.touch) {
        $source
            .on('touchstart.zoom', function (e) {
                e.preventDefault();
                if (touched) {
                    touched = false;
                    stop();
                } else {
                    touched = true;
                    start( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
                }
            })
            .on('touchmove.zoom', function (e) {
                e.preventDefault();
                zoom.move( e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] );
            });
    }
				
				if ($.isFunction(settings.callback)) {
					settings.callback.call(img);
				}
			};

			img.src = settings.url;
		});
	};

	$.fn.zoom.defaults = defaults;
}(window.jQuery));