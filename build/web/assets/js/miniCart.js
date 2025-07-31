async function viewCart() {
    const popup = new Notification();
    const response = await fetch("LoadCartItems");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            const side_panel_cart_item_list = document.getElementById("side-panal-cart-item-list");
            side_panel_cart_item_list.innerHTML = "";

            let total = 0;
            let totalQty = 0;
            json.cartItems.forEach(cart => {
                let productSubTotal = cart.product.price * cart.qty;
                total += productSubTotal;
                totalQty += cart.qty;
                let cartItem = `<div class="mini-cart__item--single">
                                                                <div class="mini-cart__item--image">
                                                                    <img src="product-images\\${cart.product.id}\\image1.png" alt="product">
                                                                </div>
                                                                <div class="mini-cart__item--content">
                                                                    <h4 class="mini-cart__item--name"><a href="product-details.html?id=${cart.product.id}">${cart.product.title}</a> </h4>
                                                                    <p class="mini-cart__item--quantity">${cart.qty}</p>
                                                                    <p class="mini-cart__item--price">${new Intl.NumberFormat(
                        "en-US",
                        {minimumFractionDigits: 2})
                        .format(cart.product.price)}</p>
                                                                </div>
                                                                <a class="mini-cart__item--remove" href="#"><i class="icon_close" onclick="removeCartItems(${cart.product.id});"></i></a>
                                                            </div>`;
                side_panel_cart_item_list.innerHTML += cartItem;
            });
            document.getElementById("side-panel-cart-sub-total").innerHTML = new Intl.NumberFormat("en-US",
                    {minimumFractionDigits: 2})
                    .format(total);
            
            document.getElementById("miniPrice").innerHTML = new Intl.NumberFormat("en-US",
                    {minimumFractionDigits: 2})
                    .format(total);
            
            document.getElementById("count").innerHTML = totalQty;
            
        }else if(json.message == "your cart is Empty."){
            
        }else {
            popup.error({
                message: json.message
            });
        }
    } else {
        popup.error({
            message: "Cart Items loading failed..."
        });
    }
}
