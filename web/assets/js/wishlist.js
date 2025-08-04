async  function loadWishItems() {
    const popup = new Notification();
    //send data using get

    const response = await fetch("LoadWishlistItems");
    if (response.ok) {
        //if the response is ok
        const json = await response.json();

        if (json.status) {
            console.log(json);
            //if the status is true
            const wish_item_container = document.getElementById("wish-item-container");

            wish_item_container.innerHTML = "";

            let stockStatus = "";
            let stockName = "";
            json.sessionWishes.forEach(wish => {

                let qty = wish.product.qty;
                if (qty>=1) {
                    stockStatus = "in-stock";
                    stockName = "In Stock";
                }else{
                    stockStatus = "out-stock";
                    stockName = "Out of Stock";
                }

                let tableData = `<tr>
                                                    <td><a class="delete" href="#"><i class="fa fa-times"></i></a></td>
                                                    <td>
                                                        <a href="product-details.html?id=${wish.product.id}">
                                                            <img src="product-images\\${wish.product.id}\\image1.png" alt="product">
                                                        </a>
                                                    </td>
                                                    <td><h3><a href="product-details.html?id=${wish.product.id}">${wish.product.title}</a></h3></td>
                                                    <td class="cart-product-price"><strong>${new Intl.NumberFormat("en-US",
                        {minimumFractionDigits: 2}).format(wish.product.price)}</strong></td>
                                                    <td>
                                                        <span class="${stockStatus}">${stockName}</span>
                                                    </td>
                                                    <td><a href="#" class="btn add-to-cart btn-medium btn-style-2" onclick="addToCart(${wish.product.id},1);" ${qty < 1 ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>Add to Cart</a></td>
                                                </tr>`;

                wish_item_container.innerHTML += tableData;

            });

//            document.getElementById("order-total-quantity").innerHTML = totalQty;
//            document.getElementById("order-total-amount").innerHTML = new Intl.NumberFormat("en-US",
//                    {minimumFractionDigits: 2}).format(total);
        }

    } else {
        popup.error({
            message: "Wishlist Items Loading Failed"
        });
    }
}


async function addToCart(productId, qty) {
    const popup = new Notification();// link notification js in single-product.html
    const response = await fetch("AddToCart?prId=" + productId + "&qty=" + qty);
    if (response.ok) {
        const json = await response.json(); // await response.text();
        if (json.status) {
            popup.success({
                message: json.message
            });
        } else {
            popup.error({
                message: json.message
            });

        }
    } else {
        popup.error({
            message: "Something went wrong. Try again"
        });
    }
}

