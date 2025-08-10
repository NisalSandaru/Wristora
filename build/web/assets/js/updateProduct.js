async function loadUpdateData() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const productId = searchParams.get("id");
        console.log(productId);

        const response = await fetch("LoadSingleProduct?id=" + productId);
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                console.log(json);

                document.getElementById("brand").value = json.product.model.brand.name;
                document.getElementById("model").value = json.product.model.name;
                document.getElementById("title").value = json.product.title;
                document.getElementById("description").value = json.product.description;
                document.getElementById("color").value = json.product.color.value;
                document.getElementById("condition").value = json.product.quality.value;
                document.getElementById("price").value = json.product.price;
                document.getElementById("qty").value = json.product.qty;
            }

        }

    }

}

async function updateProduct() {
    const popup = new Notification();
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const productId = searchParams.get("id");
        console.log(productId);

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const qty = document.getElementById("qty").value;

        const userDataObject = {
            productId: productId,
            title: title,
            description: description,
            qty: qty
        };

        console.log(userDataObject);

        const userDataJSON = JSON.stringify(userDataObject);

        const response = await fetch("UpdateProduct", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: userDataJSON
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                popup.success(
                        {
                            message: json.message
                        }
                );
            } else if (json.message == "log in!") {
                window.location = "adminSign-in.html";
            } else {
                popup.error(
                        {
                            message: json.message
                        }
                );
            }
        } else {
            popup.error(
                    {
                        message: "somthing went wrong"
                    }
            );
        }

    } else {
        popup.error(
                {
                    message: "Product id cant find"
                }
        );
    }
}