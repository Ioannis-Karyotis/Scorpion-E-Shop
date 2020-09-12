module.exports = function Cart(previousCart){
  this.products = previousCart.products || {}; //if there's no previousCart, create a blank object for the products
  this.totalPrice = previousCart.totalPrice || 0;  //if there's no previousCart,  set the value to 0
  this.totalQuantity = previousCart.totalQuantity || 0; //if there's no previousCart,  set the value to 0
  this.productList = previousCart.productList || [];

  this.add = function(productToAdd, qty ,size , color){
    let id = productToAdd.id; //get the id of the product to be added
    let product = this.products[id];  //get the product from the porducts object with the specified id
    if(!product){                     //if that object does not exist (new item to be added)
      product = this.products[id] = 
        {
          product: productToAdd,
          variants : [{
            color : color,
            size :  size ,
            quantity : qty,
            price: productToAdd.price * qty
          }],   
        };
    }
    else if(product){
      var found = false;
      product.variants.forEach(function(item){
        if (item.color == color && item.size == size) {
          item.quantity += qty;////update the quantity for either the new product or an already existing one
          item.price += productToAdd.price * qty;
          found = true;
        }
      });
      if (!found) {
        product.variants.push({
          color : color,
          size :  size ,
          quantity : qty,
          price: productToAdd.price * qty
        })
      }
    }
     //update the price for either the new product or an already existing one  
    this.totalPrice += productToAdd.price * qty;  //update the total price
    this.totalQuantity += qty; //update the total quantity
  }

  this.productList = function(){
    var pL = [];
    for (var id in this.products) {
      pL.push(this.products[id]);
    }
    return pL;
  }

  this.updateQuantity = function(id, qty ,size , color){
    let qtyNow = null;
    let prcNow = null;
    let prevPrice = null;
    let prevQty = null;
    let product = this.products[id];
    product.variants.forEach(function(item){
      if (item.color == color && item.size == size) {
        prevPrice = item.price;
        prevQty = item.quantity;
        qtyNow = qty;
        prcNow = product.product.price * qtyNow;
        item.quantity = qtyNow;
        item.price = prcNow;
      }   
    });
    this.totalPrice += prcNow - prevPrice;
    this.totalQuantity += qtyNow - prevQty;

    return prcNow;
  }

  this.removeProduct = function(id){
    let product = this.products[id[0]];
    let itemToRmv = null;
    product.variants.forEach(function(item){
      if (item.color == id[2] && item.size == id[1]) {
        itemToRmv = product.variants.pop(item);
      }   
    });
    this.totalPrice -= itemToRmv.price;
    this.totalQuantity -= itemToRmv.quantity;
    if (product.variants.length == 0 ) {
      delete this.products[id[0]];
    }
  }
}
