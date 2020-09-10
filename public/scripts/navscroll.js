$(document).ready(function(){

/**
 * This object controls the nav bar. Implement the add and remove
 * action over the elements of the nav bar that we want to change.
 *
 * @type {{flagAdd: boolean, elements: string[], add: Function, remove: Function}}
 */
var myNavBar = {

    flagAdd: true,

    elements: [],

    init: function (elements) {
        this.elements = elements;
    },

    add : function() {
        if(this.flagAdd) {
            for(var i=0; i < this.elements.length; i++) {
                if (window.location.pathname == "/" || window.location.pathname == "/contact") {
                    document.getElementById(this.elements[i]).className += " fixed-theme";
                }else{
                    document.getElementById(this.elements[i]).className += " fixed-theme2";
                }
               
            }
            this.flagAdd = false;
        }
    },

    remove: function() {
        for(var i=0; i < this.elements.length; i++) {
            if (window.location.pathname == "/" || window.location.pathname == "/contact") {
                    document.getElementById(this.elements[i]).className =
                    document.getElementById(this.elements[i]).className.replace( /(?:^|\s)fixed-theme(?!\S)/g , '' );
                }else{
                    document.getElementById(this.elements[i]).className =
                    document.getElementById(this.elements[i]).className.replace( /(?:^|\s)fixed-theme2(?!\S)/g , '' );
                }            
        }
        this.flagAdd = true;
    }

};

/**
 * Init the object. Pass the object the array of elements
 * that we want to change when the scroll goes down
 */
myNavBar.init(  [
    "menu-nav",
    "header-container",
    "main"
]);

/**
 * Function that manage the direction
 * of the scroll
 */
function offSetManager(){

    var yOffset = document.getElementById("logo-nav").offsetTop + document.getElementById("logo-nav").offsetHeight
    console.log(yOffset);
    var currYOffSet = window.pageYOffset;

    if(yOffset < currYOffSet) {
        myNavBar.add();
        document.getElementById("scrollToTop").classList.remove("d-flex");
        document.getElementById("scrollToTop").classList.remove("d-block");
        document.getElementById("scrollToTop").classList.add("d-none")
    }
    else if(currYOffSet = yOffset){
        myNavBar.remove();
        document.getElementById("scrollToTop").classList.add("d-flex");
        document.getElementById("scrollToTop").classList.add("d-block");
        document.getElementById("scrollToTop").classList.remove("d-none")
    }

}

function offSetManager2(){

    var yOffset = document.getElementById("logo-nav").offsetTop + document.getElementById("logo-nav").offsetHeight
    console.log(yOffset);
    var currYOffSet = window.pageYOffset;

    if(yOffset < currYOffSet) {
        document.getElementById("scrollToTop").classList.add("d-flex");
        document.getElementById("scrollToTop").classList.add("d-block");
        document.getElementById("scrollToTop").classList.add("fade-in");
        document.getElementById("scrollToTop").classList.remove("d-none")
    }
    else if(currYOffSet = yOffset){
        document.getElementById("scrollToTop").classList.remove("d-flex");
        document.getElementById("scrollToTop").classList.remove("d-block");
        document.getElementById("scrollToTop").classList.remove("fade-in");
        document.getElementById("scrollToTop").classList.add("d-none");
    }
}

/**
 * bind to the document scroll detection
 */
window.onscroll = function(e) {
    
    if(window.innerWidth > 756 && window.pageYOffset != 0){
        offSetManager();
    }else if(window.innerWidth < 756 && window.pageYOffset != 0){
        offSetManager2();
    }else{
        myNavBar.remove();
    }

    
}

/**
 * We have to do a first detectation of offset because the page
 * could be load with scroll down set.
 */
// offSetManager();



// When there is a flash
var flash = function (){
        document.getElementById(this.elements[2]).className =
        document.getElementById(this.elements[2]).className.replace( /(?:^|\s)fixed-theme(?!\S)/g , '' );
    this.flagAdd = true;
}


});