async function loadData() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const productId = searchParams.get("id");
        console.log(productId);

        const response = await fetch("LoadSingleProduct?id=" + productId);
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log(json);

                //single-product-images
                document.getElementById("image1").src = "product-images\\" + json.product.id + "\\image1.png";
                document.getElementById("img1").href = "product-images\\" + json.product.id + "\\image1.png";

                document.getElementById("image2").src = "product-images\\" + json.product.id + "\\image2.png";
                document.getElementById("img2").href = "product-images\\" + json.product.id + "\\image2.png";

                document.getElementById("image3").src = "product-images\\" + json.product.id + "\\image3.png";
                document.getElementById("img3").href = "product-images\\" + json.product.id + "\\image3.png";

                document.getElementById("image4").src = "product-images\\" + json.product.id + "\\image4.png";
                document.getElementById("img4").href = "product-images\\" + json.product.id + "\\image4.png";

                document.getElementById("thumb-image1").src = "product-images\\" + json.product.id + "\\image1.png";
                document.getElementById("thumb-image2").src = "product-images\\" + json.product.id + "\\image2.png";
                document.getElementById("thumb-image3").src = "product-images\\" + json.product.id + "\\image3.png";
                document.getElementById("thumb-image4").src = "product-images\\" + json.product.id + "\\image4.png";
                //single-product-images-end

                document.getElementById("product-title").innerHTML = json.product.title;
                document.getElementById("product-price").innerHTML = new Intl.NumberFormat(
                        "en-US",
                        {minimumFractionDigits: 2})
                        .format(json.product.price);
                document.getElementById("brand-name").innerHTML = json.product.model.brand.name;
                document.getElementById("model-name").innerHTML = json.product.model.name;
                document.getElementById("product-quality").innerHTML = json.product.quality.value;
                document.getElementById("product-stock").innerHTML = json.product.qty;

                // product-color
                const colorSpan = document.getElementById("product-color");

                // Set the text (e.g., "Black", "#ff0000", etc.)
                colorSpan.innerHTML = json.product.color.value;
                colorSpan.style.color = json.product.color.value;

                //product-description
                document.getElementById("description").innerHTML = json.product.description;


                //add-to-cart-main-button
                const addToCartMain = document.getElementById("add-to-cart-main");
                addToCartMain.addEventListener(
                        "click", (e) => {
                    addToCart(json.product.id, document.getElementById("add-to-cart-qty").value);
                    e.preventDefault();
                });
                //add-to-cart-main-button-end


                //similer-products
                let similer_product_main = document.getElementById("smiler-product-main");
                let productHtml = document.getElementById("similer-product");
                similer_product_main.innerHTML = "";
                json.productList.forEach(item => {
                    let productCloneHtml = productHtml.cloneNode(true);
                    productCloneHtml.querySelector("#similer-product-a1").href = "product-details.html?id=" + item.id;
                    productCloneHtml.querySelector("#similer-product-image").src = "product-images\\" + item.id + "\\image1.png";
                    productCloneHtml.querySelector("#similer-product-image1").src = "product-images\\" + item.id + "\\image2.png";
                    productCloneHtml.querySelector("#simler-product-add-to-cart").addEventListener(
                            "click", (e) => {
                        addToCart(item.id, 1);
                        e.preventDefault();
                    });
                    productCloneHtml.querySelector("#similer-product-a2").href = "product-details.html?id=" + item.id;
                    productCloneHtml.querySelector("#similer-product-title").innerHTML = item.title;
                    productCloneHtml.querySelector("#similer-product-price").innerHTML = "Rs. " + new Intl.NumberFormat(
                            "en-US",
                            {minimumFractionDigits: 2})
                            .format(item.price);
                    ;

                    // append the clone code
                    similer_product_main.appendChild(productCloneHtml);

                });
                //similer-products-end


            }
        }

    }
}

async function addToCart(productId, qty) {
    const popup = new Notification();
    const response = await fetch("AddToCart?prId=" + productId + "&qty=" +qty);
    if(response.ok){
        const json = await response.json();
        if(json.status){
            popup.success({
                message: json.message
            });
        }else{
            popup.success({
                message: "Somthing went wrong"
            });
        }
    }
}