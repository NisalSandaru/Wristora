function indexOnloadFunctions() {
    checkSessionCart();
    loadProductData();
}
async function checkSessionCart() {
    const popup = new Notification();
    const response = await fetch("CheckSessionCart");
    if (response.status === 1) {  // 401 = Unauthorized
        popup.error({
            message: "You are not logged in!"
        });
    } else if (!response.ok) {
        popup.error({
            message: "Something went wrong! Try again shortly"
        });
    }
}

async function loadProductData() {

    const popup = new Notification();
    const response = await fetch("LoadHomeData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            loadNewArrivals(json);
        } else {
            popup.error({
                message: "Something went wrong! Try again shortly"
            });
        }
    } else {
        popup.error({
            message: "Something went wrong! Try again shortly"
        });
    }
}

function loadNewArrivals(json) {

    const new_arrival_product_container = document.getElementById("new-arrival-product-container");
    new_arrival_product_container.innerHTML = "";

    json.productList.forEach(item => {
        let product_card = `<div class="col">
                                <div class="mirora-product">
                                    <div class="product-img">
                                        <img src="product-images\\${item.id}\\image1.png" alt="Product" class="primary-image" />
                                        <img src="product-images\\${item.id}\\image2.png" alt="Product" class="secondary-image" />
                                        <div class="product-img-overlay">
                                            <span class="product-label discount">-7%</span>
                                            <a href="product-details.html?id=${item.id}" class="btn btn-transparent btn-fullwidth btn-medium btn-style-1">Quick View</a>
                                        </div>
                                    </div>
                                    <div class="product-content text-center">
                                        <span>Cartier</span>
                                        <h4><a href="product-details.html?id=${item.id}">${item.title}</a></h4>
                                        <div class="product-price-wrapper">
                                            <span class="money">Rs. ${new Intl.NumberFormat(
                "en-US",
                {minimumFractionDigits: 2})
                .format(item.price)}</span>
                                        </div>
                                    </div>
                                    <div class="mirora_product_action text-center position-absolute">
                                        <div class="product-rating">
                                            <span>
                                                <i class="fa fa-star theme-star"></i>
                                                <i class="fa fa-star theme-star"></i>
                                                <i class="fa fa-star theme-star"></i>
                                                <i class="fa fa-star theme-star"></i>
                                                <i class="fa fa-star"></i>
                                            </span>
                                        </div>
                                        <p>It is a long established fact that a reader will be distracted by the readable content...</p>
                                        <div class="product-action">
                                            <a class="same-action" href="wishlist.html" title="wishlist">
                                                <i class="fa fa-heart-o"></i>
                                            </a>
                                            <a href="#" class="add_cart cart-item action-cart" title="wishlist"><span onclick="addToCart(${item.id},1);">Add to cart</span></a>
                                            <a class="same-action compare-mrg" data-bs-toggle="modal" data-bs-target="#productModal" href="compare.html">
                                                <i class="fa fa-sliders fa-rotate-90"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

        new_arrival_product_container.innerHTML += product_card;
    });
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
                message: "Something went wrong. Try again"
            });

        }
    } else {
        popup.error({
            message: "Something went wrong. Try again"
        });
    }
}
