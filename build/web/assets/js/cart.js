async  function loadCartItems() {

    const popup = new Notification();


    //send data using get
    const response = await fetch("LoadCartItems");

    if (response.ok) {

        //if the response is ok

        const json = await response.json();

        if (json.status) {

            //if the status is true
            console.log(json);

            const cart_item_container = document.getElementById("cart-item-container");

            cart_item_container.innerHTML = "";

            let total = 0;
            let totalQty = 0;

            json.cartItems.forEach(cart => {

                let productSubTotal = cart.product.price * cart.qty;
                total += productSubTotal;
                totalQty += cart.qty;

                let tableData = `<tr id="cart-item-row">
                                                    <td><a class="delete" href="#"><i class="fa fa-times"></i></a></td>
                                                    <td>
                                                        <a href="product-details.html?id=${cart.product.id}">
                                                            <img src="product-images\\${cart.product.id}\\image1.png" alt="product">
                                                        </a>
                                                    </td>
                                                    <td class="wide-column">
                                                        <h3><a href="product-details.html?id=${cart.product.id}">${cart.product.title}</a></h3>
                                                    </td>
                                                    <td class="cart-product-price"><strong>${new Intl.NumberFormat("en-US",
                {minimumFractionDigits:2}).format(cart.product.price)}</strong></td>
                                                    <td>
                                                        <div class="quantity">
                                                            <input type="number" class="quantity-input" name="qty" id="pro_qty" value="${cart.qty}" min="1">
                                                        </div>
                                                    </td>
                                                    <td class="cart-product-price"><strong>${new Intl.NumberFormat("en-US",
                {minimumFractionDigits:2}).format(productSubTotal)}</strong></td>
                                                </tr>`

                cart_item_container.innerHTML += tableData;

            });

            document.getElementById("order-total-quantity").innerHTML = totalQty;
            document.getElementById("order-total-amount").innerHTML = new Intl.NumberFormat("en-US",
                    {minimumFractionDigits: 2}).format(total);

        }

    } else {

        popup.error({

            message: "Cart Items Loading Failed"

        });

    }

}
