let modelList;
async function loadProductData() {
    const response = await fetch("LoadProdcutData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            loadSelect("brand", json.brandList, "name");
            modelList = json.modelList;
//            loadSelect("model", json.modelList, "name");
            loadSelect("color", json.colorList, "value");
            loadSelect("condition", json.qualityList, "value");
        } else {
            document.getElementById("message").innerHTML = "Something went wrong. Please try again later";
        }
    } else {
        document.getElementById("message").innerHTML = "Product loading failed. Please try again";
    }
}

function loadSelect(selectId, items, property) {
    const select = document.getElementById(selectId);
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item[property];
        select.appendChild(option);
    });
}

function loadModels() {
    const brandId = document.getElementById("brand").value;
    const modelSelect = document.getElementById("model");
    modelSelect.length = 1;
    modelList.forEach(item => {
        if (item.brand.id === parseInt(brandId)) {
            const option = document.createElement("option");
            option.value = item.id;
            option.innerHTML = item.name;
            modelSelect.appendChild(option);
        }
    });
}

async function saveProduct() {
    const popup = new Notification();
    const brandId = document.getElementById("brand").value;
    const modelId = document.getElementById("model").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const colorId = document.getElementById("color").value;
    const conditionId = document.getElementById("condition").value;
    const price = document.getElementById("price").value;
    const qty = document.getElementById("qty").value;

    const image1 = document.getElementById("img1").files[0];
    const image2 = document.getElementById("img2").files[0];
    const image3 = document.getElementById("img3").files[0];
    const image4 = document.getElementById("img4").files[0];

    const form = new FormData();
    form.append("brandId", brandId);
    form.append("modelId", modelId);
    form.append("title", title);
    form.append("description", description);
    form.append("colorId", colorId);
    form.append("conditionId", conditionId);
    form.append("price", price);
    form.append("qty", qty);
    form.append("image1", image1);
    form.append("image2", image2);
    form.append("image3", image3);
    form.append("image4", image4);

    const response = await fetch("SaveProduct", {
        method: "POST",
        body: form
    });
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            popup.success({
                message: "New product added successfully"
            });
            document.getElementById("brand").value = 0;
            document.getElementById("model").value = 0;
            document.getElementById("title").value="";
            document.getElementById("description").value = "";
            document.getElementById("color").value = 0;
            document.getElementById("condition").value = 0;
            document.getElementById("price").value="0.00";
            document.getElementById("qty").value = 1;
            document.getElementById("img1").value = "";
            document.getElementById("img2").value = "";
            document.getElementById("img3").value = "";
            document.getElementById("img4").value = "";
        } else {
            if (json.message === "Please sign in!") {
                window.location = "sign-in.html";
            } else {
                popup.error({
                    message: json.message
                });
            }
        }
    } else {

    }
}