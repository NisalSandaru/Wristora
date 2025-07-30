async function loadData() {
    const popup = new Notification();
    const response = await fetch("LoadData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            loadOptions("brand", json.brandList, "name");
            loadOptions("condition", json.qualityList, "value");
            loadOptions("color", json.colorList, "value");

            updateProductView(json);
        } else {
            popup.error({
                message: "Somthing went wrong"
            });
        }
    } else {
        popup.error({
            message: "Somthing went wrong"
        });
    }

}

function loadOptions(prefix, dataList, property) {
    const options = document.getElementById(prefix + "-options");
    const li = document.getElementById(prefix + "-li");
    options.innerHTML = "";

    dataList.forEach(item => {
        const li_clone = li.cloneNode(true);
        const anchor = li_clone.querySelector("#" + prefix + "-a");

        if (prefix === "color") {
            anchor.style.width = "24px";
            anchor.style.height = "24px";
            anchor.style.borderRadius = "50%";
            anchor.style.display = "inline-block";
            anchor.style.border = "2px solid transparent";
            anchor.style.backgroundColor = item[property];
            anchor.setAttribute("title", item[property]);
        } else {
            anchor.innerHTML = item[property];
            anchor.style.color = "#AFAFAF"; // default grey
        }

        options.appendChild(li_clone);
    });

    // Add click behavior
    const all_li = document.querySelectorAll(`#${prefix}-options li`);
    all_li.forEach(list => {
        list.addEventListener("click", function () {
            all_li.forEach(y => {
                y.classList.remove("chosen");
                const a = y.querySelector("a");
                if (!a) return;
                if (prefix === "color") {
                    a.style.border = "2px solid transparent";
                } else {
                    a.style.color = "#AFAFAF"; // reset to default
                }
            });

            this.classList.add("chosen");
            const selectedAnchor = this.querySelector("a");
            if (!selectedAnchor) return;

            if (prefix === "color") {
                selectedAnchor.style.border = "3px solid #ffffff";
            } else {
                selectedAnchor.style.color = "#a8741a"; // golden brown for selected brand/condition
            }
        });
    });
}


async function searchProduct(firstResult) {
    const popup = new Notification();
    const brand_name = document.getElementById("brand-options")
            .querySelector(".chosen")?.querySelector("a").innerHTML; // ? - optional chanining > access if exists

    const condition_name = document.getElementById("condition-options")
            .querySelector(".chosen")?.querySelector("a").innerHTML;

    const color_name = document.getElementById("color-options")
            .querySelector(".chosen")?.querySelector("a").style.backgroundColor;

    const price_range_start = $("#slider-range").slider("values", 0); //left
    const price_range_end = $("#slider-range").slider("values", 1);//right

    const sort_value = document.getElementById("st-sort").value;

    const data = {
        firstResult: firstResult,
        brandName: brand_name,
        conditionName: condition_name,
        colorName: color_name,
        priceStart: price_range_start,
        priceEnd: price_range_end,
        sortValue: sort_value
    };

    const dataJSON = JSON.stringify(data);
    console.log(dataJSON);

    const response = await fetch("SearchProducts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: dataJSON
            });

    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            updateProductView(json);
            popup.success({
                message: "Product Loading Complete..."
            });
        } else {
            popup.error({
                message: "Somthing went wrong. Please try again later"
            });
        }
    } else {
        popup.error({
            message: "Somthing went wrong. Please try again later"
        });
    }
}


const st_product = document.getElementById("st-product"); // product card parent node
//let st_pagination_button = document.getElementById("st-pagination-button");
//let current_page = 0;

function updateProductView(json) {
    const product_container = document.getElementById("st-product-container");
    product_container.innerHTML = "";
    json.productList.forEach(product => {
        let st_product_clone = st_product.cloneNode(true);// enable child nodes cloning / allow child nodes
        st_product_clone.querySelector("#st-product-a-1").href = "single-product.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-img-1").src = "product-images//" + product.id + "//image1.png";
        st_product_clone.querySelector("#st-product-img-2").src = "product-images//" + product.id + "//image2.png";
        st_product_clone.querySelector("#st-product-add-to-cart").addEventListener(
                "click", (e) => {
            addToCart(product.id, 1);
            e.preventDefault();
        });
        st_product_clone.querySelector("#st-product-a-2").href = "single-product.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-title-1").innerHTML = product.title;
        st_product_clone.querySelector("#st-product-price-1").innerHTML = new Intl.NumberFormat(
                "en-US",
                {minimumFractionDigits: 2})
                .format(product.price);
        ;
        //append child
        product_container.appendChild(st_product_clone);
    });

//    let st_pagination_container = document.getElementById("st-pagination-container");
//    st_pagination_container.innerHTML = "";
//    let all_product_count = json.allProductCount;
//    document.getElementById("all-item-count").innerHTML = all_product_count;
//    let product_per_page = 6;
//    let pages = Math.ceil(all_product_count / product_per_page); // round upper integer 
//
//    //previous-button
//    if (current_page !== 0) {
//        let st_pagination_button_prev_clone = st_pagination_button.cloneNode(true);
//        st_pagination_button_prev_clone.innerHTML = "Prev";
//        st_pagination_button_prev_clone.addEventListener(
//                "click", (e) => {
//            current_page--;
//            searchProduct(current_page * product_per_page);
//            e.preventDefault();
//        });
//        st_pagination_container.appendChild(st_pagination_button_prev_clone);
//    }
//
//
//    // pagination-buttons
//    for (let i = 0; i < pages; i++) {
//        let st_pagination_button_clone = st_pagination_button.cloneNode(true);
//        st_pagination_button_clone.innerHTML = i + 1;
//        st_pagination_button_clone.addEventListener(
//                "click", (e) => {
//            current_page = i;
//            searchProduct(i * product_per_page);
//            e.preventDefault();
//        });
//
//        if (i === Number(current_page)) {
//            st_pagination_button_clone.className = "axil-btn btn btn-primary btn-lg fw-bold ml--10";
//        } else {
//            st_pagination_button_clone.className = "axil-btn btn btn-outline-secondary btn-lg ml--10";
//        }
//        st_pagination_container.appendChild(st_pagination_button_clone);
//    }
//
//    // next-button
//    if (current_page !== (pages - 1)) {
//        let st_pagination_button_next_clone = st_pagination_button.cloneNode(true);
//        st_pagination_button_next_clone.innerHTML = "Next";
//        st_pagination_button_next_clone.addEventListener(
//                "click", (e) => {
//            current_page++;
//            searchProduct(current_page * product_per_page);
//            e.preventDefault();
//        });
//        st_pagination_container.appendChild(st_pagination_button_next_clone);
//    }
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
    }else{
        popup.error({
                message: "Somthing went wrong"
            });
    }
}