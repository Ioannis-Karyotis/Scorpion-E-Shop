module.exports = function Cart(previousCart){
  this.products = previousCart.products || {}; //if there's no previousCart, create a blank object for the products
  this.totalPrice = previousCart.totalPrice || 0;  //if there's no previousCart,  set the value to 0
  this.totalQuantity = previousCart.totalQuantity || 0; //if there's no previousCart,  set the value to 0
  this.productList = previousCart.productList || [];

  this.add = function(productToAdd){
    let id = productToAdd.id; //get the id of the product to be added
    let product = this.products[id];  //get the product from the porducts object with the specified id
    if(!product){                     //if that object does not exist (new item to be added)
      product = this.products[id] = {product: productToAdd, quantity: 0, price: 0};
      //create a new one with the aobove attributes and associate that id
      //products: {
      //  id:{
      //    product: [Object],
      //    quantity: 0,
      //    price: 0
      //  }
      //}
      //basically, an array is an object so when I do products[id], I create
      //a new entry with the specified id and then I create a new entry for that id
      //this way I end up with a key-value pair where the id=key and the object=value implicitly
      //without having to deal with hash maps
    }
    product.price += productToAdd.price; //update the price for either the new product or an already existing one
    product.quantity ++; ////update the quantity for either the new product or an already existing one
    this.totalPrice += productToAdd.price;  //update the total price
    this.totalQuantity ++; //update the total quantity
  }

  this.productList = function(){
    var pL = [];
    for (var id in this.products) {
      pL.push(this.products[id]);
    }
    return pL;
  }

  this.updateQuantity = function(id, qty){
    let prevPrice = this.products[id].price;
    let prevQty = this.products[id].quantity;
    this.products[id].quantity = qty;
    this.products[id].price = this.products[id].product.price * qty;
    this.totalPrice += this.products[id].price - prevPrice;
    this.totalQuantity += this.products[id].quantity - prevQty;
  }

  this.removeProduct = function(id){
    let product = this.products[id];
    delete this.products[id];
    this.totalPrice -= product.price;
    this.totalQuantity -= product.quantity;
  }
}
